# 本地測試檢查清單

## 📋 啟動前檢查

### 必要軟體
- [ ] Node.js 18+ 或 Bun 1.2.12+ 已安裝
- [ ] Python 3.8+ 已安裝
- [ ] Git 已安裝

### 環境配置
- [ ] `.env.local` 檔案已創建
- [ ] `OPENAI_API_KEY` 已設置
- [ ] `TAVILY_API_KEY` 已設置
- [ ] RAGFlow 服務可訪問 (http://192.168.50.123)

### 依賴安裝
- [ ] Node.js 依賴已安裝 (`bun install` 或 `npm install`)
- [ ] Python 依賴已安裝 (`pip install fastapi uvicorn requests python-dotenv`)

## 🚀 啟動步驟

### 方法一：一鍵啟動（推薦）
```bash
./start-local.sh
```

### 方法二：手動啟動
1. [ ] 啟動 RAGFlow 服務
   ```bash
   cd ragflow_fastapi && python fastapi_server.py
   ```

2. [ ] 啟動 Next.js 應用
   ```bash
   bun run dev  # 或 npm run dev
   ```

## ✅ 功能測試

### 服務健康檢查
- [ ] RAGFlow 服務: http://localhost:8001/
- [ ] Next.js 應用: http://localhost:3000/
- [ ] 數據集 API: http://localhost:3000/api/datasets

### 頁面測試
- [ ] 主頁: http://localhost:3000
- [ ] 混合搜索: http://localhost:3000/hybrid-search
- [ ] 策略演示: http://localhost:3000/strategy-demo

### 搜索功能測試
- [ ] 法律問題測試（應選擇知識庫優先）
  - 問題: "民法第184條關於侵權行為的規定是什麼？"
  - 預期策略: knowledge-first

- [ ] 時事問題測試（應選擇網路優先）
  - 問題: "2024年最新的AI法規政策有哪些？"
  - 預期策略: web-first

- [ ] 綜合問題測試（應選擇混合搜索）
  - 問題: "人工智能在法律服務中的應用前景如何？"
  - 預期策略: hybrid

### 自動化測試
- [ ] 執行全功能測試: `node scripts/test-all-features.js`

## 🔧 故障排除

### 常見問題
- [ ] 端口衝突 (3000, 8001)
  ```bash
  lsof -i :3000
  lsof -i :8001
  ```

- [ ] RAGFlow 連接失敗
  ```bash
  curl http://192.168.50.123/api/v1/health
  ```

- [ ] API Key 錯誤
  - 檢查 `.env.local` 中的 API Keys
  - 確認 API Keys 有效且有足夠額度

- [ ] 依賴問題
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### 日誌檢查
- [ ] RAGFlow 日誌: `tail -f logs/ragflow.log`
- [ ] Next.js 日誌: `tail -f logs/nextjs.log`
- [ ] 瀏覽器開發者工具 Console

## 🛑 停止服務

### 方法一：一鍵停止
```bash
./stop-local.sh
```

### 方法二：手動停止
- [ ] 在終端按 Ctrl+C 停止服務
- [ ] 檢查殘留進程並清理

## 📊 性能指標

### 預期性能
- [ ] 平均響應時間 < 3秒
- [ ] 健康檢查通過率 > 95%
- [ ] 策略選擇準確率 > 85%

### 監控指標
- [ ] 記憶體使用 < 1GB
- [ ] CPU 使用 < 50%
- [ ] 網路延遲 < 500ms

## 🎯 測試完成確認

- [ ] 所有服務正常啟動
- [ ] 所有測試頁面可訪問
- [ ] 智能策略選擇正常工作
- [ ] 混合搜索功能正常
- [ ] API 端點回應正常
- [ ] 自動化測試通過

## 📝 備註

- 如果遇到問題，請參考 `LOCAL_SETUP.md` 詳細說明
- 測試完成後記得停止服務以釋放資源
- 生產部署前請執行完整的測試套件

---

✅ **檢查清單完成後，您的本地測試環境就準備就緒了！**