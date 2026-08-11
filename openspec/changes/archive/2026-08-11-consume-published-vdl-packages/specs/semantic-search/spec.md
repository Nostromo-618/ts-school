## ADDED Requirements

### Requirement: HybridSearch resolves from the npm registry

The curriculum search dependency `@vanduo-oss/vdl-hybrid-search` MUST be
declared as a semver range against the public npm registry (at least `^0.1.1`)
and MUST NOT be installed via a `file:` path to a sibling clone. The search
store MUST continue to construct `HybridSearch` from that package.

#### Scenario: lockfile resolves registry package
- **GIVEN** a clean clone with no sibling VDL repositories
- **WHEN** dependencies are installed with the pinned pnpm toolchain
- **THEN** `@vanduo-oss/vdl-hybrid-search` resolves from the configured npm
  registry (not a `file:` directory link)
