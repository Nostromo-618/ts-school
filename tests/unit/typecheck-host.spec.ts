import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';

import {
  BASELINE_LIB,
  createTypecheckSession,
  entryLibsFor,
  libFileNameFor,
} from '@/typecheck/host';
import type { TypecheckOptions } from '@/typecheck/types';

// The libs come from the generated payload rather than straight out of
// node_modules, so this suite is also a round trip through the exact bytes the
// browser is served. `pretest` regenerates them.
const libDir = resolve(process.cwd(), 'public', 'ts-lib');
const manifest = JSON.parse(
  readFileSync(resolve(libDir, 'manifest.json'), 'utf8'),
) as { closures: Record<string, string[]> };

function loadLibs(entryLibs: string[] = [BASELINE_LIB]): Map<string, string> {
  const fileNames = new Set(
    entryLibs.flatMap((lib) => {
      const closure = manifest.closures[lib];
      if (!closure) throw new Error(`no closure for lib "${lib}"`);
      return closure;
    }),
  );
  return new Map(
    [...fileNames].map((fileName) => [
      fileName,
      readFileSync(resolve(libDir, fileName), 'utf8'),
    ]),
  );
}

const baselineLibs = loadLibs();

function check(code: string, options?: TypecheckOptions) {
  const session = createTypecheckSession({
    ts,
    libs: loadLibs(entryLibsFor(options)),
  });
  return session.check(code, options).diagnostics;
}

describe('lib file names', () => {
  it('maps option lib names onto payload file names', () => {
    expect(libFileNameFor('es2022')).toBe('lib.es2022.d.ts');
    expect(libFileNameFor('dom.iterable')).toBe('lib.dom.iterable.d.ts');
    expect(libFileNameFor('ES2022')).toBe('lib.es2022.d.ts');
    expect(libFileNameFor('es6')).toBe('lib.es2015.d.ts');
  });

  it('always includes the baseline and never duplicates it', () => {
    expect(entryLibsFor()).toEqual(['es2022']);
    expect(entryLibsFor({ libs: ['dom', 'es2022'] })).toEqual([
      'es2022',
      'dom',
    ]);
  });
});

describe('typecheck session', () => {
  it('reports a real assignability error with its exact code and span', () => {
    const diagnostics = check('const total: number = "12";');

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toEqual({
      code: 2322,
      category: 'error',
      message: `Type 'string' is not assignable to type 'number'.`,
      line: 1,
      column: 7,
      length: 'total'.length,
    });
  });

  it('reports nothing for source the compiler accepts', () => {
    expect(check('export const total: number = 12;')).toEqual([]);
  });

  it('flattens a message chain into one string', () => {
    const [diagnostic] = check(
      [
        'type Config = { retries: string };',
        'declare const raw: { retries: number };',
        'const config: Config = raw;',
      ].join('\n'),
    );

    expect(diagnostic.code).toBe(2322);
    expect(diagnostic.message.split('\n')).toEqual([
      `Type '{ retries: number; }' is not assignable to type 'Config'.`,
      `  Types of property 'retries' are incompatible.`,
      `    Type 'number' is not assignable to type 'string'.`,
    ]);
  });

  it('converts positions to 1-based line and column', () => {
    const [diagnostic] = check(
      ['const a = 1;', '', '  const b: string = a;'].join('\n'),
    );

    expect(diagnostic.line).toBe(3);
    expect(diagnostic.column).toBe(9);
    expect(diagnostic.length).toBe(1);
  });

  it('orders diagnostics by position', () => {
    const diagnostics = check(
      ['const b: string = 1;', 'const a: number = "x";'].join('\n'),
    );

    expect(diagnostics.map((d) => d.line)).toEqual([1, 2]);
  });

  it('survives source that does not parse and keeps checking afterwards', () => {
    const session = createTypecheckSession({ ts, libs: baselineLibs });

    const broken = session.check('const x: = ');
    expect(broken.diagnostics.length).toBeGreaterThan(0);
    expect(broken.diagnostics.every((d) => d.line >= 1)).toBe(true);

    expect(session.check('export const x = 1;').diagnostics).toEqual([]);
  });

  it('reports an unresolved import rather than reaching for a package', () => {
    const [diagnostic] = check('import { readFile } from "node:fs";');

    expect(diagnostic.code).toBe(2307);
    expect(diagnostic.message).toContain('node:fs');
  });

  it('never executes the source it checks', () => {
    const marker = '__ts_school_should_never_run__';
    check(`(globalThis as Record<string, unknown>)["${marker}"] = true;`);

    expect(marker in globalThis).toBe(false);
  });
});

describe('lesson-controlled options', () => {
  it('applies the strict baseline', () => {
    const [diagnostic] = check('export function id(value) { return value; }');

    expect(diagnostic.code).toBe(7006);
  });

  it('lets a lesson opt out of strictness', () => {
    expect(
      check('export function id(value) { return value; }', { strict: false }),
    ).toEqual([]);
  });

  it('omits the DOM unless a lesson asks for it', () => {
    const [diagnostic] = check('const el = document.title;');

    expect(diagnostic.message).toContain(`Cannot find name 'document'`);
  });

  it('checks against the DOM when a lesson asks for it', () => {
    expect(check('const el: string = document.title;', { libs: ['dom'] })).toEqual(
      [],
    );
  });

  it('fails loudly when a requested lib was never loaded', () => {
    const session = createTypecheckSession({ ts, libs: baselineLibs });

    expect(() => session.check('const a = 1;', { libs: ['dom'] })).toThrow(
      /lib\.dom\.d\.ts/,
    );
  });
});

describe('session reuse', () => {
  it('parses the standard library once across checks', () => {
    const session = createTypecheckSession({ ts, libs: baselineLibs });

    const first = session.check('const a: number = "1";');
    const second = session.check('const a: number = "2";');
    const third = session.check('const a: number = 3;');

    expect(first.diagnostics).toHaveLength(1);
    expect(second.diagnostics).toHaveLength(1);
    expect(third.diagnostics).toEqual([]);

    // The first check pays for 57 lib files; later ones reparse one small
    // file. A warm check that is not dramatically cheaper means the cache
    // regressed.
    expect(second.durationMs).toBeLessThan(first.durationMs / 2);
  });

  it('starts clean after dispose', () => {
    const session = createTypecheckSession({ ts, libs: baselineLibs });

    session.check('const a: number = "1";');
    session.dispose();

    expect(session.check('export const a: number = 1;').diagnostics).toEqual([]);
  });
});
