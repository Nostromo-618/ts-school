/**
 * Tooling & the strictness ladder — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as tscCli } from "./tsc-cli";
import { lesson as tsserverAndYourEditor } from "./tsserver-and-your-editor";
import { lesson as eslintWithTypescript } from "./eslint-with-typescript";
import { lesson as theStrictnessLadder } from "./the-strictness-ladder";
import { lesson as noimplicitany } from "./noimplicitany";
import { lesson as strictnullchecks } from "./strictnullchecks";
import { lesson as strictfunctiontypes } from "./strictfunctiontypes";
import { lesson as strictpropertyinitialization } from "./strictpropertyinitialization";
import { lesson as nouncheckedindexedaccess } from "./nouncheckedindexedaccess";
import { lesson as exactoptionalpropertytypes } from "./exactoptionalpropertytypes";
import { lesson as noimplicitoverrideAndClassfields } from "./noimplicitoverride-and-classfields";
import { lesson as isolatedmodulesAndVerbatimmodulesyntax } from "./isolatedmodules-and-verbatimmodulesyntax";
import { lesson as moduleResolutionExplained } from "./module-resolution-explained";
import { lesson as typeOnlyVsValueImports } from "./type-only-vs-value-imports";
import { lesson as suppressions } from "./suppressions";
import { lesson as incrementalBuilds } from "./incremental-builds";
import { lesson as projectReferences } from "./project-references";
import { lesson as declarationEmit } from "./declaration-emit";
import { lesson as bundlersAndTranspileOnly } from "./bundlers-and-transpile-only";
import { lesson as typeCheckingPerformance } from "./type-checking-performance";
import { lesson as ciGatesForTypes } from "./ci-gates-for-types";
import { lesson as typescriptVersionsAndTheGoPort } from "./typescript-versions-and-the-go-port";

export const toolingLessons: readonly Lesson[] = [
  tscCli,
  tsserverAndYourEditor,
  eslintWithTypescript,
  theStrictnessLadder,
  noimplicitany,
  strictnullchecks,
  strictfunctiontypes,
  strictpropertyinitialization,
  nouncheckedindexedaccess,
  exactoptionalpropertytypes,
  noimplicitoverrideAndClassfields,
  isolatedmodulesAndVerbatimmodulesyntax,
  moduleResolutionExplained,
  typeOnlyVsValueImports,
  suppressions,
  incrementalBuilds,
  projectReferences,
  declarationEmit,
  bundlersAndTranspileOnly,
  typeCheckingPerformance,
  ciGatesForTypes,
  typescriptVersionsAndTheGoPort,
];
