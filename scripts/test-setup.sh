#!/bin/bash

# 本地測試環境快速設置腳本
# 使用方法: chmod +x scripts/test-setup.sh && ./scripts/test-setup.sh

set -e

echo "🚀 開始設置本地測試環境..."

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 檢查必要軟體
echo -e "${BLUE}📋 檢查必要軟體...${NC}"

# 檢查 Node.js 或 Bun
if command -v bun &> /dev/null; then
    echo -e "${GREEN}✅ Bun 已安裝: $(bun --version)${NC}"
    PACKAGE_MANAGER="bun"
elif command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js 已安裝: $(node --version)${NC}"
    PACKAGE_MANAGER="npm"
else
    echo -e "${RED}❌ 請安裝 Node.js 或 Bun${NC}"
    exit 1
fi

# 檢查 Python
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✅ Python 已安裝: $(python3 --version)${NC}"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo -e "${GREEN}✅ Python 已安裝: $(python --version)${NC}"
    PYTHON_CMD="python"
else
    echo -e "${RED}❌ 請安裝 Python 3.8+${NC}"
    exit 1
fi

# 安裝 Node.js 依賴
echo -e "${BLUE}📦 安裝 Node.js 依賴...${NC}"
if [ "$PACKAGE_MANAGER" = "bun" ]; then
    bun install
else
    npm install
fi

# 檢查環境變數檔案
echo -e "${BLUE}🔧 檢查環境變數配置...${NC}"
if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo -e "${YELLOW}⚠️  已複製 .env.local.example 到 .env.local${NC}"
        echo -e "${YELLOW}⚠️  請編輯 .env.local 設置您的 API Keys${NC}"
    else
        echo -e "${RED}❌ 找不到 .env.local.example 檔案${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env.local 檔案已存在${NC}"
fi

# 檢查必要的環境變數
echo -e "${BLUE}🔍 檢查必要環境變數...${NC}"
source .env.local 2>/dev/null || true

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "[YOUR_OPENAI_API_KEY]" ]; then
    echo -e "${YELLOW}⚠️  OPENAI_API_KEY 未設置${NC}"
fi

if [ -z "$TAVILY_API_KEY" ] || [ "$TAVILY_API_KEY" = "[YOUR_TAVILY_API_KEY]" ]; then
    echo -e "${YELLOW}⚠️  TAVILY_API_KEY 未設置${NC}"
fi

# 安裝 Python 依賴
echo -e "${BLUE}🐍 安裝 Python 依賴...${NC}"
cd ragflow_fastapi
$PYTHON_CMD -m pip install fastapi uvicorn requests python-dotenv --quiet
cd ..

# 創建啟動腳本
echo -e "${BLUE}📝 創建啟動腳本...${NC}"

# RAGFlow 服務啟動腳本
cat > scripts/start-ragflow.sh << 'EOF'
#!/bin/bash
echo "🚀 啟動 RAGFlow FastAPI 服務..."
cd ragflow_fastapi
python fastapi_server.py
EOF

# Next.js 應用啟動腳本
cat > scripts/start-nextjs.sh << 'EOF'
#!/bin/bash
echo "🚀 啟動 Next.js 應用..."
if command -v bun &> /dev/null; then
    bun run dev
else
    npm run dev
fi
EOF

# 測試腳本
cat > scripts/run-tests.sh << 'EOF'
#!/bin/bash
echo "🧪 執行測試..."

echo "測試 RAGFlow 服務..."
cd ragflow_fastapi
python test_fastapi.py
cd ..

echo "測試 API 端點..."
sleep 2

# 測試數據集 API
echo "測試數據集 API..."
curl -s http://localhost:3000/api/datasets | jq . || echo "數據集 API 測試失敗"

# 測試混合搜索健康檢查
echo "測試混合搜索健康檢查..."
curl -s http://localhost:3000/api/chat/hybrid | jq . || echo "混合搜索健康檢查失敗"

echo "✅ 測試完成"
EOF

# 設置執行權限
chmod +x scripts/start-ragflow.sh
chmod +x scripts/start-nextjs.sh
chmod +x scripts/run-tests.sh

echo -e "${GREEN}✅ 設置完成！${NC}"
echo ""
echo -e "${BLUE}🎯 接下來的步驟:${NC}"
echo "1. 編輯 .env.local 設置您的 API Keys"
echo "2. 啟動 RAGFlow 服務: ./scripts/start-ragflow.sh"
echo "3. 在新終端啟動 Next.js: ./scripts/start-nextjs.sh"
echo "4. 執行測試: ./scripts/run-tests.sh"
echo ""
echo -e "${BLUE}📖 詳細說明請參考: LOCAL_SETUP.md${NC}"
echo ""
echo -e "${BLUE}🌐 測試頁面:${NC}"
echo "- 主頁: http://localhost:3000"
echo "- 混合搜索: http://localhost:3000/hybrid-search"
echo "- 策略演示: http://localhost:3000/strategy-demo"
echo ""
echo -e "${GREEN}🎉 準備就緒！${NC}"