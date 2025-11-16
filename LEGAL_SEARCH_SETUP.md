# 法律專用深度搜索系統設定指南

## 🎯 系統概述

LegalMentor 整合了 **Tavily** 和 **Exa** 兩大 AI 搜索引擎，打造專門針對中華民國裁判書和法律資源的深度搜索系統。

### 為什麼選擇 Tavily + Exa？

| 特性 | Tavily | Exa | 組合優勢 |
|------|--------|-----|----------|
| **搜索類型** | AI 優化搜索 | 神經網路語義搜索 | 覆蓋廣度 + 深度 |
| **法律理解** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 專業術語理解更精準 |
| **速度** | 快 | 中等 | 並行搜索，總體快速 |
| **結果品質** | 高 | 非常高 | 互補去重，品質最優 |
| **台灣資源** | 支援域名篩選 | 支援域名篩選 | 自動優先台灣法律網站 |

---

## 🚀 快速開始

### 步驟 1: 註冊 API Keys

#### 1.1 Tavily Search API (必需)

1. 前往 https://app.tavily.com/
2. 註冊帳號（可用 Google 登入）
3. 進入 Dashboard → API Keys
4. 複製你的 API Key（格式：`tvly-...`）

**免費方案**：
- 每月 1,000 次搜索
- 支援深度搜索模式
- 包含圖片搜索

#### 1.2 Exa Search API (必需)

1. 前往 https://exa.ai/
2. 註冊帳號
3. 進入 API Settings
4. 複製你的 API Key

**免費方案**：
- 每月 1,000 次搜索
- 完整語義搜索功能

---

### 步驟 2: 配置環境變數

複製環境變數範本：

```bash
cp .env.local.example .env.local
```

編輯 `.env.local`，填入你的 API Keys：

```bash
# AI 模型 (選一個)
OPENAI_API_KEY=sk-your-openai-key
# 或
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# 法律搜索 API (兩個都必需！)
TAVILY_API_KEY=tvly-your-tavily-key
EXA_API_KEY=your-exa-key

# 預設搜索引擎
SEARCH_API=tavily
```

---

### 步驟 3: 啟動系統

```bash
# 安裝依賴
bun install

# 啟動開發伺服器
bun dev

# 訪問 http://localhost:3000
```

---

## 🔧 搜索工具說明

### 1. `legal_search` - 台灣法律專用深度搜索 ⭐

**最強大的法律搜索工具**，整合 Tavily + Exa 雙引擎。

#### 使用場景
- ✅ 查詢判決案例
- ✅ 搜索法律條文解釋
- ✅ 尋找實務見解
- ✅ 研究法律議題

#### 參數說明

```typescript
legal_search({
  query: "車禍過失傷害判決",           // 搜索關鍵字
  legal_context: "民事法",              // 法律領域（選填）
  max_results: 20,                      // 最大結果數（預設 20）
  search_depth: "advanced",             // basic | advanced（預設 advanced）
  include_judgment_only: false          // 是否只搜索判決書（預設 false）
})
```

#### 自動優化

**關鍵字增強**：
- 輸入：`"租賃糾紛"`
- 自動增強：`"台灣法律 租賃糾紛"`

**域名優先**：
自動優先搜索以下台灣法律網站：
- 司法院系統（judicial.gov.tw）
- 全國法規資料庫（law.moj.gov.tw）
- 專業法律網站（lawbank.com.tw 等）

**結果排序**：
- 司法院判決書結果排在最前面
- 去除重複 URL
- 綜合兩個引擎的結果

---

### 2. `judgment_only_search` - 純判決書搜索

**專門搜索司法院判決書系統**，適合只需要判決案例的情況。

#### 使用場景
- ✅ 查詢特定類型判決
- ✅ 研究法院判決趨勢
- ✅ 尋找類似案例

#### 參數說明

```typescript
judgment_only_search({
  query: "租賃押金糾紛",                // 搜索關鍵字
  case_type: "民事",                    // 民事 | 刑事 | 行政 | 全部
  max_results: 15                       // 最大結果數（預設 15）
})
```

#### 特色
- 只搜索 `judicial.gov.tw` 域名
- 可依案件類型篩選
- 自動添加「判決」關鍵字

---

## 🎨 搜索策略

### 策略 1: 廣泛搜索（預設）

適用：不確定需要什麼資源時

```typescript
legal_search({
  query: "勞資糾紛",
  search_depth: "advanced"
})
```

**搜索範圍**：
- 判決書
- 法規條文
- 律師文章
- 學術論文

---

### 策略 2: 判決書優先

適用：需要判決案例參考

```typescript
judgment_only_search({
  query: "車禍過失傷害",
  case_type: "刑事"
})
```

**搜索範圍**：
- 僅司法院判決書系統

---

### 策略 3: 混合搜索

適用：需要全面資訊

```typescript
// 第一步：廣泛搜索
legal_search({
  query: "消費者保護法 網購退貨",
  legal_context: "消費者保護"
})

// 第二步：如需更多判決，再用判決書專搜
judgment_only_search({
  query: "網購退貨",
  case_type: "民事"
})
```

---

## 📊 搜索結果範例

### legal_search 返回格式

```json
{
  "results": [
    {
      "title": "臺灣臺北地方法院 110 年度訴字第 1234 號民事判決",
      "url": "https://judgment.judicial.gov.tw/...",
      "content": "判決摘要內容..."
    },
    {
      "title": "全國法規資料庫 - 民法第 184 條",
      "url": "https://law.moj.gov.tw/...",
      "content": "法條全文..."
    }
  ],
  "query": "台灣法律 車禍過失傷害判決 司法院",
  "images": [],
  "number_of_results": 15,
  "metadata": {
    "enhanced_query": "台灣法律 車禍過失傷害判決 司法院",
    "legal_context": "民事法",
    "search_strategy": "dual_api_taiwan_legal",
    "apis_used": ["tavily", "exa"],
    "prioritized_domains": [
      "judicial.gov.tw",
      "law.moj.gov.tw",
      "lawbank.com.tw",
      "lawtw.com",
      "6law.idv.tw"
    ]
  }
}
```

---

## 🔍 搜索深度對比

### Basic Mode (基礎模式)

```typescript
legal_search({
  query: "勞資糾紛",
  search_depth: "basic"
})
```

**特性**：
- ⚡ 速度快（~2秒）
- 📄 結果較少但精準
- 💰 API 成本低

**適用**：
- 簡單法律問題
- 快速查詢

---

### Advanced Mode (進階模式) ⭐ 推薦

```typescript
legal_search({
  query: "勞資糾紛",
  search_depth: "advanced"
})
```

**特性**：
- 🔬 深度搜索（~4秒）
- 📚 結果更全面
- 🎯 更準確的法律資源
- 💎 包含圖片和引用

**適用**：
- 複雜法律問題
- 需要全面資訊

---

## 💡 最佳實踐

### 1. 關鍵字技巧

❌ **不好的關鍵字**：
```
"法律問題"（太模糊）
"幫我"（無意義）
```

✅ **好的關鍵字**：
```
"車禍過失傷害判決"
"租賃契約押金返還 民法"
"勞基法資遣費計算"
```

---

### 2. 使用 legal_context

```typescript
// 更精準的搜索
legal_search({
  query: "資遣費計算",
  legal_context: "勞動法"  // 指定法律領域
})
```

**好處**：
- 自動過濾不相關結果
- 優先搜索該領域資源

---

### 3. 組合搜索

```typescript
// 步驟 1: 廣泛了解
await legal_search({
  query: "租賃糾紛處理方式",
  search_depth: "basic"
})

// 步驟 2: 深入判決
await judgment_only_search({
  query: "租賃押金糾紛",
  case_type: "民事"
})
```

---

## 🐛 常見問題

### Q1: 搜索沒有結果？

**可能原因**：
1. API Key 未設定或無效
2. 關鍵字太模糊
3. 網路連線問題

**解決方案**：
```bash
# 檢查環境變數
echo $TAVILY_API_KEY
echo $EXA_API_KEY

# 測試 API
curl -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -d '{"api_key":"your-key","query":"test"}'
```

---

### Q2: 搜索結果不相關？

**優化方法**：
1. 使用更具體的關鍵字
2. 添加 `legal_context` 參數
3. 嘗試 `judgment_only_search`

---

### Q3: API 配額不足？

**策略**：
1. 只對重要查詢使用 `advanced` 模式
2. 一般查詢使用 `basic` 模式
3. 考慮升級付費方案

**免費方案限制**：
- Tavily: 1,000 次/月
- Exa: 1,000 次/月
- 合計：可處理約 500 次用戶查詢（假設每次查詢用 2 API calls）

---

## 📈 效能優化

### 1. 使用 Redis 快取

```bash
# 啟用 Redis
NEXT_PUBLIC_ENABLE_SAVE_CHAT_HISTORY=true
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**好處**：
- 相同查詢不重複呼叫 API
- 回應速度提升 10 倍
- 節省 API 配額

---

### 2. 調整搜索參數

```typescript
// 預設配置（較慢但全面）
legal_search({
  query: "問題",
  max_results: 20,
  search_depth: "advanced"
})

// 效能優化配置
legal_search({
  query: "問題",
  max_results: 10,        // 減少結果數
  search_depth: "basic"   // 使用基礎模式
})
```

---

## 🔐 安全注意事項

### 1. API Key 保護

```bash
# ✅ 正確：使用環境變數
TAVILY_API_KEY=tvly-xxx

# ❌ 錯誤：寫在程式碼中
const apiKey = "tvly-xxx"  // 不要這樣做！
```

### 2. 檢查 .gitignore

確保 `.env.local` 已加入 `.gitignore`：

```bash
# .gitignore
.env.local
.env*.local
```

---

## 📊 成本估算

### 免費方案（每月）

| API | 免費額度 | 預估可處理 |
|-----|----------|------------|
| Tavily | 1,000 次 | ~500 用戶查詢 |
| Exa | 1,000 次 | ~500 用戶查詢 |
| **總計** | - | **~500 查詢/月** |

### 付費方案

**Tavily Pro**：
- $49/月：25,000 次搜索
- $99/月：100,000 次搜索

**Exa Pro**：
- 依用量計費
- 約 $0.01 - $0.05 / 次搜索

---

## 🎯 總結

✅ **立即可用**：設定兩個 API Key 即可啟動
⚡ **效能強大**：雙引擎並行，結果全面
🇹🇼 **台灣優化**：自動優先搜索台灣法律資源
💰 **成本友善**：免費方案足夠個人使用

---

需要幫助？查看完整文檔：`LEGAL_AI_GUIDE.md`
