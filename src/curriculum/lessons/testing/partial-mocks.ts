import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "partial-mocks",
  title: "Partial and deep-partial mocks",
  tier: "intermediate",
  track: "testing",
  order: 5,
  summary:
    "`Partial`<T> for the shallow case, a recursive helper for the deep one, and the single cast at the boundary that you should make deliberately and once.",
  prerequisites: ["typing-mocks-and-stubs", "utility-types-tour"],
  keywords: ["Partial", "DeepPartial", "mock", "cast", "recursive"],
  problem:
    "Mocking a client with thirty methods to test one of them means writing twenty-nine you will never call.",
  js: {
    code: `const api = { get: jest.fn(), post: jest.fn() };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "`Partial` mock passed where full API required.",
  },
  ts: {
    code: `type Api = {
  get(path: string): Promise<unknown>;
  post(path: string, body: unknown): Promise<unknown>;
};

const api: Pick<Api, "get"> = {
  get: async () => ({}),
};

declare function useGet(client: Pick<Api, "get">): void;
useGet(api);
declare function useAll(client: Api): void;
useAll(api);
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "`Pick`<Api,'get'> is not Api — missing post.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 13,
        messageIncludes: "Argument of type 'Pick<Api, \"get\">' is not assig",
      },
    ],
  },
  insight: [
    "Type partial mocks with `Pick`/`Partial` of the real interface.",
    "Do not cast partials to the full type.",
    "Keep tests honest about which methods are used.",
  ],
};
