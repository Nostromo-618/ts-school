import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "branded-and-nominal-types",
  title: "Branded types",
  tier: "advanced",
  track: "type-level",
  order: 18,
  summary:
    "Adding an unforgeable marker to a structural type so UserId and OrderId stop being interchangeable strings.",
  prerequisites: ["unique-symbol", "intersection-types"],
  keywords: ["branded type", "nominal", "opaque", "UserId", "unique symbol"],
  problem:
    "Every id in the system is a string, so passing an order id where a user id was expected is a type-correct data breach.",
  js: {
    code: `// JS: ids are strings — mix them freely.
function refund(orderId, userId) {
  console.log("refund", orderId, "for", userId);
}

const userId = "user_1";
const orderId = "order_9";
refund(userId, orderId); // swapped — still "works"
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Structural string identity cannot tell user from order.",
  },
  ts: {
    code: `declare const userBrand: unique symbol;
declare const orderBrand: unique symbol;

type UserId = string & { readonly [userBrand]: void };
type OrderId = string & { readonly [orderBrand]: void };

function asUserId(s: string): UserId {
  return s as UserId;
}
function asOrderId(s: string): OrderId {
  return s as OrderId;
}

function refund(orderId: OrderId, userId: UserId) {
  void orderId;
  void userId;
}

const userId = asUserId("user_1");
const orderId = asOrderId("order_9");
refund(userId, orderId);
`,
    highlights: [
      { start: 1, end: 5 },
      { start: 22, end: 22 },
    ],
    caption: "Brands make swapped ids a type error.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 21,
        messageIncludes: "OrderId",
      },
    ],
  },
  insight: [
    "Branding is an intersection with a unique phantom property — erased at runtime, nominal at compile time.",
    "Only trusted constructors (or assertions) should mint brands; a bare `as UserId` anywhere reopens the hole.",
    "unique symbol brands are stronger than string-literal brand keys that can collide across packages.",
  ],
  security: {
    title: "Brands are not validation",
    body: "A brand only prevents mix-ups among already-trusted values. Untrusted strings must still be parsed before branding — otherwise you are laundering input.",
    severity: "caution",
  },
  quiz: [
    {
      id: "brand-struct",
      prompt:
        "Are UserId and OrderId assignable to each other if both are string & { __brand: … } with different brand strings?",
      choices: [
        { id: "a", text: "Yes — both are strings" },
        { id: "b", text: "No — the brand properties differ" },
        { id: "c", text: "Only under strictFunctionTypes" },
        { id: "d", text: "Only if unique symbol is used" },
      ],
      answerId: "b",
      explanation:
        "Different brand property types break mutual assignability even when the underlying string is the same.",
    },
  ],
  exercise: {
    prompt:
      "Define Email as string & { readonly __email: void } and a function send(to: Email). Show a valid call using a cast mint.",
    starter: `type Email = string; // TODO brand

function send(to: Email) {
  void to;
}

send("not-branded@example.com");
`,
    assertion: "no-errors",
    hints: [
      "Intersect with a phantom object type; mint with `as Email` in a helper.",
    ],
    solution: `type Email = string & { readonly __email: void };

function asEmail(s: string): Email {
  return s as Email;
}

function send(to: Email) {
  void to;
}

send(asEmail("a@b.co"));
`,
  },
};
