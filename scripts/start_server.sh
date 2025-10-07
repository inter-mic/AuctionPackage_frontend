#!/usr/bin/env bash
set -euo pipefail

BASE="/opt/next-app"
# 直近の最新リリースをcurrentへ
LATEST="$(ls -1dt $BASE/releases/*/ | head -n 1)"
ln -sfn "$LATEST" "$BASE/current"

ECOSYSTEM="$BASE/current/ecosystem.config.cjs"

# PM2: 初回は start、2回目以降は reload でOK（両対応の書き方）
if pm2 list | grep -q "$(basename "$ECOSYSTEM")"; then
  pm2 reload "$ECOSYSTEM" --update-env
else
  pm2 start  "$ECOSYSTEM" --update-env
fi

pm2 save
