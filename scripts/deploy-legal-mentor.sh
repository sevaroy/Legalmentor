#!/bin/bash

# Legal Mentor 品牌部署腳本
set -e

echo "⚖️  開始部署 Legal Mentor 品牌..."

# 檢查環境
echo "📋 檢查部署環境..."
if [ ! -f "package.json" ]; then
    echo "❌ 錯誤: 請在項目根目錄執行此腳本"
    exit 1
fi

# 備份當前版本
echo "💾 備份當前版本..."
BACKUP_DIR="backups/legal-mentor-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp .env.local "$BACKUP_DIR/" 2>/dev/null || true
cp app/layout.tsx "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ 備份完成: $BACKUP_DIR"

# 設置 Legal Mentor 環境變數
echo "🏷️  設置 Legal Mentor 品牌配置..."
export NEXT_PUBLIC_LEGAL_MENTOR_BRANDING=true
export NEXT_PUBLIC_BRAND_NAME="Legal Mentor"
export NEXT_PUBLIC_BRAND_TAGLINE="AI-Powered Legal Research Assistant"
export NEXT_PUBLIC_BRAND_DESCRIPTION="A fully open-source AI-powered legal research engine with intelligent analysis."
export NEXT_PUBLIC_BRAND_DOMAIN="legalmentor.ai"
export NEXT_PUBLIC_BRAND_URL="https://legalmentor.ai"
export NEXT_PUBLIC_TWITTER_HANDLE="@legalmentor"

# 啟用動畫功能
export NEXT_PUBLIC_CHAT_ANIMATIONS=true
export NEXT_PUBLIC_SEARCH_ANIMATIONS=true

# 運行測試
echo "🧪 運行 Legal Mentor 測試..."
npm run test -- --testPathPattern="legal-mentor" --passWithNoTests

if [ $? -ne 0 ]; then
    echo "❌ 測試失敗，部署中止"
    exit 1
fi

# 構建項目
echo "🔨 構建 Legal Mentor 版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 構建失敗，部署中止"
    exit 1
fi

# 驗證品牌元素
echo "🔍 驗證品牌元素..."
if grep -q "Legal Mentor" .next/static/chunks/*.js 2>/dev/null; then
    echo "✅ 品牌名稱已正確應用"
else
    echo "⚠️  警告: 品牌名稱可能未正確應用"
fi

# 性能檢查
echo "📊 運行性能檢查..."
npm run lighthouse || echo "⚠️  Lighthouse 檢查失敗，請手動驗證性能"

# 部署完成
echo "🎉 Legal Mentor 品牌部署完成！"
echo ""
echo "📝 請檢查以下項目："
echo "   ✅ 品牌名稱: Legal Mentor"
echo "   ✅ 標語: AI-Powered Legal Research Assistant"
echo "   ✅ 法律專業圖標和色彩"
echo "   ✅ 法律專業示例和功能"
echo "   ✅ 動畫效果是否流暢"
echo "   ✅ 響應式佈局是否正確"
echo ""
echo "🌐 訪問 http://localhost:3000 查看 Legal Mentor"
echo "🔄 如需回滾，請運行: ./scripts/rollback-legal-mentor.sh $BACKUP_DIR"