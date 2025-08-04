#!/bin/bash

# 環境變數檢查腳本
# 使用方法: chmod +x check-env.sh && ./check-env.sh

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 檢查環境變數設置...${NC}"

# 檢查 .env.local 檔案是否存在
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local 檔案不存在${NC}"
    exit 1
fi

# 載入環境變數
source .env.local 2>/dev/null || true

echo -e "${BLUE}📋 環境變數檢查結果:${NC}"

# 檢查 OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}❌ OPENAI_API_KEY 未設置${NC}"
elif [ "$OPENAI_API_KEY" = "[YOUR_OPENAI_API_KEY]" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    echo -e "${YELLOW}⚠️  OPENAI_API_KEY 仍為預設值，請設置真實的 API Key${NC}"
elif [[ "$OPENAI_API_KEY" =~ ^sk- ]]; then
    echo -e "${GREEN}✅ OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}...${OPENAI_API_KEY: -10} (格式正確)${NC}"
else
    echo -e "${YELLOW}⚠️  OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}...${OPENAI_API_KEY: -10} (格式可能不正確，應以 sk- 開頭)${NC}"
fi

# 檢查 TAVILY_API_KEY
if [ -z "$TAVILY_API_KEY" ]; then
    echo -e "${RED}❌ TAVILY_API_KEY 未設置${NC}"
elif [ "$TAVILY_API_KEY" = "[YOUR_TAVILY_API_KEY]" ] || [ "$TAVILY_API_KEY" = "your_tavily_api_key_here" ]; then
    echo -e "${YELLOW}⚠️  TAVILY_API_KEY 仍為預設值，請設置真實的 API Key${NC}"
elif [[ "$TAVILY_API_KEY" =~ ^tvly- ]]; then
    echo -e "${GREEN}✅ TAVILY_API_KEY: ${TAVILY_API_KEY:0:10}...${TAVILY_API_KEY: -10} (格式正確)${NC}"
else
    echo -e "${YELLOW}⚠️  TAVILY_API_KEY: ${TAVILY_API_KEY:0:10}...${TAVILY_API_KEY: -10} (格式可能不正確，應以 tvly- 開頭)${NC}"
fi

# 檢查 RAGFlow 配置
echo -e "\n${BLUE}🔧 RAGFlow 配置:${NC}"
if [ -z "$RAGFLOW_API_URL" ]; then
    echo -e "${YELLOW}⚠️  RAGFLOW_API_URL 未設置，將使用預設值${NC}"
else
    echo -e "${GREEN}✅ RAGFLOW_API_URL: $RAGFLOW_API_URL${NC}"
fi

if [ -z "$RAGFLOW_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  RAGFLOW_API_KEY 未設置，將使用預設值${NC}"
else
    echo -e "${GREEN}✅ RAGFLOW_API_KEY: ${RAGFLOW_API_KEY:0:10}...${RAGFLOW_API_KEY: -10}${NC}"
fi

# 測試 API 連接
echo -e "\n${BLUE}🌐 測試 API 連接...${NC}"

# 測試 OpenAI API
if [ ! -z "$OPENAI_API_KEY" ] && [[ "$OPENAI_API_KEY" =~ ^sk- ]]; then
    echo -e "${YELLOW}⏳ 測試 OpenAI API...${NC}"
    if curl -s -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models > /dev/null; then
        echo -e "${GREEN}✅ OpenAI API 連接成功${NC}"
    else
        echo -e "${RED}❌ OpenAI API 連接失敗，請檢查 API Key 是否正確${NC}"
    fi
fi

# 測試 Tavily API
if [ ! -z "$TAVILY_API_KEY" ] && [[ "$TAVILY_API_KEY" =~ ^tvly- ]]; then
    echo -e "${YELLOW}⏳ 測試 Tavily API...${NC}"
    if curl -s -X POST https://api.tavily.com/search \
        -H "Content-Type: application/json" \
        -d "{\"api_key\": \"$TAVILY_API_KEY\", \"query\": \"test\", \"max_results\": 1}" > /dev/null; then
        echo -e "${GREEN}✅ Tavily API 連接成功${NC}"
    else
        echo -e "${RED}❌ Tavily API 連接失敗，請檢查 API Key 是否正確${NC}"
    fi
fi

# 測試 RAGFlow 服務
if [ ! -z "$RAGFLOW_API_URL" ]; then
    echo -e "${YELLOW}⏳ 測試 RAGFlow 服務...${NC}"
    if curl -s "$RAGFLOW_API_URL/api/v1/health" > /dev/null; then
        echo -e "${GREEN}✅ RAGFlow 服務連接成功${NC}"
    else
        echo -e "${YELLOW}⚠️  RAGFlow 服務連接失敗，請確認服務是否運行${NC}"
    fi
fi

echo -e "\n${BLUE}🎯 建議:${NC}"
echo -e "${CYAN}1. 確保所有必要的 API Keys 都已正確設置${NC}"
echo -e "${CYAN}2. 如果 API 連接失敗，請檢查網路連接和 API Key 有效性${NC}"
echo -e "${CYAN}3. 設置完成後可以執行 ./start-local.sh 啟動服務${NC}"

echo -e "\n${GREEN}🎉 環境變數檢查完成！${NC}"