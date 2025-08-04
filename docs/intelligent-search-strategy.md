# 智能搜索策略系統

## 概述

智能搜索策略系統是混合搜索代理的核心功能，它能夠根據用戶問題的內容和特徵，自動選擇最適合的搜索策略，以提供最準確和相關的答案。

## 策略分類

### 1. 知識庫優先 (knowledge-first)
**適用場景：** 專業領域問題，特別是法律相關查詢

**觸發條件：**
- 包含法律專業關鍵詞
- 需要權威性和準確性的專業知識

**執行流程：**
1. 首先搜索 RAGFlow 知識庫
2. 評估結果置信度
3. 如果置信度 > 0.7，直接返回知識庫結果
4. 如果置信度較低，補充 Tavily 網路搜索

### 2. 網路優先 (web-first)
**適用場景：** 時事新聞、最新資訊、即時數據

**觸發條件：**
- 包含時間相關關鍵詞
- 需要最新資訊的查詢

**執行流程：**
1. 首先執行 Tavily 深度網路搜索
2. 嘗試補充知識庫搜索（如果相關）
3. 合併結果，以網路搜索為主

### 3. 混合搜索 (hybrid)
**適用場景：** 一般性問題，需要多角度資訊

**執行流程：**
1. 並行執行網路搜索和知識庫搜索
2. 智能合併兩種結果
3. 根據配置決定優先級

## 關鍵詞匹配規則

### 法律專業關鍵詞
```typescript
const legalKeywords = [
  '法律', '法規', '條文', '判決', '憲法', 
  '民法', '刑法', '商法', '行政法', '公司法',
  '契約', '侵權', '物權', '債權', '犯罪',
  '起訴', '法院', '律師', '法官', '檢察官'
]
```

### 時事新聞關鍵詞
```typescript
const currentKeywords = [
  '最新', '今天', '現在', '新聞', '時事',
  '2024', '2025', '近期', '最近', '剛剛',
  '發生', '公布', '宣布', '更新'
]
```

### 技術專業關鍵詞
```typescript
const techKeywords = [
  'AI', '人工智能', '機器學習', '深度學習',
  '區塊鏈', '加密貨幣', '程式設計', '軟體開發'
]
```

## 決策流程圖

```
用戶問題
    ↓
關鍵詞分析
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   法律專業關鍵詞   │   時事新聞關鍵詞   │     其他問題      │
│       ↓         │       ↓         │       ↓         │
│  knowledge-first │    web-first    │     hybrid      │
└─────────────────┴─────────────────┴─────────────────┘
```

## 實際應用示例

### 示例 1：法律問題
**用戶問題：** "民法中關於契約違約的責任規定是什麼？"

**策略選擇：** knowledge-first
**執行過程：**
1. 檢測到關鍵詞：民法、契約
2. 選擇知識庫優先策略
3. 搜索 RAGFlow 法律知識庫
4. 獲得高置信度結果 (0.85)
5. 直接返回知識庫答案

### 示例 2：時事問題
**用戶問題：** "2024年最新的AI法規政策有哪些？"

**策略選擇：** web-first
**執行過程：**
1. 檢測到關鍵詞：2024年、最新
2. 選擇網路優先策略
3. 執行 Tavily 深度搜索
4. 補充知識庫中的相關法規背景
5. 合併結果，以網路搜索為主

### 示例 3：混合問題
**用戶問題：** "如何理解人工智能在醫療領域的應用？"

**策略選擇：** hybrid
**執行過程：**
1. 沒有明確的專業或時事關鍵詞
2. 選擇混合搜索策略
3. 並行執行網路搜索和知識庫搜索
4. 智能合併結果
5. 提供全面的答案

## 置信度評估機制

### 知識庫結果置信度
```typescript
function calculateKnowledgeConfidence(result: KnowledgeSearchResult): number {
  let confidence = 0.5 // 基礎置信度
  
  // 基於來源數量
  if (result.sources.length > 0) {
    confidence += Math.min(result.sources.length * 0.1, 0.3)
  }
  
  // 基於相似度分數
  const avgSimilarity = result.sources.reduce((sum, source) => 
    sum + (source.similarity || 0.5), 0) / result.sources.length
  confidence += avgSimilarity * 0.4
  
  return Math.min(confidence, 0.95)
}
```

### 混合結果置信度
```typescript
function calculateHybridConfidence(result: HybridSearchResult): number {
  let confidence = 0.5
  
  // 知識庫結果加成
  if (result.knowledge_results?.confidence) {
    confidence += result.knowledge_results.confidence * 0.4
  }
  
  // 網路搜索結果加成
  if (result.web_results && result.web_results.length > 0) {
    confidence += Math.min(result.web_results.length / 10, 0.3)
  }
  
  // 多模式搜索加成
  if (result.mode_used && result.mode_used.length > 1) {
    confidence += 0.1
  }
  
  return Math.min(confidence, 0.95)
}
```

## 結果合併策略

### 知識庫優先合併
```typescript
if (prioritizeKnowledge && knowledgeResults?.answer) {
  combinedAnswer = knowledgeResults.answer
  
  // 添加網路搜索補充
  if (webResults?.results && webResults.results.length > 0) {
    const webSummary = generateWebResultsSummary(webResults.results.slice(0, 3))
    if (webSummary) {
      combinedAnswer += `\n\n**最新網路資訊補充：**\n${webSummary}`
    }
  }
}
```

### 網路優先合併
```typescript
else if (webResults?.results && webResults.results.length > 0) {
  combinedAnswer = generateWebResultsSummary(webResults.results.slice(0, 5))
  
  // 添加知識庫專業見解
  if (knowledgeResults?.answer) {
    combinedAnswer += `\n\n**專業知識庫見解：**\n${knowledgeResults.answer}`
  }
}
```

## 性能優化

### 並行搜索
- 網路搜索和知識庫搜索同時執行
- 使用 Promise.allSettled 處理可能的失敗
- 即使一個搜索失敗，另一個仍可提供結果

### 結果快取
- 相似問題的結果可以快取
- 減少重複搜索的延遲
- 提高系統響應速度

### 錯誤處理
- 優雅降級：如果首選策略失敗，自動切換到備用策略
- 部分結果返回：即使部分搜索失敗，仍返回可用結果
- 詳細錯誤日誌：便於問題診斷和系統優化

## 配置選項

### 關鍵詞自定義
用戶可以根據特定領域添加自定義關鍵詞：

```typescript
const customKeywords = {
  medical: ['醫療', '診斷', '治療', '藥物', '病症'],
  finance: ['金融', '投資', '股票', '基金', '保險'],
  technology: ['科技', '軟體', '硬體', '網路', '資安']
}
```

### 置信度閾值調整
```typescript
const confidenceThresholds = {
  high: 0.8,    // 高置信度，直接返回
  medium: 0.6,  // 中等置信度，補充搜索
  low: 0.4      // 低置信度，切換策略
}
```

這個智能策略系統讓混合搜索能夠根據問題特性自動優化搜索方式，提供最相關和準確的答案。