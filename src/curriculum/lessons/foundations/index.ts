/**
 * Foundations — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as whyTypes } from "./why-types";
import { lesson as firstTypeError } from "./first-type-error";
import { lesson as typesAreErased } from "./types-are-erased";
import { lesson as annotationsVsInference } from "./annotations-vs-inference";
import { lesson as inferenceAndWidening } from "./inference-and-widening";
import { lesson as structuralTyping } from "./structural-typing";
import { lesson as readingTypeErrors } from "./reading-type-errors";
import { lesson as anyAndImplicitAny } from "./any-and-implicit-any";
import { lesson as strictMode } from "./strict-mode";
import { lesson as tsconfigEssentials } from "./tsconfig-essentials";
import { lesson as declarationFilesIntro } from "./declaration-files-intro";
import { lesson as editorDrivenDevelopment } from "./editor-driven-development";
import { lesson as typeSpaceVsValueSpace } from "./type-space-vs-value-space";
import { lesson as typingJavascriptWithJsdoc } from "./typing-javascript-with-jsdoc";
import { lesson as erasableSyntaxAndTypeStripping } from "./erasable-syntax-and-type-stripping";
import { lesson as tscCompilerPipeline } from "./tsc-compiler-pipeline";
import { lesson as deliberateUnsoundness } from "./deliberate-unsoundness";

export const foundationsLessons: readonly Lesson[] = [
  whyTypes,
  firstTypeError,
  typesAreErased,
  annotationsVsInference,
  inferenceAndWidening,
  structuralTyping,
  readingTypeErrors,
  anyAndImplicitAny,
  strictMode,
  tsconfigEssentials,
  declarationFilesIntro,
  editorDrivenDevelopment,
  typeSpaceVsValueSpace,
  typingJavascriptWithJsdoc,
  erasableSyntaxAndTypeStripping,
  tscCompilerPipeline,
  deliberateUnsoundness,
];
