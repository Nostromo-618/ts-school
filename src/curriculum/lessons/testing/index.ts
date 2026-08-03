/**
 * Testing with types — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as typingYourTestFiles } from "./typing-your-test-files";
import { lesson as typedFixturesAndFactories } from "./typed-fixtures-and-factories";
import { lesson as assertionsAndNarrowingInTests } from "./assertions-and-narrowing-in-tests";
import { lesson as typingMocksAndStubs } from "./typing-mocks-and-stubs";
import { lesson as partialMocks } from "./partial-mocks";
import { lesson as mockingModules } from "./mocking-modules";
import { lesson as testingGenericFunctions } from "./testing-generic-functions";
import { lesson as structuralTestDoubles } from "./structural-test-doubles";
import { lesson as testingErrorPaths } from "./testing-error-paths";
import { lesson as typeLevelTests } from "./type-level-tests";
import { lesson as tsExpectErrorAsAnAssertion } from "./ts-expect-error-as-an-assertion";
import { lesson as testingDeclarationFiles } from "./testing-declaration-files";
import { lesson as contractTestsBetweenPackages } from "./contract-tests-between-packages";

export const testingLessons: readonly Lesson[] = [
  typingYourTestFiles,
  typedFixturesAndFactories,
  assertionsAndNarrowingInTests,
  typingMocksAndStubs,
  partialMocks,
  mockingModules,
  testingGenericFunctions,
  structuralTestDoubles,
  testingErrorPaths,
  typeLevelTests,
  tsExpectErrorAsAnAssertion,
  testingDeclarationFiles,
  contractTestsBetweenPackages,
];
