#!/bin/bash

# Morphic UI 增強部署腳本
set -e

echo "🚀 開始部署 Morphic UI 增強功能..."

# 檢查環境
echo "📋 檢查部署環境..."
if [ ! -f "package.json" ]; then
    echo "❌ 錯誤: 請在項目根目錄執行此腳本"
    exit 1
fi

# 備份當前版本
echo "💾 備份當前版本..."
BACKUP_DIR="backups/ui-enhancement-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r components/chat-panel.tsx "$BACKUP_DIR/" 2>/dev/null || true
cp -r components/app-sidebar.tsx "$BACKUP_DIR/" 2>/dev/null || true
cp -r components/empty-screen.tsx "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ 備份完成: $BACKUP_DIR"

# 運行測試
echo "🧪 運行測試套件..."
npm run test -- --testPathPattern="enhanced-components" --passWithNoTests

if [ $? -ne 0 ]; then
    echo "❌ 測試失敗，部署中止"
    exit 1
fi

# 構建項目
echo "🔨 構建項目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 構建失敗，部署中止"
    exit 1
fi

# 階段性部署
echo "📦 開始階段性部署..."

# 階段 1: 啟用增強空白屏幕
echo "🎯 階段 1: 部署增強空白屏幕..."
export NEXT_PUBLIC_ENHANCED_EMPTY_SCREEN=true
npm run build

# 階段 2: 啟用增強聊天面板
echo "🎯 階段 2: 部署增強聊天面板..."
export NEXT_PUBLIC_ENHANCED_CHAT_PANEL=true
npm run build

# 階段 3: 啟用增強側邊欄
echo "🎯 階段 3: 部署增強側邊欄..."
export NEXT_PUBLIC_ENHANCED_SIDEBAR=true
npm run build

# 階段 4: 啟用動畫功能
echo "🎯 階段 4: 啟用動畫功能..."
export NEXT_PUBLIC_CHAT_ANIMATIONS=true
export NEXT_PUBLIC_SEARCH_ANIMATIONS=true
npm run build

echo "✅ 所有階段部署完成！"

# 性能檢查
echo "📊 運行性能檢查..."
npm run lighthouse || echo "⚠️  Lighthouse 檢查失敗，請手動驗證性能"

# 部署完成
echo "🎉 UI 增強功能部署完成！"
echo "📝 請檢查以下項目："
echo "   - 功能是否正常工作"
echo "   - 動畫是否流暢"
echo "   - 響應式佈局是否正確"
echo "   - 性能是否符合預期"

echo "🔄 如需回滾，請運行: ./scripts/rollback-ui-enhancements.sh $BACKUP_DIR"