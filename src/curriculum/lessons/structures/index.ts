/**
 * Objects, classes & modules — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as interfacesIntro } from "./interfaces-intro";
import { lesson as typeAliasesIntro } from "./type-aliases-intro";
import { lesson as interfaceVsTypeAlias } from "./interface-vs-type-alias";
import { lesson as optionalAndReadonlyProperties } from "./optional-and-readonly-properties";
import { lesson as nestedAndComposedObjectTypes } from "./nested-and-composed-object-types";
import { lesson as extendingInterfaces } from "./extending-interfaces";
import { lesson as classesIntro } from "./classes-intro";
import { lesson as classMemberVisibility } from "./class-member-visibility";
import { lesson as esmImportsAndExports } from "./esm-imports-and-exports";
import { lesson as indexSignatures } from "./index-signatures";
import { lesson as excessPropertyChecks } from "./excess-property-checks";
import { lesson as intersectionTypes } from "./intersection-types";
import { lesson as implementsVsExtends } from "./implements-vs-extends";
import { lesson as abstractClasses } from "./abstract-classes";
import { lesson as parameterProperties } from "./parameter-properties";
import { lesson as accessorsAndComputedMembers } from "./accessors-and-computed-members";
import { lesson as staticMembersAndStaticBlocks } from "./static-members-and-static-blocks";
import { lesson as genericClassesAndInterfaces } from "./generic-classes-and-interfaces";
import { lesson as declarationMerging } from "./declaration-merging";
import { lesson as namespacesAndLegacyCode } from "./namespaces-and-legacy-code";
import { lesson as polymorphicThisTypes } from "./polymorphic-this-types";
import { lesson as mixinsAndConstructorTypes } from "./mixins-and-constructor-types";
import { lesson as decorators } from "./decorators";
import { lesson as moduleAugmentation } from "./module-augmentation";

export const structuresLessons: readonly Lesson[] = [
  interfacesIntro,
  typeAliasesIntro,
  interfaceVsTypeAlias,
  optionalAndReadonlyProperties,
  nestedAndComposedObjectTypes,
  extendingInterfaces,
  classesIntro,
  classMemberVisibility,
  esmImportsAndExports,
  indexSignatures,
  excessPropertyChecks,
  intersectionTypes,
  implementsVsExtends,
  abstractClasses,
  parameterProperties,
  accessorsAndComputedMembers,
  staticMembersAndStaticBlocks,
  genericClassesAndInterfaces,
  declarationMerging,
  namespacesAndLegacyCode,
  polymorphicThisTypes,
  mixinsAndConstructorTypes,
  decorators,
  moduleAugmentation,
];
