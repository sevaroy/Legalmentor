# 🧪 搜索策略測試指南

## 📋 測試資源概覽

### 📄 測試文檔
- `TEST_PROMPTS.md` - 完整的測試提示詞集合
- `TESTING_GUIDE.md` - 本測試指南
- `CHECKLIST.md` - 測試檢查清單

### 🛠️ 測試工具
- `scripts/quick-strategy-test.js` - 快速策略測試
- `scripts/interactive-test.js` - 互動式測試工具
- `scripts/test-all-features.js` - 全功能測試

### 🌐 網頁測試界面
- http://localhost:3000/hybrid-search - 混合搜索界面
- http://localhost:3000/strategy-demo - 策略演示頁面

## 🚀 快速開始

### 1. 確保服務運行
```bash
# 檢查服務狀態
./check-env.sh

# 啟動服務（如果未運行）
./start-local.sh
```

### 2. 執行快速測試
```bash
# 執行預定義的策略測試
node scripts/quick-strategy-test.js
```

### 3. 互動式測試
```bash
# 啟動互動式測試工具
node scripts/interactive-test.js
```

## 📊 測試策略分類

### 🏛️ 知識庫優先策略測試

**目標**: 驗證法律專業問題能正確選擇知識庫搜索

**測試提示詞**:
```
✅ 應該觸發知識庫優先:
- 民法第184條關於侵權行為的規定是什麼？
- 憲法第7條平等權的內容為何？
- 什麼是侵權行為的構成要件？
- 契約自由原則的內容和限制？
- 如何判斷是否構成過失侵權？

🔍 關鍵詞觸發:
法律、法規、條文、判決、憲法、民法、刑法、商法、行政法、
契約、侵權、物權、債權、犯罪、起訴、法院、律師、法官
```

**預期結果**:
- 策略選擇: `knowledge-first` 或智能選擇知識庫
- 置信度: > 80%
- 主要來源: RAGFlow 知識庫
- 響應時間: < 15秒

### 🌐 網路優先策略測試

**目標**: 驗證時事新聞問題能正確選擇網路搜索

**測試提示詞**:
```
✅ 應該觸發網路優先:
- 2024年最新的AI法規政策有哪些？
- 今年台灣通過了哪些重要法律修正案？
- 最近關於AI著作權的重要判決？
- 目前政府推動的數位治理政策？
- 最新的個資法違法裁罰案例？

🔍 關鍵詞觸發:
最新、今天、現在、新聞、時事、2024、2025、近期、最近、
剛剛、發生、公布、宣布、更新、即時、當前、目前
```

**預期結果**:
- 策略選擇: `web-first` 或智能選擇網路搜索
- 置信度: > 70%
- 主要來源: Tavily 網路搜索
- 響應時間: < 12秒

### ⚡ 混合搜索策略測試

**目標**: 驗證跨領域問題能正確選擇混合搜索

**測試提示詞**:
```
✅ 應該觸發混合搜索:
- 人工智能在法律服務中的應用前景如何？
- 區塊鏈技術對智慧財產權的影響？
- 醫療AI的法律責任歸屬問題？
- 法律科技如何改變傳統法律實務？
- AI法律顧問的發展現況和法律挑戰？

🔍 關鍵詞觸發:
AI、人工智能、機器學習、深度學習、區塊鏈、加密貨幣、
程式設計、軟體開發、資料科學、雲端運算、物聯網
```

**預期結果**:
- 策略選擇: `hybrid` 或同時使用多種搜索
- 置信度: > 75%
- 來源組合: 網路搜索 + 知識庫
- 響應時間: < 20秒

## 🎯 測試執行方法

### 方法一：命令行快速測試
```bash
# 執行所有預定義測試
node scripts/quick-strategy-test.js

# 預期輸出示例:
# 🏛️ 知識庫優先 測試開始...
# [1/5] 🧪 測試: 民法第184條關於侵權行為的規定是什麼？...
#    ✅ 策略正確: knowledge-first
#    ⏱️  響應時間: 8500ms
#    📊 置信度: 86%
#    📚 來源數: 6
```

### 方法二：互動式測試
```bash
# 啟動互動式測試工具
node scripts/interactive-test.js

# 選擇測試類別和具體問題
# 實時查看策略選擇結果
```

### 方法三：網頁界面測試
```bash
# 訪問策略演示頁面
open http://localhost:3000/strategy-demo

# 或使用混合搜索界面
open http://localhost:3000/hybrid-search
```

### 方法四：API 直接測試
```bash
# 測試知識庫優先
curl -X POST http://localhost:3000/api/chat/hybrid \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "民法第184條的內容？"}],
    "searchMode": "intelligent"
  }' | jq .

# 測試網路優先
curl -X POST http://localhost:3000/api/chat/hybrid \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "2024年最新AI法規？"}],
    "searchMode": "intelligent"
  }' | jq .
```

## 📈 測試結果評估

### 策略選擇準確性指標
- **優秀**: 準確率 > 85%
- **良好**: 準確率 70-85%
- **需改進**: 準確率 < 70%

### 性能指標
- **響應時間**: 
  - 知識庫搜索: < 15秒
  - 網路搜索: < 12秒
  - 混合搜索: < 20秒
- **置信度**: > 70%
- **來源多樣性**: 混合搜索應包含多種來源

### 品質指標
- **答案相關性**: 1-5分
- **資訊完整性**: 1-5分
- **專業準確性**: 1-5分
- **時效性**: 1-5分

## 🔧 測試問題排除

### 常見問題

#### 1. 策略選擇不準確
```bash
# 檢查關鍵詞匹配規則
# 查看 lib/agents/hybrid-search-agent.ts 中的 determineSearchStrategy 方法

# 可能原因:
# - 關鍵詞列表不完整
# - 匹配邏輯需要調整
# - 問題複雜度分析有誤
```

#### 2. 響應時間過長
```bash
# 檢查網路連接
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3000/api/chat/hybrid

# 可能原因:
# - Tavily API 響應慢
# - RAGFlow 服務負載高
# - 網路連接問題
```

#### 3. 置信度偏低
```bash
# 檢查搜索結果品質
# 查看返回的 sources 數量和相關性

# 可能原因:
# - 知識庫內容不足
# - 搜索關鍵詞不匹配
# - 結果合併邏輯需優化
```

### 調試技巧

#### 1. 啟用詳細日誌
```bash
# 查看 RAGFlow 服務日誌
tail -f logs/ragflow.log

# 查看 Next.js 應用日誌
tail -f logs/nextjs.log
```

#### 2. 使用瀏覽器開發者工具
```javascript
// 在瀏覽器 Console 中執行
fetch('/api/chat/hybrid', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    messages: [{role: 'user', content: '測試問題'}],
    searchMode: 'intelligent'
  })
}).then(r => r.json()).then(console.log);
```

#### 3. 分析策略選擇邏輯
```bash
# 檢查智能選擇邏輯
grep -n "determineSearchStrategy" lib/agents/hybrid-search-agent.ts

# 檢查關鍵詞匹配
grep -A 10 -B 5 "legalKeywords" lib/agents/hybrid-search-agent.ts
```

## 📊 測試報告模板

### 測試執行記錄
```
測試日期: ____
測試工具: ____
測試類別: ____
測試數量: ____
成功率: ____%
平均響應時間: ____ms
平均置信度: ____%
```

### 策略準確性統計
```
知識庫優先策略: ___/___  (___%)
網路優先策略: ___/___   (___%)
混合搜索策略: ___/___   (___%)
整體準確率: ____%
```

### 問題和建議
```
發現的問題:
1. ____
2. ____

改進建議:
1. ____
2. ____

下次測試重點:
1. ____
2. ____
```

## 🎉 測試最佳實踐

### 1. 定期測試
- 每次代碼更新後執行快速測試
- 每週執行完整的策略測試
- 每月進行性能基準測試

### 2. 多樣化測試
- 使用不同長度的問題
- 測試不同領域的問題
- 包含邊界案例和異常情況

### 3. 結果記錄
- 保存測試結果和日誌
- 追蹤性能變化趨勢
- 記錄用戶反饋和問題

### 4. 持續改進
- 根據測試結果調整策略
- 優化關鍵詞匹配規則
- 改進結果合併邏輯

---

🎯 **開始測試**: `node scripts/quick-strategy-test.js`

📖 **詳細提示詞**: 查看 `TEST_PROMPTS.md`

🔧 **互動測試**: `node scripts/interactive-test.js`

🌐 **網頁測試**: http://localhost:3000/strategy-demo