# 本地端測試啟動指南

## 🚀 快速開始

### 1. 環境準備

#### 必要軟體
- Node.js 18+ 或 Bun 1.2.12+
- Python 3.8+
- Git

#### 檢查版本
```bash
node --version  # 或 bun --version
python --version
git --version
```

### 2. 專案設置

#### 克隆專案（如果還沒有）
```bash
git clone <your-repo-url>
cd morphic
```

#### 安裝依賴
```bash
# 使用 npm
npm install

# 或使用 bun (推薦)
bun install
```

### 3. 環境變數配置

#### 複製環境變數檔案
```bash
cp .env.local.example .env.local
```

#### 編輯 `.env.local` 檔案
```bash
# 必要配置
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here

# RAGFlow 配置
RAGFLOW_API_URL=http://192.168.50.123
RAGFLOW_API_KEY=ragflow-Y2YWUxOTY4MDIwNzExZjBhMTgzMDI0Mm

# 可選配置
NEXT_PUBLIC_ENABLE_SHARE=true
```

### 4. RAGFlow FastAPI 服務啟動

#### 進入 RAGFlow 目錄
```bash
cd ragflow_fastapi
```

#### 安裝 Python 依賴
```bash
pip install fastapi uvicorn requests python-dotenv
```

#### 啟動 FastAPI 服務
```bash
python fastapi_server.py
```

服務將在 `http://localhost:8001` 啟動

#### 測試 RAGFlow 服務
```bash
# 在另一個終端測試
python test_fastapi.py
```

### 5. Next.js 應用啟動

#### 回到專案根目錄
```bash
cd ..
```

#### 啟動開發服務器
```bash
# 使用 npm
npm run dev

# 或使用 bun (推薦，更快)
bun run dev
```

應用將在 `http://localhost:3000` 啟動

## 🧪 測試功能

### 1. 基本功能測試

訪問以下頁面測試不同功能：

- **主頁**: `http://localhost:3000`
- **混合搜索**: `http://localhost:3000/hybrid-search`
- **策略演示**: `http://localhost:3000/strategy-demo`

### 2. API 端點測試

#### 測試 RAGFlow 知識庫搜索
```bash
curl -X POST http://localhost:3000/api/chat/ragflow \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "民法中關於契約的規定"}],
    "searchMode": "intelligent"
  }'
```

#### 測試混合搜索
```bash
curl -X POST http://localhost:3000/api/chat/hybrid \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "2024年最新的AI法規"}],
    "searchMode": "intelligent",
    "webSearchDepth": "advanced"
  }'
```

#### 測試數據集列表
```bash
curl http://localhost:3000/api/datasets
```

### 3. 健康檢查

#### RAGFlow 服務健康檢查
```bash
curl http://localhost:8001/
```

#### 混合搜索健康檢查
```bash
curl http://localhost:3000/api/chat/hybrid
```

## 🔧 故障排除

### 常見問題

#### 1. RAGFlow 連接失敗
```bash
# 檢查 RAGFlow 服務狀態
curl http://192.168.50.123/api/v1/health

# 如果無法連接，檢查網路或更新 IP 地址
```

#### 2. Tavily API 錯誤
```bash
# 確認 API Key 是否正確
echo $TAVILY_API_KEY

# 測試 Tavily 連接
curl -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -d '{"api_key": "your_key", "query": "test", "max_results": 1}'
```

#### 3. 端口衝突
```bash
# 檢查端口使用情況
lsof -i :3000  # Next.js
lsof -i :8001  # FastAPI

# 終止佔用端口的進程
kill -9 <PID>
```

#### 4. 依賴安裝問題
```bash
# 清除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install

# 或使用 bun
rm -rf node_modules bun.lockb
bun install
```

### 日誌檢查

#### Next.js 應用日誌
開發模式下，日誌會直接顯示在終端

#### FastAPI 服務日誌
```bash
# 在 ragflow_fastapi 目錄下
tail -f fastapi.log  # 如果有日誌檔案
```

#### 瀏覽器開發者工具
- 按 F12 打開開發者工具
- 檢查 Console 和 Network 標籤

## 🎯 測試場景

### 1. 智能策略測試

#### 法律問題（應該選擇知識庫優先）
```
問題: "民法第184條關於侵權行為的規定是什麼？"
預期策略: knowledge-first
```

#### 時事問題（應該選擇網路優先）
```
問題: "2024年最新的台灣法規修正案有哪些？"
預期策略: web-first
```

#### 綜合問題（應該選擇混合搜索）
```
問題: "人工智能在法律服務中的應用前景如何？"
預期策略: hybrid
```

### 2. 配置測試

#### 測試不同搜索深度
- 基礎搜索 vs 深度搜索
- 結果數量差異
- 響應時間比較

#### 測試結果合併
- 開啟/關閉結果合併
- 知識庫優先 vs 網路優先
- 來源標記正確性

## 📊 性能監控

### 響應時間監控
```javascript
// 在瀏覽器 Console 中執行
console.time('search');
fetch('/api/chat/hybrid', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    messages: [{role: 'user', content: '測試問題'}],
    searchMode: 'intelligent'
  })
}).then(() => console.timeEnd('search'));
```

### 記憶體使用監控
```bash
# 監控 Node.js 進程
ps aux | grep node

# 監控 Python 進程
ps aux | grep python
```

## 🚀 生產部署準備

### 環境變數檢查清單
- [ ] OPENAI_API_KEY 已設置
- [ ] TAVILY_API_KEY 已設置
- [ ] RAGFLOW_API_URL 可訪問
- [ ] RAGFLOW_API_KEY 有效
- [ ] 其他可選 API Keys（如需要）

### 建置測試
```bash
# 測試生產建置
npm run build
npm run start

# 或使用 bun
bun run build
bun run start
```

### 類型檢查
```bash
npm run typecheck
```

### 程式碼格式檢查
```bash
npm run lint
npm run format:check
```

## 📝 開發提示

### 熱重載
開發模式下，修改程式碼會自動重載頁面

### 除錯模式
在 `.env.local` 中添加：
```
NODE_ENV=development
DEBUG=true
```

### API 測試工具推薦
- Postman
- Insomnia
- VS Code REST Client 擴展

## 🆘 獲取幫助

如果遇到問題：
1. 檢查終端錯誤訊息
2. 查看瀏覽器開發者工具
3. 確認所有服務都在運行
4. 檢查網路連接和 API Keys
5. 參考故障排除章節

祝你測試順利！🎉