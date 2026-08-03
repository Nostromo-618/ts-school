/**
 * Node.js migration — lessons in track order.
 *
 * Listed explicitly rather than globbed so the bundler, the type checker, and a
 * reader all see the same set, and so a lesson file that is never registered
 * fails review instead of disappearing quietly.
 */

import type { Lesson } from "@/curriculum/types";
import { lesson as whyMigrateANodeService } from "./why-migrate-a-node-service";
import { lesson as addingTypescriptToAnExistingProject } from "./adding-typescript-to-an-existing-project";
import { lesson as allowjsAndCheckjs } from "./allowjs-and-checkjs";
import { lesson as installingTypes } from "./installing-types";
import { lesson as nodeBuiltinModules } from "./node-builtin-modules";
import { lesson as runningTypescriptInNode } from "./running-typescript-in-node";
import { lesson as renamingYourFirstFile } from "./renaming-your-first-file";
import { lesson as commonjsToEsm } from "./commonjs-to-esm";
import { lesson as esmInterop } from "./esm-interop";
import { lesson as dirnameAndImportMeta } from "./dirname-and-import-meta";
import { lesson as packageJsonExportsAndTypes } from "./package-json-exports-and-types";
import { lesson as typingProcessEnv } from "./typing-process-env";
import { lesson as typingCliArguments } from "./typing-cli-arguments";
import { lesson as typingFsAndPath } from "./typing-fs-and-path";
import { lesson as typingStreams } from "./typing-streams";
import { lesson as typingHttpServers } from "./typing-http-servers";
import { lesson as typedEventEmitters } from "./typed-event-emitters";
import { lesson as typingChildProcessAndBuffers } from "./typing-child-process-and-buffers";
import { lesson as globalAugmentationForNode } from "./global-augmentation-for-node";
import { lesson as dualPackageHazard } from "./dual-package-hazard";
import { lesson as publishingTypes } from "./publishing-types";
import { lesson as shimmingUntypedDependencies } from "./shimming-untyped-dependencies";
import { lesson as migratingALargeCodebase } from "./migrating-a-large-codebase";
import { lesson as workerThreadsAndStructuredClone } from "./worker-threads-and-structured-clone";

export const nodeMigrationLessons: readonly Lesson[] = [
  whyMigrateANodeService,
  addingTypescriptToAnExistingProject,
  allowjsAndCheckjs,
  installingTypes,
  nodeBuiltinModules,
  runningTypescriptInNode,
  renamingYourFirstFile,
  commonjsToEsm,
  esmInterop,
  dirnameAndImportMeta,
  packageJsonExportsAndTypes,
  typingProcessEnv,
  typingCliArguments,
  typingFsAndPath,
  typingStreams,
  typingHttpServers,
  typedEventEmitters,
  typingChildProcessAndBuffers,
  globalAugmentationForNode,
  dualPackageHazard,
  publishingTypes,
  shimmingUntypedDependencies,
  migratingALargeCodebase,
  workerThreadsAndStructuredClone,
];
