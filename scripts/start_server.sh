#!/usr/bin/env bash
set -euo pipefail

BASE="/opt/next-app"
ECOSYSTEM="$BASE/current/ecosystem.config.cjs"

cd "$BASE/current"
pm2 startOrReload "$ECOSYSTEM" --env production --update-env
pm2 save