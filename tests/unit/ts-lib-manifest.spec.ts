import { describe, expect, it } from "vitest";
import * as ts from "typescript-strada";

import { STRADA_COMPILER_VERSION } from "@/curriculum/generated/diagnostics";

describe("Strada compiler pin", () => {
  it("keeps the programmatic checker on TypeScript 6.0.3", () => {
    // typescript@7 is the native CLI (no createProgram in the browser).
    // Diagnostic generation and compiler-truth use typescript-strada@6.0.3.
    expect(ts.version).toBe("6.0.3");
    expect(STRADA_COMPILER_VERSION).toBe(ts.version);
  });
});
