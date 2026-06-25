#!/usr/bin/env bash
# VPS 上でのデプロイ: git pull → 依存インストール → 静的ビルド(out/)
# nginx は本リポジトリの out/ を配信する想定。
set -euo pipefail

cd "$(dirname "$0")"

echo "==> [1/3] git pull (origin/main)"
git fetch origin
git reset --hard origin/main   # ローカル変更を捨ててリモートに完全一致させる

echo "==> [2/3] install dependencies (npm ci)"
npm ci

echo "==> [3/3] build static site -> ./out"
npm run build

echo "==> done. nginx の root を $(pwd)/out に向けてください。"
