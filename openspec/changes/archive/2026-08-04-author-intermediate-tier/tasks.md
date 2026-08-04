## 1. OpenSpec and inventory

- [x] 1.1 Confirm 91 intermediate lessons across 10 tracks; list ids by track
- [x] 1.2 Proposal, specs (`intermediate-curriculum`, `lesson-engine` delta), design, and tasks written
- [x] 1.3 `openspec validate author-intermediate-tier --strict` passes for artifacts

## 2. Runtime-boundary track (8) — security-heavy

- [x] 2.1 Author `user-defined-type-guards`, `assertion-functions`, `narrowing-untrusted-objects`
- [x] 2.2 Author `writing-a-validator-by-hand`, `parse-dont-validate`, `schema-validation-libraries`
- [x] 2.3 Author `validating-http-responses`, `typing-request-handlers`
- [x] 2.4 Every runtime-boundary lesson has a `security` note; compiler-truth green for the track

## 3. Node-migration track (12) — differentiator

- [x] 3.1 Author `commonjs-to-esm`, `esm-interop`, `dirname-and-import-meta`, `package-json-exports-and-types`
- [x] 3.2 Author `typing-process-env`, `typing-cli-arguments`, `typing-fs-and-path`, `typing-streams`
- [x] 3.3 Author `typing-http-servers`, `typing-child-process-and-buffers`, `typed-event-emitters`, `global-augmentation-for-node`
- [x] 3.4 Ambient stubs used where needed; compiler-truth green for the track

## 4. Types and functions tracks (19)

- [x] 4.1 Author types track (9): discriminated-unions, exhaustiveness, narrowing variants, readonly, const assertions, void/never, widening
- [x] 4.2 Author functions track (10): generics intro through overloads, this-parameter, void callbacks, currying

## 5. Structures, type-level, async (30)

- [x] 5.1 Author structures track (11)
- [x] 5.2 Author type-level track (9)
- [x] 5.3 Author async track (10)

## 6. Tooling, testing, foundations (22)

- [x] 6.1 Author tooling track (12)
- [x] 6.2 Author testing track (7)
- [x] 6.3 Author foundations intermediate (3)

## 7. Gates and archive

- [x] 7.1 Zero intermediate placeholders remain; compiler-truth passes all intermediate panes and exercise solutions
- [x] 7.2 `mise exec -- pnpm test` green; lint, format:check, typecheck, build
- [x] 7.3 `openspec validate --strict`; archive to `openspec/changes/archive/2026-08-04-author-intermediate-tier`
- [x] 7.4 Report counts, tracks, security-heavy lessons, archive path, gate results
