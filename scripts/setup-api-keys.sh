#!/bin/bash

echo "🔧 LegalMentor API Keys 設定助手"
echo "=================================="
echo ""
echo "請按照以下步驟設定您的 API Keys："
echo ""
echo "1. OpenAI API Key"
echo "   註冊/登入: https://platform.openai.com/api-keys"
echo "   格式: sk-..."
echo ""
read -p "請輸入您的 OPENAI_API_KEY (或按 Enter 跳過): " OPENAI_KEY
echo ""

echo "2. Tavily API Key (必需 - 法律搜索核心)"
echo "   註冊/登入: https://app.tavily.com/"
echo "   格式: tvly-..."
echo ""
read -p "請輸入您的 TAVILY_API_KEY (或按 Enter 跳過): " TAVILY_KEY
echo ""

echo "3. Exa API Key (必需 - 語義搜索)"
echo "   註冊/登入: https://exa.ai/"
echo "   格式: 一般字串"
echo ""
read -p "請輸入您的 EXA_API_KEY (或按 Enter 跳過): " EXA_KEY
echo ""

# 創建 .env.local
cat > .env.local << EOF
# =============================================================================
# LegalMentor 環境變數配置
# =============================================================================

# AI 模型
OPENAI_API_KEY=${OPENAI_KEY:-sk-your-openai-api-key}

# 法律搜索 API (必需)
TAVILY_API_KEY=${TAVILY_KEY:-tvly-your-tavily-api-key}
EXA_API_KEY=${EXA_KEY:-your-exa-api-key}

# 搜索策略
SEARCH_API=tavily
EOF

echo ""
echo "✅ .env.local 已更新！"
echo ""
echo "下一步："
echo "1. 安裝測試工具: bun add -D tsx"
echo "2. 執行測試: bun tsx scripts/test-legal-search.ts"
echo ""
