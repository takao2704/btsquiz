#!/usr/bin/env bash
set -euo pipefail

# Linux CI / container 向け: Playwright のシステム依存 + Chromium をまとめて導入
npx playwright install-deps chromium
npx playwright install chromium
