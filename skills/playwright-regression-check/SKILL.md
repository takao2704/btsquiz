---
name: playwright-regression-check
description: Install Playwright runtime dependencies and execute browser regression checks for the btsquiz project. Use when users ask to verify route transitions, reproduce browser-side errors, re-run `/#/quiz` flow checks, or make Playwright E2E verification repeatable in CI/local containers.
---

# Playwright Regression Check

## Overview
Run a repeatable browser-regression workflow for this repository: install required Playwright system dependencies, ensure Chromium is available, and execute existing E2E smoke tests.

## Workflow
1. Move to the repository root.
2. Run `scripts/run-playwright-regression.sh` from this skill.
3. Report pass/fail for each command and include actionable failure reason.
4. If tests fail, inspect `test-results/` artifacts and propose next debug step.

## Command contract
The skill script executes these checks in order:
- `npm ci`
- `npx playwright install-deps chromium`
- `npx playwright install chromium`
- `npm run test:e2e`

Treat `npm run test:e2e` as the source-of-truth browser verification for:
- home -> quiz transition
- direct access to `/#/quiz`
- browser runtime/console error absence (as defined in `e2e/smoke.spec.ts`)

## Output format
When using this skill, summarize with:
- Environment notes (dependency install success/failure)
- Test command results in execution order
- If failed: first blocking error line + suggested fix

## Resources
### scripts/
- `scripts/run-playwright-regression.sh`: one-command entry point for the standard regression workflow.
