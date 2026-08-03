import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "generated-types-from-contracts",
  title: "Generating types from a contract",
  tier: "advanced",
  track: "runtime-boundary",
  order: 17,
  summary:
    "OpenAPI, protobuf, GraphQL, and SQL schemas can all emit TypeScript. What that guarantees, what it does not, and where the drift moves to.",
  prerequisites: ["schema-validation-libraries", "declaration-files-intro"],
  keywords: ["openapi", "protobuf", "graphql", "codegen", "contract", "drift"],
  problem:
    "Generated types describe the contract as it was when the generator last ran, which is not necessarily the contract the server is serving.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
