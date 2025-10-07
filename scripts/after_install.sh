#!/usr/bin/env bash
set -euo pipefail

BASE="/opt/next-app"
INCOMING="$BASE/_incoming"
TS="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$BASE/releases/$TS"

# リリースを作成して中身を移動
mkdir -p "$RELEASE_DIR"
# rsync で .git, node_modules, .next/cache などは不要なら除外
rsync -a --delete \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".next/cache" \
  "$INCOMING"/ "$RELEASE_DIR"/

# （任意）環境変数ファイルを各リリースに配置
# 例：/opt/next-app/.env.production を配布
if [ -f "$BASE/.env.production" ]; then
  cp "$BASE/.env.production" "$RELEASE_DIR"/.env.production
fi

# Node パッケージ & ビルド
cd "$RELEASE_DIR"
# pnpm / yarn ならここを差し替え
npm ci
npm run build

# 古いリリースの自動削除（最新3つだけ残す）
cd "$BASE/releases"
ls -1dt */ | tail -n +4 | xargs -r rm -rf
