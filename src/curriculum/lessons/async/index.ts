/**
 * Async, errors & Result — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as promiseTypes } from "./promise-types";
import { lesson as asyncAwaitTyping } from "./async-await-typing";
import { lesson as typingCallbacksAndPromisify } from "./typing-callbacks-and-promisify";
import { lesson as awaitedAndUnwrapping } from "./awaited-and-unwrapping";
import { lesson as catchGivesYouUnknown } from "./catch-gives-you-unknown";
import { lesson as customErrorClasses } from "./custom-error-classes";
import { lesson as errorCauseAndChaining } from "./error-cause-and-chaining";
import { lesson as resultTypes } from "./result-types";
import { lesson as discriminatedResultsInPractice } from "./discriminated-results-in-practice";
import { lesson as promiseCombinators } from "./promise-combinators";
import { lesson as asyncIteratorsAndGenerators } from "./async-iterators-and-generators";
import { lesson as abortsignalAndCancellation } from "./abortsignal-and-cancellation";
import { lesson as neverReturningFunctions } from "./never-returning-functions";
import { lesson as genericAsyncWrappers } from "./generic-async-wrappers";
import { lesson as floatingPromisesAndVoid } from "./floating-promises-and-void";
import { lesson as typedErrorChannels } from "./typed-error-channels";

export const asyncLessons: readonly Lesson[] = [
  promiseTypes,
  asyncAwaitTyping,
  typingCallbacksAndPromisify,
  awaitedAndUnwrapping,
  catchGivesYouUnknown,
  customErrorClasses,
  errorCauseAndChaining,
  resultTypes,
  discriminatedResultsInPractice,
  promiseCombinators,
  asyncIteratorsAndGenerators,
  abortsignalAndCancellation,
  neverReturningFunctions,
  genericAsyncWrappers,
  floatingPromisesAndVoid,
  typedErrorChannels,
];
