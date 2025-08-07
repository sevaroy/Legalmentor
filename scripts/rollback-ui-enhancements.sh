#!/bin/bash

# Morphic UI 增強回滾腳本
set -e

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
    echo "❌ 錯誤: 請提供備份目錄路徑"
    echo "用法: ./scripts/rollback-ui-enhancements.sh <backup_directory>"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ 錯誤: 備份目錄不存在: $BACKUP_DIR"
    exit 1
fi

echo "🔄 開始回滾 UI 增強功能..."

# 禁用所有功能開關
echo "🚫 禁用功能開關..."
export NEXT_PUBLIC_ENHANCED_CHAT_PANEL=false
export NEXT_PUBLIC_ENHANCED_SIDEBAR=false
export NEXT_PUBLIC_ENHANCED_EMPTY_SCREEN=false
export NEXT_PUBLIC_CHAT_ANIMATIONS=false
export NEXT_PUBLIC_SEARCH_ANIMATIONS=false

# 恢復備份文件
echo "📁 恢復備份文件..."
cp "$BACKUP_DIR"/* components/ 2>/dev/null || echo "⚠️  部分文件恢復失敗"

# 重新構建
echo "🔨 重新構建項目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 回滾完成！"
    echo "📝 已恢復到增強功能部署前的狀態"
else
    echo "❌ 回滾過程中出現錯誤，請手動檢查"
    exit 1
fi