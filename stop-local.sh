#!/bin/bash

# 停止本地測試服務腳本
# 使用方法: chmod +x stop-local.sh && ./stop-local.sh

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 停止 LegalMentor 本地測試服務...${NC}"

# 從 PID 檔案停止服務
if [ -f "logs/ragflow.pid" ]; then
    RAGFLOW_PID=$(cat logs/ragflow.pid)
    if kill -0 $RAGFLOW_PID 2>/dev/null; then
        kill $RAGFLOW_PID
        echo -e "${GREEN}✅ RAGFlow 服務已停止 (PID: $RAGFLOW_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  RAGFlow 服務已經停止${NC}"
    fi
    rm -f logs/ragflow.pid
fi

if [ -f "logs/nextjs.pid" ]; then
    NEXTJS_PID=$(cat logs/nextjs.pid)
    if kill -0 $NEXTJS_PID 2>/dev/null; then
        kill $NEXTJS_PID
        echo -e "${GREEN}✅ Next.js 應用已停止 (PID: $NEXTJS_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  Next.js 應用已經停止${NC}"
    fi
    rm -f logs/nextjs.pid
fi

# 強制停止可能殘留的進程
echo -e "${BLUE}🔍 檢查殘留進程...${NC}"

# 停止可能的 Node.js 進程
NODE_PIDS=$(pgrep -f "next dev" 2>/dev/null || true)
if [ ! -z "$NODE_PIDS" ]; then
    echo $NODE_PIDS | xargs kill 2>/dev/null || true
    echo -e "${GREEN}✅ 清理 Next.js 殘留進程${NC}"
fi

# 停止可能的 Python 進程
PYTHON_PIDS=$(pgrep -f "fastapi_server.py" 2>/dev/null || true)
if [ ! -z "$PYTHON_PIDS" ]; then
    echo $PYTHON_PIDS | xargs kill 2>/dev/null || true
    echo -e "${GREEN}✅ 清理 RAGFlow 殘留進程${NC}"
fi

# 檢查端口是否已釋放
echo -e "${BLUE}🔍 檢查端口狀態...${NC}"

if lsof -i :3000 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  端口 3000 仍被佔用${NC}"
    lsof -i :3000
else
    echo -e "${GREEN}✅ 端口 3000 已釋放${NC}"
fi

if lsof -i :8001 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  端口 8001 仍被佔用${NC}"
    lsof -i :8001
else
    echo -e "${GREEN}✅ 端口 8001 已釋放${NC}"
fi

echo -e "${GREEN}🎉 所有服務已停止！${NC}"