## Why

Learners need an in-lesson Gemma assistant with curriculum tools and confirm-gated edits to the VdCodeEditor TS pane.

## What Changes

- Lesson chat sidebar (vd3 chrome) with E2B/E4B opt-in load
- Pinia lessonEditor store shared with DualPane/ExerciseBlock
- SchoolToolHost allowlisted tools + confirm gate for writes
- Product system prompt + guardrails
- CSP hosts for LiteRT model download
- Unit/e2e (stubbed model in CI)

## Capabilities

### New Capabilities

- `lesson-ai-assistant`: Chat sidebar, tools, editor bridge.

### Modified Capabilities

- `lesson-engine`: DualPane binds to lessonEditor store
- `e2e-coverage`: Chat UI smoke with stubbed engine

## Impact

- Uses `@vanduo-oss/vdl-engines/ai-chat.js` + guardrails
- AI remains local/opt-in; no learner code execution
