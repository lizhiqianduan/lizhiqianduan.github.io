#!/usr/bin/env sh

# 忽略错误
set -e

# 生成changelog
npx conventional-changelog -n "changelog.config.js" -c "changelog.context.json"  -i ./docs/changelog.md -s -r 0 -p angular
echo "changelog已生成：https://lizhiqianduan.com/changelog.html"

# 构建
npx vitepress build docs

# 将构建后的产物，同步到根目录
rsync -av docs/.vitepress/dist/** ./
rsync -av docs/logo.jpg ./

git add .
git commit -m "deploy: 发版"
git push
