# supporting-pages Specification

## Purpose

Top-level context pages that sit beside the curriculum: a JS→Node→TS history
timeline with adoption charts, an about page that explains the school's
promise and the TypeScript 7 + Strada dual-install diagnostics story, a terms
/ disclaimer page with a mandatory client-side consent gate and farewell
route, and a solid not-found experience, all wired into routes, nav, and
search.
## Requirements
### Requirement: history page with milestone timeline

The site MUST expose a `/history` page that presents a chronological timeline of
JavaScript, Node.js, and TypeScript milestones spanning at least ES5 through
modern JavaScript, Node.js releases relevant to a working developer, TypeScript
1 through 6, and the TypeScript 7 Go native port. The timeline MUST be rendered
with vd3's timeline markup and animated via `useTimeline`. The page MUST note,
as a teaching point, that diagnostics are generated at build time with
`typescript-strada@6.0.3` while primary `typescript` is 7.x, because TypeScript 7
ships no browser-embeddable programmatic API yet. Product copy MUST NOT claim
that the site runs an in-browser typecheck worker.

#### Scenario: history route prerenders

- **GIVEN** a production `vite-ssg` build
- **WHEN** routes are prerendered
- **THEN** `/history` is among the generated pages and carries a title and
  description suitable for the document head

#### Scenario: timeline covers the JS→Node→TS arc

- **GIVEN** a reader on `/history`
- **WHEN** they read the timeline
- **THEN** they see ordered milestones covering ECMAScript evolution, Node.js,
  TypeScript major releases through 6, and the TypeScript 7 Go port, including
  an honest note that build-time diagnostics use Strada 6.0.3 alongside
  typescript@7

### Requirement: adoption charts are labelled honestly

The `/history` page MUST include at least one line chart and one bar chart from
`@vanduo-oss/vd3-cbun/charts`. Every chart series MUST either cite a real
external source or be labelled "illustrative" in the visible page copy so a
reader cannot mistake invented numbers for measured adoption.

#### Scenario: illustrative series are disclosed

- **GIVEN** chart data that is not backed by a cited measurement
- **WHEN** `/history` renders those charts
- **THEN** the surrounding copy states that the series are illustrative

#### Scenario: charts dogfood the published package

- **GIVEN** the `/history` page component
- **WHEN** it renders charts
- **THEN** it uses `VdLineChart` and `VdBarChart` from
  `@vanduo-oss/vd3-cbun/charts` rather than a hand-rolled SVG or third-party
  chart library

### Requirement: about page explains the school

The site MUST expose an `/about` page that states what TypeScript School is
(paired JS-vs-TS lessons with real-compiler diagnostics), who it is for
(working Node.js JavaScript developers), and how checking works under the dual
install: `typescript@7` for tooling CLI, `typescript-strada@6.0.3` generating
lesson diagnostics at build time (see `build-time-diagnostics`), browser never
shipping a compiler, and exercise Check using normalized solution-match.

#### Scenario: about route prerenders

- **GIVEN** a production `vite-ssg` build
- **WHEN** routes are prerendered
- **THEN** `/about` is among the generated pages

#### Scenario: about names the dual-install constraint

- **GIVEN** a reader on `/about`
- **WHEN** they read the page
- **THEN** they learn that TypeScript 7 has no programmatic browser API, that
  diagnostics are generated at build time with Strada 6.0.3, and that exercises
  pass via solution-match rather than live typechecking

### Requirement: terms page and mandatory disclaimer gate

The site MUST expose a `/terms` page with the current disclaimer copy (hobby
project, as-is / liability waiver, EU AI Act Art. 50 AI-assisted transparency,
localStorage privacy, MIT license vs disclaimer). First-time use MUST require
accepting that disclaimer via a client-only gate. Acceptance MUST persist under
the localStorage key `ts-school-toc-accepted` as versioned JSON
(`{ version, acceptedAt }`). Bumping the terms version MUST require
re-acceptance. Declining or dismissing without accept MUST route to a
`/farewell` screen with no access to app content and an option to re-read and
accept. Consent MUST be checked only on the client (`onMounted` / storage APIs)
so vite-ssg prerender does not crash. Footer and About MUST link to `/terms`
for re-reading after acceptance. `/farewell` MUST NOT appear as a normal nav
destination.

#### Scenario: terms route prerenders

- **GIVEN** a production `vite-ssg` build
- **WHEN** routes are prerendered
- **THEN** `/terms` and `/farewell` are among the generated pages

#### Scenario: decline reaches farewell

- **GIVEN** a visitor who has not accepted the current terms version
- **WHEN** they decline the gate
- **THEN** they are taken to `/farewell` and cannot open curriculum or lessons
  until they re-open the gate and accept

#### Scenario: acceptance is versioned

- **GIVEN** localStorage contains acceptance for an older terms version
- **WHEN** the consent state hydrates against the current version
- **THEN** the gate is shown again until the visitor accepts the new version

### Requirement: not-found stays usable

Unknown paths MUST resolve to the existing not-found page. That page MUST offer
at least a link home and MUST also link into the curriculum map so a lost
reader can continue learning.

#### Scenario: unknown path resolves to not-found

- **GIVEN** the application route table
- **WHEN** a path that is not a registered route is resolved
- **THEN** the not-found route matches and the catch-all remains last in the
  route table

### Requirement: supporting pages appear in nav and search

`/history`, `/about`, and `/terms` MUST be registered as standalone pages in the
derived nav tree's hand-written pages list and as named routes in
`buildRoutes()`, so the navbar lists them and the global search index includes
them. Footer site links MUST also reach them. `/farewell` is a consent-only
route and MUST NOT be added to the nav pages list.

#### Scenario: navbar lists history, about, and terms

- **GIVEN** the derived nav tree
- **WHEN** its standalone pages are inspected
- **THEN** `/history`, `/about`, and `/terms` are present with titles and
  keywords

#### Scenario: search indexes the new pages

- **GIVEN** the search store built from the nav tree
- **WHEN** a reader queries for "history", "about", or "terms"
- **THEN** the corresponding page entry is among the results

#### Scenario: routes and nav agree

- **GIVEN** `buildRoutes()` and the nav pages list
- **WHEN** standalone supporting routes are compared
- **THEN** every supporting page route in nav resolves to a named route other
  than the catch-all

### Requirement: Supporting pages disclose build-time Strada diagnostics honestly

About, home, history, and curriculum marketing copy MUST describe build-time Strada diagnostics and solution-match exercises — not an in-browser live typecheck worker.

#### Scenario: About page truth
- **WHEN** a learner opens `/about`
- **THEN** the page states diagnostics are captured at build time with Strada and editing does not re-run a browser compiler

### Requirement: Terms and About link to license and AI risks

Terms and About MUST link to the MIT license / third-party notices story and MUST surface that opening the AI assistant requires a separate AI risk acceptance.

#### Scenario: License link present
- **WHEN** a learner reads `/terms` or `/about`
- **THEN** they can find references to MIT / third-party notices and the AI assistant risk gate

