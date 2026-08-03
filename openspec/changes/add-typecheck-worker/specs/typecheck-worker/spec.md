## Purpose

In-browser type checking of learner-authored TypeScript by the real compiler:
learner source goes in, normalized diagnostics come out, and the compiler is
confined to a Web Worker fed by a same-origin standard library so that checking
code never becomes a way to run it.

## ADDED Requirements

### Requirement: real compiler diagnostics for learner source

The system MUST type-check a learner-supplied TypeScript source string with the
installed TypeScript compiler and return every syntactic and semantic diagnostic
the compiler reports for that source, normalized to the shared `TsDiagnostic`
contract: the numeric error code, the category, the message chain flattened to
one string, a 1-based line, a 1-based column, and the span length in characters.
Diagnostics SHALL be ordered by position so a list rendered from them reads in
source order. No diagnostic may be invented, suppressed, or reworded.

#### Scenario: a type error round-trips

- **GIVEN** the source `const total: number = "12";`
- **WHEN** it is checked
- **THEN** exactly one diagnostic is returned, its code is `2322`, its category
  is `error`, its line is `1`, its column is the 1-based column of `total`, and
  its length is the width of that identifier

#### Scenario: a nested mismatch is reported as one flattened message

- **GIVEN** source whose type error the compiler describes with a message chain
  (an outer "not assignable" message elaborated by inner ones)
- **WHEN** it is checked
- **THEN** the returned diagnostic carries a single `message` string containing
  every link of the chain, in order

#### Scenario: valid source produces nothing

- **GIVEN** source the compiler accepts
- **WHEN** it is checked
- **THEN** the returned diagnostic list is empty

#### Scenario: an incomplete edit yields a syntactic diagnostic, not a crash

- **GIVEN** source that is mid-keystroke and does not parse, such as
  `const x: = `
- **WHEN** it is checked
- **THEN** at least one diagnostic is returned and the checker remains usable
  for the next request

### Requirement: the compiler is confined to the worker

The TypeScript compiler MUST be imported only inside the Web Worker module. No
module reachable from the application entry may import it as a value, and the
built main-thread bundle SHALL NOT contain the compiler. Modules shared between
the worker and the main thread MAY reference the compiler's types only in
type-only positions that erase at build time.

#### Scenario: the source graph has exactly one value import

- **GIVEN** the application source tree
- **WHEN** every module is inspected for an import of `typescript`
- **THEN** the worker module is the only one importing it as a value, and any
  other reference is a type-only import

#### Scenario: the built main bundle is compiler-free

- **GIVEN** a production build of a page that mounts the type-check client
- **WHEN** the emitted main-thread chunks are inspected
- **THEN** none of them contains the compiler, while the separately emitted
  worker chunk does

### Requirement: learner code is checked, never executed

The system MUST NOT execute learner-authored source, and MUST NOT contain a
dynamic code-evaluation path of any kind — no `eval`, no `Function`
constructor, no `javascript:` URL, no injection of learner text into markup or
into an executable module. Learner source SHALL only ever be read as text by the
compiler.

#### Scenario: source with a side effect stays inert

- **GIVEN** source whose evaluation would have an observable effect, such as
  assigning to a global
- **WHEN** it is checked
- **THEN** diagnostics are returned and the effect does not happen

#### Scenario: the prohibition is machine-enforced

- **GIVEN** the repository's lint configuration, which errors on `eval`, implied
  `eval`, the `Function` constructor, `javascript:` URLs, `innerHTML` assignment
  and `v-html`
- **WHEN** the lint gate runs over this capability's source
- **THEN** it passes, because no such construct exists

### Requirement: same-origin, lazily loaded standard library

The `lib.*.d.ts` files the compiler needs MUST be served from the site's own
origin under `import.meta.env.BASE_URL`, never from a CDN or any cross-origin
host, so the deployed `connect-src 'self'` policy holds. They SHALL be fetched
lazily — after the first check is requested, not while the page loads — cached
for the lifetime of the worker so a second check refetches nothing, and verified
against the digest recorded for them at build time whenever the platform exposes
a cryptographic digest API. A file whose digest does not match MUST be rejected
rather than fed to the compiler.

#### Scenario: nothing is fetched until a check is requested

- **GIVEN** a page that has mounted the client but received no source yet
- **WHEN** the network activity is observed
- **THEN** no standard-library file has been requested

#### Scenario: the second check refetches nothing

- **GIVEN** a worker that has completed one check
- **WHEN** a second check is requested with the same options
- **THEN** no standard-library file is fetched again

#### Scenario: the site is served under a sub-path

- **GIVEN** a build whose base path is `/sub-path/`
- **WHEN** the worker loads the standard library
- **THEN** every request goes to `/sub-path/ts-lib/…` on the site's own origin

#### Scenario: a tampered library file is refused

- **GIVEN** a standard-library file whose bytes no longer match the digest
  recorded in the manifest
- **WHEN** the worker loads it
- **THEN** it is rejected with an error naming the file, and no program is built
  from it

### Requirement: the standard library payload tracks the installed compiler

The build MUST derive the standard-library payload from the installed compiler
rather than from a hardcoded file list: starting from the configured entry libs
it SHALL follow each file's `/// <reference lib="…" />` directives to their
transitive closure, copy that closure into the served directory, and write a
manifest recording the compiler version, the entry libs, the default library,
and a digest and byte length per file. A clean clone MUST be able to install and
build with no extra step, and a compiler version that no longer matches the
manifest MUST fail the test gate.

#### Scenario: the closure is discovered, not listed

- **GIVEN** an entry lib whose file references others transitively
- **WHEN** the payload is generated
- **THEN** every transitively referenced file is present in the output and in
  the manifest, with no file list written by hand

#### Scenario: a fresh clone builds

- **GIVEN** a clone with no generated payload present
- **WHEN** dependencies are installed and the build is run
- **THEN** the payload is generated first and the build succeeds

#### Scenario: a compiler upgrade cannot silently desync the payload

- **GIVEN** a manifest generated from one compiler version
- **WHEN** the installed compiler is a different version and the test gate runs
- **THEN** the gate fails, naming both versions

### Requirement: responsive checking under continuous typing

The main-thread client MUST keep typing responsive: it SHALL debounce requests
so a burst of keystrokes produces one check, correlate every response to its
request by a monotonically increasing identifier, discard any response that is
not the newest request's, and expose an explicit teardown that stops the worker.
The worker SHALL reuse its parsed standard library across requests so that cost
is paid once rather than per keystroke, and MAY drop a queued request that a
newer one has already superseded.

#### Scenario: a burst of keystrokes produces one check

- **GIVEN** a client with a 250 ms debounce
- **WHEN** eight source revisions arrive within 100 ms of each other
- **THEN** exactly one check is dispatched, carrying the last revision

#### Scenario: a stale response is discarded

- **GIVEN** two dispatched checks whose responses arrive out of order
- **WHEN** the older response arrives after the newer one
- **THEN** it is ignored and the newer result remains the reported state

#### Scenario: teardown releases the worker

- **GIVEN** a mounted client
- **WHEN** the consumer tears it down
- **THEN** the worker is terminated, no pending debounce fires afterwards, and
  no further response is reported

#### Scenario: the standard library is parsed once

- **GIVEN** a worker that has completed its first check
- **WHEN** subsequent checks run
- **THEN** they reuse the already-parsed standard library, and a check of a
  small edit completes in a small fraction of the first check's time

### Requirement: failures are reported, not fatal

Malformed input and internal faults MUST be answered with an error response
carrying the originating request identifier, and MUST NOT terminate the worker
or leave the caller waiting. A message that is not a well-formed request SHALL
be rejected without being acted on.

#### Scenario: a malformed message is rejected

- **GIVEN** a message that is not a well-formed check request
- **WHEN** the worker receives it
- **THEN** it replies with an error response rather than checking anything, and
  it remains able to serve the next valid request

#### Scenario: an internal fault surfaces to the caller

- **GIVEN** a check that fails inside the worker — for example because the
  standard library cannot be loaded
- **WHEN** the failure occurs
- **THEN** the caller receives an error response naming the cause, keyed to the
  request identifier, and the consumer's error state is set instead of its
  diagnostics being silently emptied

### Requirement: safe during server-side rendering

The client MUST produce nothing and throw nothing on the server and before
hydration: no worker is constructed, no fetch is issued, and the reactive state
a component binds to holds its initial value. The worker SHALL only be created
after mount in the browser.

#### Scenario: prerender is clean

- **GIVEN** the static build prerendering a route whose component uses the
  composable
- **WHEN** the route is rendered on the server
- **THEN** rendering succeeds, no worker is constructed, and the prerendered
  markup contains no client-produced diagnostic

#### Scenario: an environment without workers degrades quietly

- **GIVEN** a browser or test environment that provides no `Worker`
- **WHEN** the client is created and asked to check
- **THEN** it reports that checking is unsupported and throws nothing

### Requirement: lessons control strictness and available libraries

A lesson MUST be able to vary the check through the shared `TypecheckOptions`
contract: relaxing the strict baseline, and requesting extra standard libraries
such as the DOM. Everything else about the compiler configuration SHALL be fixed
by the host so lessons cannot drift apart. Requesting a library the payload does
not carry MUST fail with a clear error naming it.

#### Scenario: a lesson opts out of strictness

- **GIVEN** source that only errors under the strict baseline
- **WHEN** it is checked with strictness disabled
- **THEN** no diagnostic is returned for it

#### Scenario: a lesson asks for the DOM

- **GIVEN** source referring to a browser global
- **WHEN** it is checked without the DOM library
- **THEN** the compiler reports the name as unknown
- **AND WHEN** it is checked with the DOM library requested
- **THEN** no diagnostic is returned

#### Scenario: an unavailable library is refused

- **GIVEN** a request naming a standard library the payload does not carry
- **WHEN** it is checked
- **THEN** an error response names the missing library

### Requirement: expected diagnostics are matched with a reportable result

The system MUST provide a comparison of actual diagnostics against a lesson's
authored `ExpectedDiagnostic[]` that is informative enough to render a failure
message: it SHALL report whether the whole set matched, which expectations went
unmet, which actual diagnostics were unexpected, and which pairs matched. An
expectation matches when the code and line are equal and, when a message
substring is authored, the actual message contains it. Each actual diagnostic
SHALL be consumed by at most one expectation.

#### Scenario: expectations are met

- **GIVEN** actual diagnostics and expectations that agree on code, line and
  message substring
- **WHEN** they are compared
- **THEN** the result reports a match, with no unmet expectation and no
  unexpected diagnostic

#### Scenario: a lesson claims an error the compiler does not report

- **GIVEN** an expectation with no corresponding actual diagnostic
- **WHEN** they are compared
- **THEN** the result does not match and names that expectation as unmet

#### Scenario: the compiler reports an error the lesson did not claim

- **GIVEN** an actual diagnostic no expectation covers
- **WHEN** they are compared
- **THEN** the result does not match and names that diagnostic as unexpected,
  including its code, position and message

#### Scenario: duplicates on one line are counted, not collapsed

- **GIVEN** two actual diagnostics with the same code on the same line and only
  one expectation for them
- **WHEN** they are compared
- **THEN** one is matched and the other is reported as unexpected
