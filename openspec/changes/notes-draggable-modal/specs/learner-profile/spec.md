## MODIFIED Requirements

### Requirement: Profile inventories local browser data

Profile MUST list the school-relevant local data present in the browser, including at least: progress (`ts-school-progress`), notes (`ts-school-notes`), ToC acceptance, legacy AI risk acceptance key when present, AI chat pin preference, notes window geometry preference (`ts-school-notes-window` when present), notes fold preference (`ts-school-notes-folded` when present), and vd3 theme preference keys when present. Legacy notes pin keys (`ts-school-notes-pinned`, `ts-school-notes-pin-side`) MAY appear in inventory only while still present during migration, and MUST NOT be required once cleared. The inventory MUST state that data is local-only and that some model caches may not be fully enumerable or deletable from page JavaScript.

#### Scenario: Known keys appear when set

- **GIVEN** localStorage contains `ts-school-progress` and `ts-school-notes`
- **WHEN** Profile’s data inventory renders
- **THEN** both keys are listed as present

#### Scenario: Notes window prefs listed when set

- **GIVEN** localStorage contains `ts-school-notes-window` and/or `ts-school-notes-folded`
- **WHEN** Profile’s data inventory renders
- **THEN** those keys are listed as present

### Requirement: Export all local school data

Profile MUST offer an Export action that downloads a JSON document containing at least: schema/export version, exportedAt timestamp, progress payload (if any), notes payload (if any), and preference snapshots for school keys the product owns (ToC, legacy AI risk key if present, AI pin, notes window geometry, notes fold). Theme preference keys MAY be included when readable. Export MUST NOT require a network call. Legacy notes pin preference keys MAY be included only if still present.

#### Scenario: Export downloads JSON

- **GIVEN** a learner with progress and notes stored
- **WHEN** they activate Export on Profile
- **THEN** a JSON file download is triggered that includes those payloads under documented field names

#### Scenario: Export includes notes window prefs when set

- **GIVEN** notes window geometry and fold preferences stored
- **WHEN** Export runs
- **THEN** the JSON preferences snapshot includes those school-owned keys

### Requirement: Clear all data with confirmation

Profile MUST offer Clear all that opens a confirmation modal. On confirm, the system MUST clear: progress, notes, AI chat pin preference, notes window geometry preference, notes fold preference, any remaining legacy notes pin / pin-side keys, AI chat open/UI session state, ToC acceptance, any legacy AI risk acceptance key, and best-effort theme preference keys owned by vd3 that the site can write. The system MUST also attempt best-effort deletion of Cache Storage entries and IndexedDB databases used for on-device LLM / LiteRT model caching when the browser APIs allow it. After clear, Profile MUST refresh the inventory. The UI MUST disclose that Service Worker registrations outside school control, opaque browser disk caches, and OS-level storage may remain.

#### Scenario: Confirm clears progress and notes

- **GIVEN** progress and notes stored
- **WHEN** the learner confirms Clear all
- **THEN** `ts-school-progress` and `ts-school-notes` are absent and progress UI shows empty

#### Scenario: Confirm clears notes window prefs

- **GIVEN** `ts-school-notes-window` and `ts-school-notes-folded` stored
- **WHEN** the learner confirms Clear all
- **THEN** those keys are absent after clear

#### Scenario: Cancel leaves data

- **GIVEN** progress stored and the Clear all modal open
- **WHEN** the learner cancels
- **THEN** progress remains stored

#### Scenario: Clear all removes legacy AI risk key and site terms

- **GIVEN** ToC acceptance and a legacy AI risk key were stored
- **WHEN** Clear all is confirmed
- **THEN** both keys are removed; after re-accepting site terms, opening Ask does not show a separate AI risk modal
