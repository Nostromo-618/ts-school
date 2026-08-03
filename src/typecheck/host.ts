/**
 * A first-party virtual `ts.CompilerHost`.
 *
 * The compiler runs over exactly one learner-authored file, `lesson.ts`, plus
 * the `lib.*.d.ts` closure it needs — all held in memory. There is no
 * filesystem, no module graph, and no emit: this host can read nothing it was
 * not handed, and produces nothing but diagnostics.
 *
 * TypeScript is imported HERE AS A TYPE ONLY and passed in as `ts`. The import
 * erases at build time, so this module can never drag an 8.7 MB compiler into
 * the main bundle (only `worker.ts` imports it as a value), and the same code
 * is unit-testable in plain Node with no DOM and no worker.
 */

import type * as TsModule from "typescript";
import type {
  TsDiagnostic,
  TsDiagnosticCategory,
  TypecheckOptions,
} from "./types";

/** The TypeScript public API, injected rather than imported. */
export type TypeScriptApi = typeof TsModule;

/** The single file a lesson's source occupies. */
export const LESSON_FILE_NAME = "lesson.ts";

/** Virtual filesystem root. Nothing exists above or beside it. */
const VIRTUAL_ROOT = "/";

/** Path the learner's source occupies inside the virtual filesystem. */
export const LESSON_PATH = `${VIRTUAL_ROOT}${LESSON_FILE_NAME}`;

/**
 * Always loaded. Matches `build.target`, and deliberately excludes `dom`: a
 * lesson that needs browser globals asks for them through
 * `TypecheckOptions.libs` and pays the 2.1 MB then, not on every page.
 */
export const BASELINE_LIB = "es2022";

/**
 * `--lib es6` and `--lib dom.iterable` name files. TypeScript's own `libMap` is
 * not public API, so this mirrors it for the names ts-school can request. Kept
 * in sync with `libFileNameFor()` in `scripts/sync-ts-libs.mjs`.
 */
const LIB_ALIASES = new Map([
  ["es6", "es2015"],
  ["es7", "es2016"],
]);

/** `"dom.iterable"` -> `"lib.dom.iterable.d.ts"`. Idempotent. */
export function libFileNameFor(libName: string): string {
  const normalized = libName.toLowerCase().replace(/^lib\.|\.d\.ts$/g, "");
  return `lib.${LIB_ALIASES.get(normalized) ?? normalized}.d.ts`;
}

/** Every lib a check needs: the baseline plus whatever the lesson asked for. */
export function entryLibsFor(options?: TypecheckOptions): string[] {
  return [...new Set([BASELINE_LIB, ...(options?.libs ?? [])])];
}

/**
 * The compiler configuration, of which a lesson controls exactly two knobs
 * (`strict` and `libs`). Everything else is fixed so lessons cannot drift
 * apart, and so what the compiler-truth suite asserts is what the learner sees.
 */
export function createCompilerOptions(
  ts: TypeScriptApi,
  options?: TypecheckOptions,
): TsModule.CompilerOptions {
  return {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: entryLibsFor(options).map(libFileNameFor),
    strict: options?.strict ?? true,

    // A snippet with no import or export would otherwise be a *script*, so its
    // top-level `const name = "…"` would collide with a standard-library global
    // and the learner would be told `Cannot redeclare block-scoped variable`.
    // That diagnostic is about our sandbox, not their code. Forcing module
    // semantics removes the whole class of it and enables top-level `await`.
    moduleDetection: ts.ModuleDetectionKind.Force,

    // The compiler is a checker here and nothing more. An emitter in the
    // browser would be the first half of an execution path.
    noEmit: true,

    // The standard library is trusted input we shipped ourselves; re-checking
    // it on every keystroke would dominate the latency budget.
    skipLibCheck: true,
    skipDefaultLibCheck: true,

    // Deliberately off: both fire constantly on half-written code and would
    // make the pane feel hostile while the learner is still typing.
    noUnusedLocals: false,
    noUnusedParameters: false,

    // No ambient @types can exist in a virtual filesystem with no packages.
    types: [],
    allowJs: false,
    forceConsistentCasingInFileNames: true,
    useDefineForClassFields: true,
  };
}

interface VirtualHostConfig {
  ts: TypeScriptApi;
  /** `lib.*.d.ts` text by bare file name. Read live, so it may grow. */
  libs: ReadonlyMap<string, string>;
  /** The learner's current source. */
  code: string;
  compilerOptions: TsModule.CompilerOptions;
  /** Shared across checks so the lib closure is parsed once, not per keystroke. */
  sourceFileCache: Map<string, TsModule.SourceFile>;
}

/** Last path segment. The virtual filesystem is flat, so this is the key. */
function baseNameOf(path: string): string {
  const normalized = path.replace(/\\/g, "/");
  return normalized.slice(normalized.lastIndexOf("/") + 1);
}

/**
 * Cache key. TypeScript's own document registry keys parsed files by a digest
 * of the compilation settings, because parsing and binding both depend on
 * them; this follows that precedent with the settings this host can vary.
 */
function settingsKeyOf(options: TsModule.CompilerOptions): string {
  return `${options.target}|${options.module}|${options.strict ? 1 : 0}`;
}

export function createVirtualCompilerHost(
  config: VirtualHostConfig,
): TsModule.CompilerHost {
  const { ts, libs, code, compilerOptions, sourceFileCache } = config;
  const settingsKey = settingsKeyOf(compilerOptions);

  const textOf = (path: string): string | undefined => {
    // Nothing outside the in-memory map is readable. The compiler probes for
    // `@typescript/lib-*` override packages before falling back to the default
    // library location; answering "no" keeps that probe from meaning anything.
    if (path.includes("node_modules")) return undefined;
    const name = baseNameOf(path);
    return name === LESSON_FILE_NAME ? code : libs.get(name);
  };

  return {
    getSourceFile(fileName, languageVersionOrOptions) {
      const text = textOf(fileName);
      if (text === undefined) return undefined;

      const name = baseNameOf(fileName);
      if (name === LESSON_FILE_NAME) {
        // Never cached: it is what changed.
        return ts.createSourceFile(
          LESSON_PATH,
          text,
          languageVersionOrOptions,
          true,
        );
      }

      const cacheKey = `${settingsKey}|${name}`;
      const cached = sourceFileCache.get(cacheKey);
      if (cached) return cached;

      const parsed = ts.createSourceFile(
        `${VIRTUAL_ROOT}${name}`,
        text,
        languageVersionOrOptions,
      );
      sourceFileCache.set(cacheKey, parsed);
      return parsed;
    },

    getDefaultLibFileName: () => `${VIRTUAL_ROOT}${libFileNameFor(BASELINE_LIB)}`,
    getDefaultLibLocation: () => VIRTUAL_ROOT,

    writeFile() {
      // Unreachable while `noEmit` is set and nothing calls `program.emit()`.
      // Throwing rather than ignoring keeps it that way.
      throw new Error("the type-check host does not emit");
    },

    getCurrentDirectory: () => VIRTUAL_ROOT,
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",

    fileExists: (fileName) => textOf(fileName) !== undefined,
    readFile: (fileName) => textOf(fileName),
    directoryExists: (directoryName) =>
      directoryName === VIRTUAL_ROOT || directoryName === "",
    getDirectories: () => [],

    // A lesson is one file. Every import and every type reference is
    // unresolvable by construction, which is both the honest answer for a
    // sandbox with no package graph and a hard stop on filesystem probing.
    resolveModuleNameLiterals: (moduleLiterals) =>
      moduleLiterals.map(() => ({ resolvedModule: undefined })),
    resolveTypeReferenceDirectiveReferences: (typeDirectiveReferences) =>
      typeDirectiveReferences.map(() => ({
        resolvedTypeReferenceDirective: undefined,
      })),

    // Lesson source is TypeScript, so JSDoc only matters where it carries
    // types. Skipping the rest measurably speeds up parsing the lib closure.
    jsDocParsingMode: ts.JSDocParsingMode.ParseForTypeErrors,
  };
}

function categoryOf(
  ts: TypeScriptApi,
  category: TsModule.DiagnosticCategory,
): TsDiagnosticCategory {
  switch (category) {
    case ts.DiagnosticCategory.Error:
      return "error";
    case ts.DiagnosticCategory.Warning:
      return "warning";
    case ts.DiagnosticCategory.Suggestion:
      return "suggestion";
    default:
      return "message";
  }
}

/**
 * `ts.Diagnostic` -> the shared contract: message chains flattened to one
 * string, positions converted from the compiler's 0-based offsets to the
 * 1-based line and column an editor gutter shows.
 */
export function toTsDiagnostic(
  ts: TypeScriptApi,
  diagnostic: TsModule.Diagnostic,
): TsDiagnostic {
  const position =
    diagnostic.file && diagnostic.start !== undefined
      ? ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start)
      : { line: 0, character: 0 };

  return {
    code: diagnostic.code,
    category: categoryOf(ts, diagnostic.category),
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    line: position.line + 1,
    column: position.character + 1,
    length: diagnostic.length ?? 0,
  };
}

export interface TypecheckResult {
  diagnostics: TsDiagnostic[];
  /** Time spent inside `check()`, excluding anything the caller did first. */
  durationMs: number;
}

export interface TypecheckSession {
  /**
   * Type-checks `code`. Throws if a lib the options require is missing from
   * the map the session was given.
   */
  check(code: string, options?: TypecheckOptions): TypecheckResult;
  /** Drops the cached programs and parsed lib files. */
  dispose(): void;
}

export interface TypecheckSessionConfig {
  ts: TypeScriptApi;
  /**
   * `lib.*.d.ts` text by bare file name. Read at check time rather than
   * copied, so a caller loading libs lazily can keep adding to it.
   */
  libs: ReadonlyMap<string, string>;
}

const now = (): number =>
  typeof performance === "undefined" ? Date.now() : performance.now();

/**
 * A long-lived checker. Across checks it reuses the parsed standard library and
 * hands the previous program to the compiler, so a keystroke reparses one small
 * file instead of 459 KB of `.d.ts`.
 */
export function createTypecheckSession(
  config: TypecheckSessionConfig,
): TypecheckSession {
  const { ts, libs } = config;
  const sourceFileCache = new Map<string, TsModule.SourceFile>();
  let previousProgram: TsModule.Program | undefined;

  return {
    check(code, options) {
      const startedAt = now();
      const compilerOptions = createCompilerOptions(ts, options);

      const missing = entryLibsFor(options)
        .map(libFileNameFor)
        .filter((fileName) => !libs.has(fileName));
      if (missing.length > 0) {
        throw new Error(
          `standard library not loaded: ${missing.join(", ")}. ` +
            `Requested libs: ${entryLibsFor(options).join(", ")}.`,
        );
      }

      const host = createVirtualCompilerHost({
        ts,
        libs,
        code,
        compilerOptions,
        sourceFileCache,
      });

      const program = ts.createProgram({
        rootNames: [LESSON_PATH],
        options: compilerOptions,
        host,
        oldProgram: previousProgram,
      });
      previousProgram = program;

      const lesson = program.getSourceFile(LESSON_PATH);
      if (!lesson) {
        throw new Error(`the virtual host lost ${LESSON_PATH}`);
      }

      // Only the learner's file. Program-wide and global diagnostics describe
      // our configuration, not their code.
      const diagnostics = [
        ...program.getSyntacticDiagnostics(lesson),
        ...program.getSemanticDiagnostics(lesson),
      ]
        .map((diagnostic) => toTsDiagnostic(ts, diagnostic))
        .sort(
          (a, b) =>
            a.line - b.line || a.column - b.column || a.code - b.code,
        );

      return { diagnostics, durationMs: now() - startedAt };
    },

    dispose() {
      sourceFileCache.clear();
      previousProgram = undefined;
    },
  };
}
