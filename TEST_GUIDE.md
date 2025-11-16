# LegalMentor 搜索功能測試指南

## 🧪 測試目的

驗證 Tavily + Exa 雙引擎法律搜索系統是否正常運作。

## 📋 測試前準備

### 1. 確認環境變數已設定

檢查 `.env.local` 檔案中是否包含：

```bash
# 必需的 API Keys
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
EXA_API_KEY=...
```

如果沒有 `.env.local`，請執行：

```bash
# 複製範本
cp .env.example.legal .env.local

# 編輯檔案填入 API Keys
nano .env.local
```

### 2. 安裝依賴（如果尚未安裝）

```bash
bun install
```

### 3. 安裝測試工具

```bash
bun add -D tsx
```

---

## 🚀 執行測試

### 方法 1: 使用測試腳本（推薦）

```bash
# 執行完整測試
bun tsx scripts/test-legal-search.ts
```

### 方法 2: 手動測試步驟

#### 步驟 1: 測試 Tavily API

```bash
# 建立測試檔案
cat > test-tavily.js << 'EOF'
const apiKey = process.env.TAVILY_API_KEY;

fetch('https://api.tavily.com/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: apiKey,
    query: '台灣 車禍賠償 判決',
    max_results: 5,
    search_depth: 'basic',
    include_domains: ['judicial.gov.tw']
  })
})
.then(res => res.json())
.then(data => {
  console.log('✓ Tavily 測試成功');
  console.log(`找到 ${data.results?.length || 0} 筆結果`);
  data.results?.slice(0, 2).forEach((r, i) => {
    console.log(`\n${i + 1}. ${r.title}`);
    console.log(`   ${r.url}`);
  });
})
.catch(err => console.error('✗ Tavily 測試失敗:', err.message));
EOF

# 執行測試
node test-tavily.js
```

#### 步驟 2: 測試 Exa API

```bash
# 使用 curl 測試
curl -X POST https://api.exa.ai/search \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "台灣 勞資糾紛 判決",
    "numResults": 5,
    "includeDomains": ["judicial.gov.tw"]
  }'
```

---

## 📊 測試項目

自動測試腳本會執行以下測試：

### ✅ Test 1: 環境變數檢查
- 檢查 OPENAI_API_KEY
- 檢查 TAVILY_API_KEY
- 檢查 EXA_API_KEY

### ✅ Test 2: Tavily Search
- 執行基礎搜索
- 驗證結果格式
- 檢查是否包含司法院結果

### ✅ Test 3: Exa Search
- 執行語義搜索
- 驗證結果格式
- 檢查結果品質

### ✅ Test 4: 雙引擎並行搜索
- 同時執行 Tavily + Exa
- 測試並行效能
- 驗證結果合併和去重

### ✅ Test 5: 台灣法律網域優先
- 測試域名篩選功能
- 驗證優先排序邏輯
- 檢查結果來源分布

---

## 📈 預期結果

### 成功輸出範例

```
==================================================
環境變數檢查
==================================================

✓ OPENAI_API_KEY: 已設定
✓ TAVILY_API_KEY: 已設定
✓ EXA_API_KEY: 已設定

==================================================
測試 Tavily Search API
==================================================

ℹ 執行搜索：「台灣 車禍賠償 判決」
✓ Tavily 搜索成功：找到 5 筆結果

前 2 筆結果：

  1. 臺灣臺北地方法院 110 年度訴字第 1234 號民事判決
     URL: https://judgment.judicial.gov.tw/...
     內容: 原告因車禍事故受傷，請求被告賠償醫療費用...

✓ 結果包含司法院判決書

==================================================
測試摘要
==================================================

總測試數：5
✓ 通過：5
✗ 失敗：0

成功率：100%

🎉 所有測試通過！法律搜索系統運作正常。
```

---

## ❌ 常見錯誤處理

### 錯誤 1: API Key 無效

**錯誤訊息**：
```
✗ Tavily 搜索錯誤: 401 Unauthorized
⚠ API Key 可能無效，請檢查 TAVILY_API_KEY
```

**解決方法**：
1. 檢查 `.env.local` 中的 API Key 是否正確
2. 確認沒有多餘的空格或引號
3. 前往 https://app.tavily.com/ 重新生成 API Key

---

### 錯誤 2: 環境變數未設定

**錯誤訊息**：
```
✗ TAVILY_API_KEY: 未設定或使用預設值
```

**解決方法**：
```bash
# 檢查環境變數
echo $TAVILY_API_KEY

# 如果為空，編輯 .env.local
nano .env.local

# 確認格式正確
TAVILY_API_KEY=tvly-your-actual-key-here
```

---

### 錯誤 3: 搜索無結果

**錯誤訊息**：
```
✗ Tavily 搜索失敗：無結果
```

**可能原因**：
1. API 配額已用完
2. 網路連線問題
3. 搜索關鍵字太嚴格

**解決方法**：
```bash
# 檢查 API 配額
# 登入 https://app.tavily.com/ 查看 usage

# 測試網路連線
curl https://api.tavily.com/

# 使用更寬鬆的搜索
# 移除 include_domains 限制
```

---

### 錯誤 4: 模組找不到

**錯誤訊息**：
```
Error: Cannot find module './lib/tools/search/providers/index'
```

**解決方法**：
```bash
# 確認檔案存在
ls -la lib/tools/search/providers/

# 重新安裝依賴
rm -rf node_modules
bun install

# 檢查 TypeScript 編譯
bun run typecheck
```

---

## 🔍 進階測試

### 測試不同搜索深度

```typescript
// Basic 模式（快速）
legal_search({
  query: "車禍賠償",
  search_depth: "basic"
})

// Advanced 模式（深度）
legal_search({
  query: "車禍賠償",
  search_depth: "advanced"
})
```

### 測試域名篩選

```typescript
// 只搜索司法院
legal_search({
  query: "租賃糾紛",
  include_judgment_only: true
})

// 搜索多個法律網站
legal_search({
  query: "勞資糾紛",
  include_judgment_only: false
})
```

### 測試法律領域上下文

```typescript
legal_search({
  query: "資遣費計算",
  legal_context: "勞動法"
})
```

---

## 📱 實際使用測試

除了腳本測試，也建議進行實際使用測試：

### 1. 啟動開發伺服器

```bash
bun dev
```

### 2. 訪問 http://localhost:3000

### 3. 測試對話

輸入以下問題測試：

```
1. "車禍受傷可以請求什麼賠償？"
   → 應該調用 legal_search 並返回判決案例

2. "查詢租賃糾紛的判決"
   → 應該調用 judgment_only_search

3. "民法 184 條的規定是什麼？"
   → 應該調用 legal_search 找法規

4. "勞基法資遣費怎麼算？"
   → 應該調用 legal_search，context="勞動法"
```

### 4. 檢查回應

確認 AI 的回應包含：
- ✅ 引用司法院判決書
- ✅ 標註來源連結
- ✅ 使用白話文解釋
- ✅ 包含免責聲明

---

## 📊 效能基準

### 預期效能指標

| 測試項目 | 預期時間 | 預期結果數 |
|---------|---------|-----------|
| Tavily Basic | ~2秒 | 5-10 筆 |
| Exa Basic | ~3秒 | 5-10 筆 |
| 雙引擎並行 | ~3秒 | 10-15 筆 |
| Legal Search | ~4秒 | 15-20 筆 |

### 效能問題排查

如果搜索時間超過 10 秒：
1. 檢查網路連線
2. 降低 max_results 數量
3. 使用 basic 模式而非 advanced
4. 啟用 Redis 快取

---

## 🐛 Debug 模式

### 啟用詳細日誌

```bash
# 設定環境變數
DEBUG=legal-search:* bun tsx scripts/test-legal-search.ts

# 或在 .env.local 加入
LOG_LEVEL=debug
```

### 查看 API 請求

```bash
# 使用 curl 直接測試
curl -v -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "tvly-...",
    "query": "test"
  }'
```

---

## ✅ 測試檢查清單

完成以下檢查確認系統正常：

- [ ] 環境變數已正確設定
- [ ] Tavily API 測試通過
- [ ] Exa API 測試通過
- [ ] 雙引擎並行測試通過
- [ ] 域名優先測試通過
- [ ] 開發伺服器可正常啟動
- [ ] 實際對話測試正常
- [ ] 搜索結果包含台灣法律資源
- [ ] 回應包含判決書引用
- [ ] 效能符合預期（< 5秒）

---

## 📞 需要幫助？

如果測試失敗或遇到問題：

1. 查看詳細設定指南：`LEGAL_SEARCH_SETUP.md`
2. 查看專案總覽：`LEGAL_AI_GUIDE.md`
3. 檢查環境變數：`.env.example.legal`
4. 查看 GitHub Issues 或提出新問題

---

## 🎯 測試通過後的下一步

1. **生產環境部署**
   - 設定生產環境的 API Keys
   - 配置 Redis 快取
   - 啟用監控和日誌

2. **效能優化**
   - 調整 max_results 和 search_depth
   - 實施搜索結果快取
   - 設定 API 呼叫限制

3. **功能增強**
   - 新增更多台灣法律網域
   - 優化關鍵字增強邏輯
   - 實作搜索歷史記錄

4. **持續監控**
   - 追蹤 API 使用量
   - 監控搜索成功率
   - 收集用戶回饋
