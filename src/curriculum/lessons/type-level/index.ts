/**
 * Type-level programming — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as keyofOperator } from "./keyof-operator";
import { lesson as typeofTypeQueries } from "./typeof-type-queries";
import { lesson as indexedAccessTypes } from "./indexed-access-types";
import { lesson as utilityTypesTour } from "./utility-types-tour";
import { lesson as functionUtilityTypes } from "./function-utility-types";
import { lesson as satisfiesOperator } from "./satisfies-operator";
import { lesson as conditionalTypesIntro } from "./conditional-types-intro";
import { lesson as mappedTypesIntro } from "./mapped-types-intro";
import { lesson as templateLiteralTypesIntro } from "./template-literal-types-intro";
import { lesson as inferKeyword } from "./infer-keyword";
import { lesson as distributiveConditionalTypes } from "./distributive-conditional-types";
import { lesson as mappedTypeModifiers } from "./mapped-type-modifiers";
import { lesson as keyRemappingWithAs } from "./key-remapping-with-as";
import { lesson as recursiveTypes } from "./recursive-types";
import { lesson as recursiveConditionalTypes } from "./recursive-conditional-types";
import { lesson as templateLiteralInference } from "./template-literal-inference";
import { lesson as variadicTupleTypes } from "./variadic-tuple-types";
import { lesson as brandedAndNominalTypes } from "./branded-and-nominal-types";
import { lesson as typeLevelAssertionsAndEquality } from "./type-level-assertions-and-equality";
import { lesson as typeLevelPerformance } from "./type-level-performance";
import { lesson as whenNotToTypeLevelProgram } from "./when-not-to-type-level-program";

export const typeLevelLessons: readonly Lesson[] = [
  keyofOperator,
  typeofTypeQueries,
  indexedAccessTypes,
  utilityTypesTour,
  functionUtilityTypes,
  satisfiesOperator,
  conditionalTypesIntro,
  mappedTypesIntro,
  templateLiteralTypesIntro,
  inferKeyword,
  distributiveConditionalTypes,
  mappedTypeModifiers,
  keyRemappingWithAs,
  recursiveTypes,
  recursiveConditionalTypes,
  templateLiteralInference,
  variadicTupleTypes,
  brandedAndNominalTypes,
  typeLevelAssertionsAndEquality,
  typeLevelPerformance,
  whenNotToTypeLevelProgram,
];
