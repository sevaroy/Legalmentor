# LegalMentor - 智能混合搜索系統

AI-powered legal study assistant with hybrid search capabilities, combining Tavily web search and RAGFlow knowledge base.

## 🚀 快速開始

### 一鍵啟動本地測試環境

```bash
# 設置執行權限
chmod +x start-local.sh stop-local.sh

# 啟動所有服務
./start-local.sh

# 停止所有服務
./stop-local.sh
```

### 手動設置（詳細步驟）

1. **環境準備**
   ```bash
   # 複製環境變數檔案
   cp .env.local.example .env.local
   
   # 編輯 .env.local 設置您的 API Keys
   # OPENAI_API_KEY=your_openai_key
   # TAVILY_API_KEY=your_tavily_key
   ```

2. **安裝依賴**
   ```bash
   # Node.js 依賴
   bun install  # 或 npm install
   
   # Python 依賴
   cd ragflow_fastapi
   pip install fastapi uvicorn requests python-dotenv
   cd ..
   ```

3. **啟動服務**
   ```bash
   # 終端 1: 啟動 RAGFlow 服務
   cd ragflow_fastapi && python fastapi_server.py
   
   # 終端 2: 啟動 Next.js 應用
   bun run dev  # 或 npm run dev
   ```

## 🧪 測試功能

### 自動化測試
```bash
# 執行全功能測試
node scripts/test-all-features.js
```

### 手動測試頁面
- **主頁**: http://localhost:3000
- **混合搜索**: http://localhost:3000/hybrid-search
- **策略演示**: http://localhost:3000/strategy-demo

### API 測試
```bash
# 測試混合搜索
curl -X POST http://localhost:3000/api/chat/hybrid \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "民法契約規定"}], "searchMode": "intelligent"}'

# 測試數據集列表
curl http://localhost:3000/api/datasets
```

## ✨ 核心功能

- **智能混合搜索**: 結合 Tavily 網路搜索和 RAGFlow 知識庫
- **智能策略選擇**: 根據問題類型自動選擇最佳搜索策略
- **法律專業優化**: 針對法律領域優化的搜索和回答
- **多知識庫支援**: 支援多個專業知識庫的智能選擇
- **實時網路搜索**: 獲取最新的法律資訊和時事
- **Chat History**: Save and review your legal research sessions
- **Real-time Search**: Web search for latest legal developments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **AI Integration**: Vercel AI SDK
- **Database**: Supabase (Auth + Storage)
- **Search**: Tavily API for web search
- **Deployment**: Vercel, Docker, Cloudflare Pages

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API Key
- Tavily API Key (for web search)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/legalmentor.git
   cd legalmentor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   TAVILY_API_KEY=your_tavily_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Flegalmentor)

### Docker

```bash
# Build and run with Docker
docker compose up -d

# Or pull prebuilt image
docker pull ghcr.io/your-username/legalmentor:latest
```

## 🔧 Configuration

See [Configuration Guide](docs/CONFIGURATION.md) for:
- Additional AI providers (Anthropic, Google, Groq)
- Redis setup for chat history
- Custom search providers
- Environment variables

## 🤝 Contributing

We welcome contributions to LegalMentor! Please see [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🎯 Legal Use Cases

- **Law Students**: Case briefing, exam prep, legal research
- **Legal Professionals**: Quick case law lookup, precedent analysis
- **Paralegals**: Document review assistance, legal research
- **Researchers**: Legal trend analysis, comparative law studies
