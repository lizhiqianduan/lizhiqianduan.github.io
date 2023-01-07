#!/usr/bin/env sh

# 忽略错误
set -e

# 构建
npx vitepress build docs

# 将构建后的产物，同步到根目录
rsync -av docs/.vitepress/dist/** ./
rsync -av docs/logo.jpg ./

git add .
git commit -m "deploy"
git push
