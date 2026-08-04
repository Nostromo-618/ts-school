## 1. Inventory and OpenSpec

- [x] 1.1 Confirm the 52 advanced lesson file paths and leave beginner/intermediate untouched
- [x] 1.2 Land proposal, specs (`advanced-tier-content`, `curriculum-taxonomy` delta), design, and this task list

## 2. Type-level track (12 lessons)

- [x] 2.1 Author `infer-keyword`, `distributive-conditional-types`, `mapped-type-modifiers`
- [x] 2.2 Author `key-remapping-with-as`, `recursive-types`, `recursive-conditional-types`
- [x] 2.3 Author `template-literal-inference`, `variadic-tuple-types`, `branded-and-nominal-types`
- [x] 2.4 Author `type-level-assertions-and-equality`, `type-level-performance`, `when-not-to-type-level-program`

## 3. Functions and types tracks

- [x] 3.1 Author functions: `variance-and-strict-function-types`, `generic-inference-internals`, `noinfer-and-inference-control`, `const-type-parameters`, `overload-resolution-order`, `higher-order-generic-signatures`
- [x] 3.2 Author types: `control-flow-analysis`, `narrowing-that-does-not-survive`, `unique-symbol`, `assignability-rules`

## 4. Structures, foundations, async

- [x] 4.1 Author structures: `polymorphic-this-types`, `mixins-and-constructor-types`, `decorators`, `module-augmentation`
- [x] 4.2 Author foundations: `tsc-compiler-pipeline`, `deliberate-unsoundness`
- [x] 4.3 Author async: `generic-async-wrappers`, `floating-promises-and-void`, `typed-error-channels`

## 5. Runtime boundary (security-heavy)

- [x] 5.1 Author `branded-validated-types`, `discriminated-payloads-and-versioning`, `deserialization-attack-surface`
- [x] 5.2 Author `generated-types-from-contracts`, `type-safe-serialization`, `trusting-your-own-database`

## 6. Node migration, tooling, testing

- [x] 6.1 Author node-migration: `dual-package-hazard`, `publishing-types`, `shimming-untyped-dependencies`, `migrating-a-large-codebase`, `worker-threads-and-structured-clone`
- [x] 6.2 Author tooling: `project-references`, `declaration-emit`, `bundlers-and-transpile-only`, `type-checking-performance`, `ci-gates-for-types`, `typescript-versions-and-the-go-port`
- [x] 6.3 Author testing: `type-level-tests`, `ts-expect-error-as-an-assertion`, `testing-declaration-files`, `contract-tests-between-packages`

## 7. Verification and archive

- [x] 7.1 Run compiler-truth / full unit suite via `mise exec -- pnpm test` until all advanced lessons pass and no advanced placeholders remain
- [x] 7.2 Confirm derived nav/search still green via existing integrity tests; no shared registry edits required
- [x] 7.3 `openspec validate author-advanced-tier --strict`, sync main specs, archive the change
- [x] 7.4 Final gates: no advanced placeholders; compiler-truth green for all advanced panes and exercise solutions
