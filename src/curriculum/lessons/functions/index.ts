/**
 * Functions & generics — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as typingParametersAndReturns } from "./typing-parameters-and-returns";
import { lesson as optionalAndDefaultParameters } from "./optional-and-default-parameters";
import { lesson as restParameters } from "./rest-parameters";
import { lesson as functionTypeExpressions } from "./function-type-expressions";
import { lesson as contextualTyping } from "./contextual-typing";
import { lesson as voidReturningCallbacks } from "./void-returning-callbacks";
import { lesson as genericsIntro } from "./generics-intro";
import { lesson as genericConstraints } from "./generic-constraints";
import { lesson as inferringTypeArguments } from "./inferring-type-arguments";
import { lesson as defaultTypeParameters } from "./default-type-parameters";
import { lesson as genericUtilityFunctions } from "./generic-utility-functions";
import { lesson as functionOverloads } from "./function-overloads";
import { lesson as thisParameterTyping } from "./this-parameter-typing";
import { lesson as callAndConstructSignatures } from "./call-and-construct-signatures";
import { lesson as curryingAndPartialApplication } from "./currying-and-partial-application";
import { lesson as varianceAndStrictFunctionTypes } from "./variance-and-strict-function-types";
import { lesson as genericInferenceInternals } from "./generic-inference-internals";
import { lesson as noinferAndInferenceControl } from "./noinfer-and-inference-control";
import { lesson as constTypeParameters } from "./const-type-parameters";
import { lesson as overloadResolutionOrder } from "./overload-resolution-order";
import { lesson as higherOrderGenericSignatures } from "./higher-order-generic-signatures";

export const functionsLessons: readonly Lesson[] = [
  typingParametersAndReturns,
  optionalAndDefaultParameters,
  restParameters,
  functionTypeExpressions,
  contextualTyping,
  voidReturningCallbacks,
  genericsIntro,
  genericConstraints,
  inferringTypeArguments,
  defaultTypeParameters,
  genericUtilityFunctions,
  functionOverloads,
  thisParameterTyping,
  callAndConstructSignatures,
  curryingAndPartialApplication,
  varianceAndStrictFunctionTypes,
  genericInferenceInternals,
  noinferAndInferenceControl,
  constTypeParameters,
  overloadResolutionOrder,
  higherOrderGenericSignatures,
];
