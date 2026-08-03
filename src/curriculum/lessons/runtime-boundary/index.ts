/**
 * The runtime boundary — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as whereTypesEnd } from "./where-types-end";
import { lesson as unknownVsAny } from "./unknown-vs-any";
import { lesson as jsonParseReturnsAny } from "./json-parse-returns-any";
import { lesson as typeAssertionsAreClaims } from "./type-assertions-are-claims";
import { lesson as nonNullAssertion } from "./non-null-assertion";
import { lesson as userDefinedTypeGuards } from "./user-defined-type-guards";
import { lesson as assertionFunctions } from "./assertion-functions";
import { lesson as writingAValidatorByHand } from "./writing-a-validator-by-hand";
import { lesson as schemaValidationLibraries } from "./schema-validation-libraries";
import { lesson as validatingHttpResponses } from "./validating-http-responses";
import { lesson as parseDontValidate } from "./parse-dont-validate";
import { lesson as narrowingUntrustedObjects } from "./narrowing-untrusted-objects";
import { lesson as typingRequestHandlers } from "./typing-request-handlers";
import { lesson as brandedValidatedTypes } from "./branded-validated-types";
import { lesson as discriminatedPayloadsAndVersioning } from "./discriminated-payloads-and-versioning";
import { lesson as deserializationAttackSurface } from "./deserialization-attack-surface";
import { lesson as generatedTypesFromContracts } from "./generated-types-from-contracts";
import { lesson as typeSafeSerialization } from "./type-safe-serialization";
import { lesson as trustingYourOwnDatabase } from "./trusting-your-own-database";

export const runtimeBoundaryLessons: readonly Lesson[] = [
  whereTypesEnd,
  unknownVsAny,
  jsonParseReturnsAny,
  typeAssertionsAreClaims,
  nonNullAssertion,
  userDefinedTypeGuards,
  assertionFunctions,
  writingAValidatorByHand,
  schemaValidationLibraries,
  validatingHttpResponses,
  parseDontValidate,
  narrowingUntrustedObjects,
  typingRequestHandlers,
  brandedValidatedTypes,
  discriminatedPayloadsAndVersioning,
  deserializationAttackSurface,
  generatedTypesFromContracts,
  typeSafeSerialization,
  trustingYourOwnDatabase,
];
