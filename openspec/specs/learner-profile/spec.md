# learner-profile Specification

## Purpose
Gives learners a local-only Profile page to review learning progress, inventory browser-stored school data, export it, and clear notes or wipe school data with confirmation — and exposes progress summaries to the lesson AI for grounded learning-plan advice.
## Requirements
### Requirement: Profile route is prerendered and ungated beyond ToC

The site MUST expose a `/profile` page that is included in vite-ssg prerender output. Profile MUST obey the same Terms of Conditions gate as other content pages and MUST NOT introduce a separate account or login gate. Profile MUST NOT be a lesson route.

#### Scenario: Profile prerenders

- **GIVEN** a production vite-ssg build
- **WHEN** routes are prerendered
- **THEN** `/profile` is among the generated pages and carries a document title suitable for the head

#### Scenario: Profile respects ToC

- **GIVEN** a visitor without current ToC acceptance
- **WHEN** they navigate to `/profile`
- **THEN** the ToC gate still blocks content until Accept (same as other pages)

### Requirement: Profile shows learning progress

The Profile page MUST summarize learner progress from the validated `ts-school-progress` store: completed and in-progress lesson counts, and per-track completion against the curriculum registry. Progress MUST remain client-only with no server sync.

#### Scenario: Empty progress

- **GIVEN** no valid progress payload in localStorage
- **WHEN** Profile renders after hydrate
- **THEN** the page shows zero completions without inventing lesson status

#### Scenario: Track meters match curriculum

- **GIVEN** a learner who completed some lessons in a track
- **WHEN** Profile renders
- **THEN** that track’s completion count matches the progress store against the registry’s lessons for that track

### Requirement: Profile inventories local browser data

Profile MUST list the school-relevant local data present in the browser, including at least: progress (`ts-school-progress`), notes (`ts-school-notes`), ToC acceptance, AI risk acceptance, AI chat pin preference, notes pin preference, and vd3 theme preference keys when present. The inventory MUST state that data is local-only and that some model caches may not be fully enumerable or deletable from page JavaScript.

#### Scenario: Known keys appear when set

- **GIVEN** localStorage contains `ts-school-progress` and `ts-school-notes`
- **WHEN** Profile’s data inventory renders
- **THEN** both keys are listed as present

### Requirement: Export all local school data

Profile MUST offer an Export action that downloads a JSON document containing at least: schema/export version, exportedAt timestamp, progress payload (if any), notes payload (if any), and preference snapshots for school keys the product owns (ToC, AI risk, AI pin, notes pin). Theme preference keys MAY be included when readable. Export MUST NOT require a network call.

#### Scenario: Export downloads JSON

- **GIVEN** a learner with progress and notes stored
- **WHEN** they activate Export on Profile
- **THEN** a JSON file download is triggered that includes those payloads under documented field names

### Requirement: Clear notes from Profile

Profile MUST offer a Clear notes action that removes the notes storage payload and updates the notes UI to empty, without clearing progress or consent keys.

#### Scenario: Clear notes only

- **GIVEN** notes and progress both stored
- **WHEN** the learner clears notes from Profile
- **THEN** notes storage is empty and progress remains intact

### Requirement: Clear all data with confirmation

Profile MUST offer Clear all that opens a confirmation modal. On confirm, the system MUST clear: progress, notes, AI chat pin preference, notes pin preference, AI chat open/UI session state, ToC acceptance, AI risk acceptance, and best-effort theme preference keys owned by vd3 that the site can write. The system MUST also attempt best-effort deletion of Cache Storage entries and IndexedDB databases used for on-device LLM / LiteRT model caching when the browser APIs allow it. After clear, Profile MUST refresh the inventory. The UI MUST disclose that Service Worker registrations outside school control, opaque browser disk caches, and OS-level storage may remain.

#### Scenario: Confirm clears progress and notes

- **GIVEN** progress and notes stored
- **WHEN** the learner confirms Clear all
- **THEN** `ts-school-progress` and `ts-school-notes` are absent and progress UI shows empty

#### Scenario: Cancel leaves data

- **GIVEN** progress stored and the Clear all modal open
- **WHEN** the learner cancels
- **THEN** progress remains stored

#### Scenario: Clear all revokes AI risk acceptance

- **GIVEN** AI risk acceptance stored
- **WHEN** Clear all is confirmed
- **THEN** AI risk acceptance is removed and opening Ask again requires re-consent

### Requirement: Lesson AI receives progress for learning-plan advice

When the lesson AI builds system context, it MUST include a compact learner progress summary derived from the validated progress store and curriculum registry (completed / in-progress counts, recent lesson ids if available, per-track completion). The tool allowlist MUST include a read-only `get_learner_progress` tool that returns the same class of summary. Assistant policy MUST require learning-plan advice to cite only registry lessons/routes and stored progress — never invent lesson titles. Chat MUST remain usable on Profile with the AI sidebar pinned beside the page.

#### Scenario: Context includes progress summary

- **GIVEN** a learner with at least one completed lesson
- **WHEN** school chat context is composed
- **THEN** the context JSON includes a progress summary reflecting that completion

#### Scenario: Tool returns progress

- **GIVEN** the AI tool executor and stored progress
- **WHEN** `get_learner_progress` is invoked
- **THEN** the result reports completion counts consistent with the progress store

#### Scenario: No invented lessons in plan advice policy

- **GIVEN** school chat policy text
- **WHEN** learning-plan guidance is requested by policy rules
- **THEN** the policy requires linking only to known curriculum routes and forbids inventing lesson titles

