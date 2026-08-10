import { describe, expect, it } from "vitest";
import * as ts from "typescript-strada";

import {
  BASELINE_LIB,
  createTypecheckSession,
  entryLibsFor,
  libFileNameFor,
} from "@/typecheck/host";
import type { TypecheckOptions } from "@/typecheck/types";
import { loadStradaLibsForTests } from "../helpers/strada-libs";

const baselineLibs = loadStradaLibsForTests([BASELINE_LIB]);

function check(code: string, options?: TypecheckOptions) {
  const session = createTypecheckSession({ ts, libs: baselineLibs });
  try {
    return session.check(code, options);
  } finally {
    session.dispose();
  }
}

describe("typecheck host", () => {
  it("maps lib aliases to file names", () => {
    expect(libFileNameFor("es2022")).toBe("lib.es2022.d.ts");
    expect(libFileNameFor("es6")).toBe("lib.es2015.d.ts");
    expect(libFileNameFor("dom.iterable")).toBe("lib.dom.iterable.d.ts");
  });

  it("always includes the baseline lib", () => {
    expect(entryLibsFor()).toEqual([BASELINE_LIB]);
    expect(entryLibsFor({ libs: ["dom"] })).toEqual([BASELINE_LIB, "dom"]);
  });

  it("reports a type error on a bad assignment", () => {
    const { diagnostics } = check(`const n: number = "no";\n`);
    expect(diagnostics.some((d) => d.code === 2322)).toBe(true);
  });

  it("is silent on valid code", () => {
    const { diagnostics } = check(`const n: number = 1;\n`);
    expect(diagnostics).toEqual([]);
  });

  it("uses Strada 6.0.3", () => {
    expect(ts.version).toBe("6.0.3");
  });
});
