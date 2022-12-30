#!/usr/bin/env sh

# 忽略错误
set -e

# 构建
npx vitepress build docs

# 将构建后的产物，挪动到zh_cn目录
rm -rf zh_cn/**
mv docs/.vitepress/dist/** zh_cn/
