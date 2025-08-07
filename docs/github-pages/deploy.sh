#!/bin/bash

# Legal Mentor GitHub Pages 自動部署腳本
# 使用方法: ./deploy.sh

set -e

echo "🚀 Legal Mentor GitHub Pages 部署腳本"
echo "======================================"

# 檢查是否在正確的目錄
if [ ! -f "package.json" ]; then
    echo "❌ 錯誤: 請在 Legal Mentor 項目根目錄執行此腳本"
    exit 1
fi

# 檢查是否存在 GitHub Pages 文件
if [ ! -d "docs/github-pages" ]; then
    echo "❌ 錯誤: 找不到 docs/github-pages 目錄"
    exit 1
fi

echo "📁 複製 GitHub Pages 文件到根目錄..."

# 複製主要文件
cp docs/github-pages/index.html .
cp docs/github-pages/_config.yml .
cp docs/github-pages/robots.txt .
cp docs/github-pages/sitemap.xml .

# 複製 GitHub Actions 工作流程
if [ ! -d ".github" ]; then
    mkdir -p .github
fi

if [ ! -d ".github/workflows" ]; then
    mkdir -p .github/workflows
fi

cp docs/github-pages/.github/workflows/deploy.yml .github/workflows/

echo "✅ 文件複製完成"

# 檢查 Git 狀態
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 發現更改，準備提交..."
    
    # 添加文件到 Git
    git add index.html _config.yml robots.txt sitemap.xml .github/workflows/deploy.yml
    
    # 提交更改
    echo "💾 提交更改..."
    git commit -m "feat: 添加 GitHub Pages 網站

- 添加響應式主頁面 (index.html)
- 配置 Jekyll 設置 (_config.yml)
- 添加 SEO 文件 (robots.txt, sitemap.xml)
- 設置自動部署工作流程 (GitHub Actions)
- 支持完整的 Legal Mentor 品牌展示"
    
    # 推送到遠程倉庫
    echo "🚀 推送到 GitHub..."
    git push origin main
    
    echo "✅ 部署完成！"
    echo ""
    echo "📋 下一步操作："
    echo "1. 前往 GitHub 倉庫設置"
    echo "2. 點擊 'Pages' 選項"
    echo "3. 在 'Source' 下選擇 'GitHub Actions'"
    echo "4. 等待部署完成"
    echo ""
    echo "🌐 網站將在以下地址可用:"
    echo "https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
    
else
    echo "ℹ️  沒有檢測到更改，文件可能已經是最新的"
fi

echo ""
echo "🎉 GitHub Pages 部署腳本執行完成！"