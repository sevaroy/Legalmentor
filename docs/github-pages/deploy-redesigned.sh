#!/bin/bash

# Legal Mentor 重新設計簡報部署腳本
# 作者: 簡報設計專家

echo "🎨 Legal Mentor 專業簡報部署開始..."

# 檢查文件是否存在
if [ ! -f "docs/github-pages/presentation-redesigned.html" ]; then
    echo "❌ 錯誤: presentation-redesigned.html 文件不存在"
    exit 1
fi

# 創建備份
echo "📦 創建原簡報備份..."
if [ -f "docs/github-pages/presentation.html" ]; then
    cp docs/github-pages/presentation.html docs/github-pages/presentation-backup.html
    echo "✅ 原簡報已備份為 presentation-backup.html"
fi

# 替換為新簡報
echo "🚀 部署新簡報..."
cp docs/github-pages/presentation-redesigned.html docs/github-pages/presentation.html

# 更新 index.html 中的簡報鏈接
echo "🔗 更新主頁簡報鏈接..."
if [ -f "docs/github-pages/index.html" ]; then
    # 確保簡報鏈接指向正確的文件
    sed -i.bak 's/presentation-redesigned\.html/presentation.html/g' docs/github-pages/index.html
    echo "✅ 主頁鏈接已更新"
fi

# Git 操作
echo "📝 提交更改到 Git..."
git add docs/github-pages/presentation.html
git add docs/github-pages/presentation-redesigned.html
git add docs/github-pages/REDESIGNED_PRESENTATION_GUIDE.md

if [ -f "docs/github-pages/presentation-backup.html" ]; then
    git add docs/github-pages/presentation-backup.html
fi

git commit -m "🎨 重新設計專業級簡報

- 採用現代化深色主題設計
- 添加震撼的動畫效果和視覺衝擊力
- 優化數據可視化和用戶體驗
- 提升專業程度和說服力
- 完美響應式設計支持

設計特色:
✨ 深色漸變背景 + 現代配色系統
🎯 動態進度條 + 脈衝動畫效果
🚀 3D 懸停效果 + 滾動觸發動畫
📊 專業數據可視化 + 戲劇化對比
💼 投資級簡報質量 + 行動呼籲設計"

echo "🌐 推送到遠程倉庫..."
git push origin main

echo ""
echo "🎉 簡報部署完成！"
echo ""
echo "📋 部署摘要:"
echo "   ✅ 新簡報已部署為 presentation.html"
echo "   ✅ 原簡報已備份為 presentation-backup.html"
echo "   ✅ 設計指南已創建: REDESIGNED_PRESENTATION_GUIDE.md"
echo "   ✅ 更改已提交到 Git"
echo ""
echo "🔗 訪問鏈接:"
echo "   🌟 新簡報: https://yourusername.github.io/legal-mentor/docs/github-pages/presentation.html"
echo "   📖 設計指南: https://yourusername.github.io/legal-mentor/docs/github-pages/REDESIGNED_PRESENTATION_GUIDE.md"
echo "   🏠 主頁: https://yourusername.github.io/legal-mentor/docs/github-pages/"
echo ""
echo "💡 提示:"
echo "   - 使用方向鍵導航簡報"
echo "   - 按 F 鍵進入全屏模式"
echo "   - 按 ESC 鍵退出全屏"
echo "   - 支持移動端和平板訪問"
echo ""
echo "🎨 設計亮點:"
echo "   🌈 現代化深色主題 + 專業配色"
echo "   ⚡ 震撼動畫效果 + 視覺衝擊力"
echo "   📊 數據可視化 + 進度條動畫"
echo "   🎯 響應式設計 + 完美適配"
echo "   💼 投資級質量 + 專業展示"
echo ""
echo "🚀 簡報已準備好征服投資者和用戶！"