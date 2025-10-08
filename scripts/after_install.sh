#!/usr/bin/env bash
set -euo pipefail

BASE="/opt/next-app"
INCOMING="$BASE/_incoming"
TS="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$BASE/releases/$TS"

# 権限（appuser 実行前提。BeforeInstall で一度 chown 済みなら不要）
# sudo chown -R appuser:appuser "$BASE" || true

# リリース作成 & 受領物配置
mkdir -p "$RELEASE_DIR"
rsync -a --delete \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".next/cache" \
  "$INCOMING"/ "$RELEASE_DIR"/

# 環境変数（任意）
[ -f "$BASE/.env.production" ] && cp "$BASE/.env.production" "$RELEASE_DIR/.env.production"

# ===== ここからアプリ直下でビルド（= current 直下に揃える） =====
cd "$RELEASE_DIR"

# 前提チェック（落ちるなら明示的に失敗させる）
if [ ! -f package.json ]; then
  echo "ERROR: package.json not found at $RELEASE_DIR" >&2; exit 20
fi
if [ ! -f package-lock.json ] && [ ! -f npm-shrinkwrap.json ]; then
  echo "ERROR: lockfile not found at $RELEASE_DIR" >&2; exit 21
fi

# 共有の .env をリリースにコピー
ENV_SRC="/opt/next-app/shared/.env.production"
ENV_DST="$RELEASE_DIR/.env.production"  

if [ -s "$ENV_SRC" ]; then
  umask 077                         # 600で落ちるように
  cp "$ENV_SRC" "$ENV_DST"          # 所有者=appuserのままコピー
  echo "Copied: $ENV_SRC -> $ENV_DST"
else
  echo "WARN: $ENV_SRC not found or empty" >&2
fi

# Node 依存 & ビルド
npm ci
npm run build

# 切替（current → 新リリース）
ln -sfn "$RELEASE_DIR" "$BASE/current"

# 古いリリースを整理（最新3つ残す）
cd "$BASE/releases"
ls -1dt */ | tail -n +4 | xargs -r rm -rf
