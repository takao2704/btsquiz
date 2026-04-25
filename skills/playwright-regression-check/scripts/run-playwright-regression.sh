#!/usr/bin/env bash
set -euo pipefail

repo_root="${1:-$(pwd)}"

cd "$repo_root"

npm ci
npx playwright install-deps chromium
npx playwright install chromium
npm run test:e2e
