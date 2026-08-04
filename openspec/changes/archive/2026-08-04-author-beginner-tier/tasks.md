## 1. Inventory and gates

- [x] 1.1 Confirm beginner lesson count (58) and file list by track
- [x] 1.2 Ensure PATH includes mise pnpm 11.18.0; verify `mise exec -- pnpm test` baseline (placeholders skipped)

## 2. Foundations (12)

- [x] 2.1 Author why-types through structural-typing (orders 1–6)
- [x] 2.2 Author reading-type-errors through editor-driven-development (orders 7–12)
- [x] 2.3 Run compiler-truth for foundations beginner lessons

## 3. Types (11)

- [x] 3.1 Author primitive-types through literal-types (orders 1–5)
- [x] 3.2 Author null-and-undefined through enums-vs-literal-unions (orders 6–11)
- [x] 3.3 Run compiler-truth for types beginner lessons

## 4. Functions (5)

- [x] 4.1 Author all five beginner functions lessons with quizzes/exercises where useful
- [x] 4.2 Run compiler-truth for functions beginner lessons

## 5. Structures (9)

- [x] 5.1 Author interfaces through composing object types (orders 1–5)
- [x] 5.2 Author extending-interfaces through esm-imports-and-exports (orders 6–9)
- [x] 5.3 Run compiler-truth for structures beginner lessons

## 6. Runtime boundary (5)

- [x] 6.1 Author where-types-end through non-null-assertion with security notes
- [x] 6.2 Run compiler-truth for runtime-boundary beginner lessons

## 7. Async (3)

- [x] 7.1 Author promise-types, async-await-typing, typing-callbacks-and-promisify
- [x] 7.2 Run compiler-truth for async beginner lessons

## 8. Node migration (7)

- [x] 8.1 Author why-migrate through installing-types (orders 1–4) without relying on package resolution
- [x] 8.2 Author node-builtin-modules through renaming-your-first-file (orders 5–7)
- [x] 8.3 Run compiler-truth for node-migration beginner lessons

## 9. Tooling and testing (6)

- [x] 9.1 Author tsc-cli, tsserver-and-your-editor, eslint-with-typescript, the-strictness-ladder
- [x] 9.2 Author typing-your-test-files and typed-fixtures-and-factories
- [x] 9.3 Run compiler-truth for tooling and testing beginner lessons

## 10. Full beginner gate and archive

- [x] 10.1 Assert zero beginner placeholders remain (`isPlaceholder` false for all tier beginner)
- [x] 10.2 Run full `mise exec -- pnpm test` (compiler-truth + integrity) — beginner panes 58/58 green; full suite still red from parallel-tier sibling lessons (order collisions / their diagnostics)
- [x] 10.3 Run lint, format:check, typecheck, and vite-ssg build — typecheck + build green; beginner files prettier-clean; repo-wide lint/format still fail on sibling agent artifacts
- [x] 10.4 `openspec validate --strict` for author-beginner-tier; archive when green
- [x] 10.5 Confirm derived nav/search still resolve beginner lesson ids (integrity suite) — beginner ids intact; track-dense-order fails on runtime-boundary because intermediate lessons reused orders 3–4
