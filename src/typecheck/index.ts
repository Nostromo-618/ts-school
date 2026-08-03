/**
 * The type-check engine's public surface.
 *
 * Components should import from here rather than reaching into the modules
 * below it — in particular, importing `./worker` or `./host` from the main
 * thread is how the compiler would end up in the main bundle.
 */

export type {
  ExpectedDiagnostic,
  TsDiagnostic,
  TsDiagnosticCategory,
  TypecheckErrorResponse,
  TypecheckOptions,
  TypecheckRequest,
  TypecheckResponse,
} from "./types";

export {
  createTypecheckClient,
  useTypecheck,
  DEFAULT_DEBOUNCE_MS,
} from "./client";
export type {
  TypecheckClient,
  TypecheckClientOptions,
  TypecheckWorkerLike,
  UseTypecheck,
  UseTypecheckOptions,
} from "./client";

export { formatDiagnosticMatch, matchesExpected } from "./match";
export type { DiagnosticMatch, DiagnosticPair } from "./match";

export { tsLibUrl, TS_LIB_DIRECTORY, TS_LIB_MANIFEST } from "./libs";
export type { TsLibManifest } from "./libs";
