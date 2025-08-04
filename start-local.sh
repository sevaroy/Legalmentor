#!/bin/bash

# 本地測試環境一鍵啟動腳本
# 使用方法: chmod +x start-local.sh && ./start-local.sh

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${MAGENTA}🚀 LegalMentor 混合搜索系統 - 本地測試環境${NC}"
echo -e "${BLUE}================================================${NC}"

# 檢查環境變數檔案
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local 檔案不存在，正在創建...${NC}"
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo -e "${GREEN}✅ 已複製 .env.local.example 到 .env.local${NC}"
        echo -e "${YELLOW}⚠️  請編輯 .env.local 設置您的 API Keys 後重新執行${NC}"
        exit 1
    else
        echo -e "${RED}❌ 找不到 .env.local.example 檔案${NC}"
        exit 1
    fi
fi

# 檢查必要的 API Keys
source .env.local 2>/dev/null || true

missing_keys=()
if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "[YOUR_OPENAI_API_KEY]" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    missing_keys+=("OPENAI_API_KEY")
fi

if [ -z "$TAVILY_API_KEY" ] || [ "$TAVILY_API_KEY" = "[YOUR_TAVILY_API_KEY]" ] || [ "$TAVILY_API_KEY" = "your_tavily_api_key_here" ]; then
    missing_keys+=("TAVILY_API_KEY")
fi

# 顯示檢測到的 API Keys（隱藏敏感部分）
if [ ! -z "$OPENAI_API_KEY" ] && [ "$OPENAI_API_KEY" != "[YOUR_OPENAI_API_KEY]" ] && [ "$OPENAI_API_KEY" != "your_openai_api_key_here" ]; then
    echo -e "${GREEN}✅ OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}...${OPENAI_API_KEY: -10}${NC}"
fi

if [ ! -z "$TAVILY_API_KEY" ] && [ "$TAVILY_API_KEY" != "[YOUR_TAVILY_API_KEY]" ] && [ "$TAVILY_API_KEY" != "your_tavily_api_key_here" ]; then
    echo -e "${GREEN}✅ TAVILY_API_KEY: ${TAVILY_API_KEY:0:10}...${TAVILY_API_KEY: -10}${NC}"
fi

if [ ${#missing_keys[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  以下 API Keys 尚未設置:${NC}"
    for key in "${missing_keys[@]}"; do
        echo -e "${YELLOW}   - $key${NC}"
    done
    echo -e "${YELLOW}⚠️  請編輯 .env.local 設置這些 API Keys 後重新執行${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 環境變數檢查通過${NC}"

# 檢查依賴
echo -e "${BLUE}📦 檢查依賴...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  正在安裝 Node.js 依賴...${NC}"
    if command -v bun &> /dev/null; then
        bun install
    else
        npm install
    fi
fi

# 檢查 Python 依賴
cd ragflow_fastapi
if ! python3 -c "import fastapi, uvicorn, requests" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  正在安裝 Python 依賴...${NC}"
    python3 -m pip install fastapi uvicorn requests python-dotenv --quiet
fi
cd ..

echo -e "${GREEN}✅ 依賴檢查完成${NC}"

# 創建日誌目錄
mkdir -p logs

# 啟動 RAGFlow 服務
echo -e "${BLUE}🚀 啟動 RAGFlow FastAPI 服務...${NC}"
cd ragflow_fastapi
python3 fastapi_server.py > ../logs/ragflow.log 2>&1 &
RAGFLOW_PID=$!
cd ..

# 等待 RAGFlow 服務啟動
echo -e "${YELLOW}⏳ 等待 RAGFlow 服務啟動...${NC}"
sleep 3

# 檢查 RAGFlow 服務是否啟動成功
if curl -s http://localhost:8001/ > /dev/null; then
    echo -e "${GREEN}✅ RAGFlow 服務啟動成功 (PID: $RAGFLOW_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  RAGFlow 服務可能啟動失敗，但繼續啟動 Next.js...${NC}"
fi

# 啟動 Next.js 應用
echo -e "${BLUE}🚀 啟動 Next.js 應用...${NC}"
if command -v bun &> /dev/null; then
    bun run dev > logs/nextjs.log 2>&1 &
else
    npm run dev > logs/nextjs.log 2>&1 &
fi
NEXTJS_PID=$!

# 等待 Next.js 應用啟動
echo -e "${YELLOW}⏳ 等待 Next.js 應用啟動...${NC}"
sleep 5

# 檢查 Next.js 應用是否啟動成功
if curl -s http://localhost:3000/ > /dev/null; then
    echo -e "${GREEN}✅ Next.js 應用啟動成功 (PID: $NEXTJS_PID)${NC}"
else
    echo -e "${RED}❌ Next.js 應用啟動失敗${NC}"
    kill $RAGFLOW_PID 2>/dev/null || true
    exit 1
fi

# 保存 PID 到檔案
echo $RAGFLOW_PID > logs/ragflow.pid
echo $NEXTJS_PID > logs/nextjs.pid

echo -e "${GREEN}🎉 所有服務啟動完成！${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}📖 可用的測試頁面:${NC}"
echo -e "${CYAN}   🏠 主頁: http://localhost:3000${NC}"
echo -e "${CYAN}   🔍 混合搜索: http://localhost:3000/hybrid-search${NC}"
echo -e "${CYAN}   🧠 策略演示: http://localhost:3000/strategy-demo${NC}"
echo -e "${CYAN}   📊 API 文檔: http://localhost:8001/docs${NC}"
echo ""
echo -e "${BLUE}🧪 執行測試:${NC}"
echo -e "${CYAN}   node scripts/test-all-features.js${NC}"
echo ""
echo -e "${BLUE}📝 查看日誌:${NC}"
echo -e "${CYAN}   tail -f logs/ragflow.log    # RAGFlow 服務日誌${NC}"
echo -e "${CYAN}   tail -f logs/nextjs.log     # Next.js 應用日誌${NC}"
echo ""
echo -e "${BLUE}🛑 停止服務:${NC}"
echo -e "${CYAN}   ./stop-local.sh${NC}"
echo -e "${BLUE}================================================${NC}"

# 等待用戶中斷
echo -e "${YELLOW}按 Ctrl+C 停止所有服務...${NC}"
trap 'echo -e "\n${YELLOW}🛑 正在停止服務...${NC}"; kill $RAGFLOW_PID $NEXTJS_PID 2>/dev/null || true; rm -f logs/*.pid; echo -e "${GREEN}✅ 所有服務已停止${NC}"; exit 0' INT

# 保持腳本運行
while true; do
    sleep 1
done