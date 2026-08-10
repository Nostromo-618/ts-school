import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "trusting-your-own-database",
  title: "Rows are untrusted too",
  tier: "advanced",
  track: "runtime-boundary",
  order: 19,
  summary:
    "Query results are `any` in most drivers. Schema-derived row types, nullable columns, and why the database is a boundary like any other.",
  prerequisites: ["generated-types-from-contracts", "typing-request-handlers"],
  keywords: ["database", "sql", "rows", "prisma", "kysely", "nullable"],
  problem:
    "A migration made a column nullable and every read site still believes it cannot be `null`. Nullable columns are runtime `null` with no warning in JS. Treat query results like untrusted input: types should match the live schema, including nulls.",
  solution:
    "string | `null` must be narrowed before string methods. Treat query results like untrusted input: types should match the live schema, including nulls. Regenerate row types in CI when migrations land. ORM client types help only if they track schema; raw SQL needs your own row types.",
  js: {
    code: `// JS: drivers return plain objects — nulls surprise you in production.
function getUser(row) {
  return row.email.toLowerCase();
}
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "Nullable columns are runtime `null` with no warning in JS.",
  },
  ts: {
    code: `// Schema-derived row — email became nullable in a migration.
type UserRow = { id: string; email: string | null };

function emailDomain(row: UserRow): string {
  return row.email.split("@")[1] ?? "";
}

function emailDomainSafe(row: UserRow): string {
  if (row.email === null) return "";
  return row.email.split("@")[1] ?? "";
}

void emailDomainSafe;
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "string | `null` must be narrowed before string methods.",
    expectedDiagnostics: [
      {
        code: 18047,
        line: 5,
        messageIncludes: "null",
      },
    ],
  },
  insight: [
    "Treat query results like untrusted input: types should match the live schema, including nulls.",
    "Regenerate row types in CI when migrations land.",
    "ORM client types help only if they track schema; raw SQL needs your own row types.",
  ],
  security: {
    title: "Database content can be hostile",
    body: "Compromised or multi-tenant data can contain unexpected nulls and strings. Do not assume DB rows are pre-validated application objects.",
    severity: "caution",
  },
  quiz: [
    {
      id: "db-q",
      prompt:
        "After a column becomes nullable, what should happen to TypeScript?",
      choices: [
        { id: "a", text: "Nothing — `null` is fine as string" },
        { id: "b", text: "Row types and call sites must account for `null`" },
        { id: "c", text: "Disable `strictNullChecks`" },
        { id: "d", text: "Cast every row as `any`" },
      ],
      answerId: "b",
      explanation:
        "The type must match the schema or you reintroduce the JS surprise.",
    },
  ],
  exercise: {
    prompt:
      'Type Row = { name: string | `null` } and write label(row) returning name or "anonymous".',
    starter: `type Row = { name: string | null };
function label(row: Row): string {
  return row.name;
}
`,
    assertion: "no-errors",
    hints: ['row.name ?? "anonymous"'],
    solution: `type Row = { name: string | null };
function label(row: Row): string {
  return row.name ?? "anonymous";
}
`,
  },
};
