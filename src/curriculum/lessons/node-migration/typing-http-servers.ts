import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-http-servers",
  title: "HTTP servers",
  tier: "intermediate",
  track: "node-migration",
  order: 16,
  summary:
    "node:http, Express, and Fastify: what each framework's types actually promise about a request, and where the generics are.",
  prerequisites: ["typing-streams", "generic-classes-and-interfaces"],
  keywords: [
    "http",
    "express",
    "fastify",
    "IncomingMessage",
    "handler",
    "generics",
  ],
  problem:
    'Indexing db with a URL segment and assuming the row exists. Migration does not change Node\'s runtime — it surfaces the unions and module edges you already had to handle. Fix the seam "HTTP servers" names before you rename the next hundred files.',
  solution:
    "url is optional. Assigning string | `undefined` to string fails. HTTP request fields are often optional — narrow before parsing. Framework generics only help if you parse params/body. Keep handlers thin: parse, domain logic, encode. The dual panes are the lesson: left fails, right refuses.",
  js: {
    code: `http.createServer((req, res) => {
  const id = req.url.split("/")[2];
  res.end(db[id].name);
});
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Indexing db with a URL segment and assuming the row exists.",
  },
  ts: {
    code: `type IncomingMessage = { url?: string };
type ServerResponse = { end: (body?: string) => void; statusCode: number };
type User = { name: string };
declare const db: Record<string, User | undefined>;

export function handler(req: IncomingMessage, res: ServerResponse): void {
  const url = req.url ?? "";
  const id = url.split("/")[2];
  if (!id) {
    res.statusCode = 400;
    res.end("missing id");
    return;
  }
  const user = db[id];
  if (!user) {
    res.statusCode = 404;
    res.end("not found");
    return;
  }
  res.end(user.name);
}

declare const req: IncomingMessage;
const path: string = req.url;
`,
    highlights: [{ start: 26, end: 26 }],
    caption: "url is optional. Assigning string | `undefined` to string fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 24,
        messageIncludes: "Type 'string | undefined' is not assignable to t",
      },
    ],
  },
  insight: [
    "HTTP request fields are often optional — narrow before parsing.",
    "Framework generics only help if you parse params/body.",
    "Keep handlers thin: parse, domain logic, encode.",
  ],
  security: {
    title: "URL segments are untrusted identifiers",
    body: "Validate ids before database access. Do not reflect raw URL text into responses without encoding.",
    severity: "caution",
  },
};
