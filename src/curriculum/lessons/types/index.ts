/**
 * Types & narrowing — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as primitiveTypes } from "./primitive-types";
import { lesson as arraysAndTuples } from "./arrays-and-tuples";
import { lesson as objectTypeLiterals } from "./object-type-literals";
import { lesson as unionTypes } from "./union-types";
import { lesson as literalTypes } from "./literal-types";
import { lesson as nullAndUndefined } from "./null-and-undefined";
import { lesson as optionalChainingAndNullish } from "./optional-chaining-and-nullish";
import { lesson as narrowingWithTypeof } from "./narrowing-with-typeof";
import { lesson as truthinessNarrowing } from "./truthiness-narrowing";
import { lesson as equalityNarrowing } from "./equality-narrowing";
import { lesson as enumsVsLiteralUnions } from "./enums-vs-literal-unions";
import { lesson as discriminatedUnions } from "./discriminated-unions";
import { lesson as exhaustivenessChecking } from "./exhaustiveness-checking";
import { lesson as inOperatorNarrowing } from "./in-operator-narrowing";
import { lesson as instanceofNarrowing } from "./instanceof-narrowing";
import { lesson as arrayNarrowing } from "./array-narrowing";
import { lesson as constAssertions } from "./const-assertions";
import { lesson as readonlyAndImmutability } from "./readonly-and-immutability";
import { lesson as voidAndNever } from "./void-and-never";
import { lesson as typeWideningAndFreshness } from "./type-widening-and-freshness";
import { lesson as controlFlowAnalysis } from "./control-flow-analysis";
import { lesson as narrowingThatDoesNotSurvive } from "./narrowing-that-does-not-survive";
import { lesson as uniqueSymbol } from "./unique-symbol";
import { lesson as assignabilityRules } from "./assignability-rules";

export const typesLessons: readonly Lesson[] = [
  primitiveTypes,
  arraysAndTuples,
  objectTypeLiterals,
  unionTypes,
  literalTypes,
  nullAndUndefined,
  optionalChainingAndNullish,
  narrowingWithTypeof,
  truthinessNarrowing,
  equalityNarrowing,
  enumsVsLiteralUnions,
  discriminatedUnions,
  exhaustivenessChecking,
  inOperatorNarrowing,
  instanceofNarrowing,
  arrayNarrowing,
  constAssertions,
  readonlyAndImmutability,
  voidAndNever,
  typeWideningAndFreshness,
  controlFlowAnalysis,
  narrowingThatDoesNotSurvive,
  uniqueSymbol,
  assignabilityRules,
];
