## 1. Dependencies

- [x] 1.1 Confirm `package.json` uses `@vanduo-oss/vdl-ai-chat@^0.1.0` and `@vanduo-oss/vdl-hybrid-search@^0.1.1`
- [x] 1.2 Run `pnpm install` so the lockfile resolves both packages from the npm registry (not `file:`)

## 2. CI workflows

- [x] 2.1 Verify `ci.yml` has no VDL sibling-clone / link / build steps
- [x] 2.2 Remove VDL sibling-clone / link / build steps from `pages.yml`
- [x] 2.3 Remove VDL sibling-clone / link / build steps from `update-visual-baselines.yml`

## 3. Docs and live specs

- [x] 3.1 Ensure README documents npm registry deps with no “not on npm yet” / sibling-clone prerequisites
- [x] 3.2 Replace TBD Purpose text on `openspec/specs/lesson-ai-assistant/spec.md` and `openspec/specs/semantic-search/spec.md`
- [x] 3.3 Clean any other active docs that still present `file:` dogfood as the primary path

## 4. Quality gates

- [x] 4.1 Run `format:check`, `lint`, `stylelint`, `typecheck`, `test`, and `build` until green

## 5. OpenSpec close-out

- [x] 5.1 Validate the change and mark all tasks complete
- [x] 5.2 Archive `consume-published-vdl-packages` with delta specs synced into main specs
