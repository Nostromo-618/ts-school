import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "esm-interop",
  title: "Interop between the two module systems",
  tier: "intermediate",
  track: "node-migration",
  order: 9,
  summary:
    "esModuleInterop, default imports of CommonJS packages, createRequire, and why import x from 'cjs-pkg' sometimes gives you the namespace.",
  prerequisites: ["commonjs-to-esm"],
  keywords: [
    "esModuleInterop",
    "default import",
    "createRequire",
    "interop",
    "namespace",
  ],
  problem:
    "The same import statement resolves to the module or to its default export depending on flags set three configs away.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
