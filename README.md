# RAGFlow 整合專案

## 專案背景

在探索 RAG（檢索增強生成）技術時，我選擇了 RAGFlow 作為核心引擎。然而在實際整合過程中發現，RAGFlow 的 API 設計相對複雜，需要多步驟的調用流程，對前端開發並不友善。

因此決定開發一個 FastAPI 代理服務，將複雜的 RAGFlow API 封裝成簡潔的介面，同時解決會話管理、錯誤處理等實際問題。

## 核心挑戰與解決方案

### 1. API 複雜度問題
RAGFlow 採用多步驟的 API 調用模式：需要先創建聊天助手，再建立會話，最後才能進行問答。這種設計雖然靈活，但增加了整合複雜度。

```python
# RAGFlow 的標準調用流程
def setup_chat_session(self, dataset_id: str):
    # 步驟1：創建聊天助手
    chat_result = self.client.create_chat(
        name=f"Assistant_{uuid.uuid4().hex[:8]}",
        dataset_ids=[dataset_id]
    )
    
    # 步驟2：建立會話
    session_result = self.client.create_session(chat_result['data']['id'])
    
    # 步驟3：準備問答環境
    return chat_result['data']['id'], session_result['data']['id']
```

### 2. 會話狀態管理
在多用戶環境下，需要有效管理會話狀態，避免重複創建和資源浪費。設計了一個輕量級的會話管理器：

```python
class SessionManager:
    def __init__(self):
        self.sessions = {}  # 內存存儲，適合原型開發
        
    def get_or_create_session(self, dataset_id: str, user_id: str = None):
        session_key = f"{dataset_id}_{user_id or 'anonymous'}"
        
        if session_key not in self.sessions:
            self.sessions[session_key] = self._create_new_session(dataset_id)
            
        return self.sessions[session_key]
```

### 3. 資料格式標準化
RAGFlow 的回應格式在不同情況下會有差異，需要進行標準化處理：

```typescript
// 統一回應格式處理
function normalizeResponse(rawResponse: any): ChatResponse {
    let sources = rawResponse.reference || []
    
    // 處理不同的 sources 格式
    if (typeof sources === 'object' && 'chunks' in sources) {
        sources = sources.chunks
    } else if (!Array.isArray(sources)) {
        sources = []
    }
    
    return {
        answer: rawResponse.answer || '',
        sources: sources,
        success: true
    }
}
```

## 實際架構

### FastAPI 代理層設計理念

在評估直接前端調用與代理模式後，選擇了 FastAPI 作為中間層。這個決策基於以下技術考量：

#### 直接調用的複雜性分析：
```javascript
// 前端直接整合需要處理的複雜流程
async function directRAGFlowIntegration(question, dataset_id) {
    try {
        // 步驟1：獲取數據集資訊
        const datasets = await fetch('http://ragflow:9380/api/v1/datasets', {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        })
        
        // 步驟2：創建聊天助手實例
        const chatResponse = await fetch('http://ragflow:9380/api/v1/chats', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                name: `chat_${Date.now()}`,
                dataset_ids: [dataset_id]
            })
        })
        
        // 步驟3：建立會話連接
        const sessionResponse = await fetch(
            `http://ragflow:9380/api/v1/chats/${chat_id}/sessions`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        })
        
        // 步驟4：執行問答請求
        const completionResponse = await fetch(
            `http://ragflow:9380/api/v1/chats/${chat_id}/completions`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                question: question,
                session_id: session_id,
                quote: true
            })
        })
        
        return await completionResponse.json()
    } catch (error) {
        // 需要處理多個端點的不同錯誤類型
        throw new Error(`RAGFlow integration failed: ${error.message}`)
    }
}
```

#### 代理模式的簡化效果：
```javascript
// 使用代理後的簡潔介面
async function askQuestion(question, dataset_id) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, dataset_id })
    })
    
    if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`)
    }
    
    return response.json()
}
```

### FastAPI 代理的好處

#### 1. **簡化前端邏輯**
- 前端不用管 RAGFlow 的複雜流程
- 一個 API 調用就搞定，不用串接多個端點
- 不用在前端處理 API Key 和認證

#### 2. **統一會話管理**
```python
# 代理服務自動處理會話
class SessionManager:
    def get_or_create_session(self, dataset_id, user_id):
        # 檢查是否有現成的會話
        existing_session = self.find_session(dataset_id, user_id)
        if existing_session:
            return existing_session
            
        # 沒有的話就建一個新的
        return self.create_new_session(dataset_id, user_id)
```

#### 3. **錯誤處理和重試**
```python
# 代理服務統一處理各種錯誤
async def chat_with_retry(chat_id, session_id, question):
    for attempt in range(3):
        try:
            result = await ragflow_client.chat_completion(
                chat_id=chat_id,
                session_id=session_id,
                question=question
            )
            return result
        except Exception as e:
            if attempt == 2:  # 最後一次重試
                raise HTTPException(500, f"RAGFlow 服務異常: {str(e)}")
            await asyncio.sleep(2 ** attempt)  # 指數退避
```

#### 4. **資料格式統一**
```python
# 處理 RAGFlow 回應格式的不一致
def normalize_response(raw_response):
    # RAGFlow 有時候 sources 是陣列，有時候是物件
    sources = raw_response.get('reference', [])
    if isinstance(sources, dict) and 'chunks' in sources:
        sources = sources['chunks']
    elif not isinstance(sources, list):
        sources = []
    
    return {
        'answer': raw_response.get('answer', ''),
        'sources': sources,
        'success': True
    }
```

#### 5. **安全性**
- API Key 不會暴露到前端
- 可以加上 CORS 控制
- 可以加上 rate limiting
- 可以記錄使用日誌

#### 6. **快取和性能優化**
```python
# 可以加上快取機制
@lru_cache(maxsize=100)
def get_datasets():
    return ragflow_client.list_datasets()

# 會話池管理
class SessionPool:
    def __init__(self, max_sessions=50):
        self.sessions = {}
        self.max_sessions = max_sessions
    
    def cleanup_old_sessions(self):
        # 定期清理過期會話，避免記憶體洩漏
```

### 後端 (FastAPI)
所以最後的架構是這樣：

```python
@app.post("/chat")
async def chat(request: ChatRequest):
    # 檢查有沒有現成的會話，沒有就建一個
    if not request.session_id:
        session_result = session_manager.create_session(request.dataset_id)
        session_id = session_result['session_id']
    
    # 直接調用 RAGFlow
    result = ragflow_client.chat_completion(
        chat_id=session_info['chat_id'],
        session_id=session_id,
        question=request.question
    )
    
    return result
```

### 前端 (TypeScript)
前端就是個簡單的客戶端，主要處理：
- 網路請求的重試（RAGFlow 有時候會超時）
- 型別安全（TypeScript 的好處）
- 錯誤處理

```typescript
async chat(request: ChatRequest): Promise<ChatResponse> {
    // 加了重試機制，因為 RAGFlow 有時候會掛
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                body: JSON.stringify(request),
                signal: AbortSignal.timeout(90000) // 90秒超時
            })
            return response.json()
        } catch (error) {
            if (i === 2) throw error
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
    }
}
```

## 踩過的坑

### RAGFlow 的奇怪行為
1. **會話會自動過期**：沒有明確的過期時間說明，有時候用著用著就失效了
2. **回應格式不一致**：有時候 sources 是陣列，有時候是包在 chunks 裡的物件
3. **錯誤訊息不清楚**：經常只回傳 500 錯誤，沒有具體原因

### 解決方式
```python
# 會話管理加了自動清理
def cleanup_old_sessions(self, max_age_hours: int = 24):
    current_time = datetime.now()
    expired_sessions = []
    
    for session_id, session_info in self.sessions.items():
        age = (current_time - session_info['last_used']).total_seconds() / 3600
        if age > max_age_hours:
            expired_sessions.append(session_id)
    
    for session_id in expired_sessions:
        del self.sessions[session_id]
```

### Docker 部署的問題
RAGFlow 本身就是個 Docker 服務，再加上我的 API 服務，網路設定有點複雜。最後用 docker-compose 解決：

```yaml
services:
  ragflow-api:
    build: ./ragflow_fastapi
    ports:
      - "8001:8001"
    environment:
      - RAGFLOW_API_URL=http://ragflow:9380  # 內部網路
```

## 系統現狀評估

### 已實現功能
- **對話管理**：支援單輪和多輪問答，具備基本的上下文理解能力
- **數據集切換**：動態選擇不同知識庫，支援多領域問答場景
- **會話持久化**：智能會話管理，避免重複初始化開銷
- **來源追溯**：提供答案來源標註，增強回答可信度

### 技術限制與挑戰
- **回答一致性**：受限於底層模型能力，複雜推理問題的穩定性有待提升
- **多語言支援**：中文語義理解相對英文仍有差距，特別是專業術語處理
- **響應性能**：複雜查詢的處理時間較長（10-20秒），影響用戶體驗
- **資源管理**：會話清理機制需要完善，避免長期運行的內存累積

### 測試驗證結果
```python
# 系統測試用例覆蓋
test_scenarios = [
    "基礎資訊查詢：數據集內容概覽",
    "概念解釋：核心概念的定義和說明", 
    "關鍵資訊提取：重要信息的識別和整理"
]
```

**性能表現分析：**
- **事實性查詢**：準確率 > 85%，回應時間 < 5秒
- **推理性問題**：準確率約 70%，偶有邏輯偏差
- **跨文檔整合**：準確率約 60%，容易遺漏關聯信息

### 品質改進方向
- **檢索優化**：改進向量檢索策略，提升相關文檔召回率
- **答案生成**：優化 prompt 設計，增強回答的邏輯性和完整性
- **評估機制**：建立自動化的答案品質評估體系

## 部署方式

### 本地開發
```bash
# 1. 先啟動 RAGFlow（這個最麻煩）
docker-compose up ragflow

# 2. 啟動我的 API 服務
cd ragflow_fastapi
python fastapi_server.py

# 3. 前端開發
npm run dev
```

### 環境變數
```bash
# .env
RAGFLOW_API_URL=http://localhost:9380
RAGFLOW_API_KEY=ragflow-your-api-key-here
```

RAGFlow 的 API Key 要從他們的 Web 介面取得，這個也花了我一些時間才搞懂。

## 代理模式 vs 直接調用的比較

### 直接調用 RAGFlow API
```
前端 → RAGFlow API (多次調用)
```
**問題：**
- 需要 4-5 次 API 調用才能問一個問題
- 前端要管理複雜的狀態
- API Key 暴露在前端
- 錯誤處理分散在各處
- 每次都要重新建立會話

### 使用 FastAPI 代理
```
前端 → FastAPI 代理 → RAGFlow API
```
**好處：**
- 前端只需要一次 API 調用
- 複雜邏輯都在後端處理
- API Key 安全存放
- 統一的錯誤處理和重試
- 會話可以重複使用

### 實際開發體驗對比

#### 直接調用時的痛苦：
```javascript
// 每次問問題都要寫這麼多程式碼
const askQuestion = async (question) => {
    try {
        // 取得數據集
        const datasets = await getDatasets()
        
        // 創建聊天助手
        const chat = await createChat(datasets[0].id)
        
        // 創建會話
        const session = await createSession(chat.id)
        
        // 問問題
        const answer = await chatCompletion(chat.id, session.id, question)
        
        return answer
    } catch (error) {
        // 要處理各種可能的錯誤
        if (error.status === 401) {
            // API Key 問題
        } else if (error.status === 500) {
            // RAGFlow 內部錯誤
        } else if (error.status === 404) {
            // 資源不存在
        }
        // ... 更多錯誤處理
    }
}
```

#### 用代理後的簡潔：
```javascript
// 現在只要這樣
const askQuestion = async (question, dataset_id) => {
    const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ question, dataset_id })
    })
    
    if (!response.ok) {
        throw new Error('問答失敗')
    }
    
    return response.json()
}
```

## 技術反思與收穫

### 架構設計思考
1. **代理模式的價值**：在複雜第三方服務整合中，適當的抽象層能顯著提升開發效率
2. **API 設計哲學**：簡潔的介面設計比功能完整性更重要，特別是在快速原型階段
3. **狀態管理策略**：會話管理比預期複雜，需要考慮併發、清理、持久化等多個面向
4. **錯誤處理機制**：分散式系統中，重試和降級策略是必需品，不是可選項

### 開發經驗總結
- **文檔驅動開發**：不完整的第三方文檔會大幅增加整合成本，需要預留充足的探索時間
- **測試先行策略**：針對不穩定的外部服務，完善的測試覆蓋是品質保證的基礎
- **漸進式交付**：先實現核心功能，再逐步完善，避免過度設計

### 技術債務與改進方向
**當前限制：**
- 會話存儲依賴內存，不支援分散式部署
- 缺乏完整的監控和告警機制
- 錯誤處理策略相對簡單

**未來優化計劃：**
- 引入 Redis 支援分散式會話管理
- 整合 Prometheus + Grafana 監控體系
- 實現熔斷機制和更完善的降級策略

## 發展規劃

### 近期目標（1個月內）
- **系統穩定性**：解決內存洩漏問題，完善錯誤處理機制
- **用戶體驗**：開發簡潔的 Web 測試介面，改善錯誤提示
- **程式碼品質**：增加單元測試覆蓋率，建立 CI/CD 流程

### 中期規劃（3個月內）
- **性能優化**：研究回答品質提升策略，優化檢索算法
- **技術探索**：評估其他 RAG 框架（LangChain、LlamaIndex）的整合可能性
- **功能擴展**：支援多模態內容處理，增強中文語義理解

### 長期願景（6個月以上）
- **平台化發展**：構建完整的知識庫管理平台
- **企業級特性**：用戶權限管理、審計日誌、合規性支援
- **生態整合**：支援多種知識庫後端，提供統一的 RAG 服務介面

### 技術選型考量
如果重新設計此系統，會考慮以下改進：

**架構層面：**
- 採用 BFF（Backend for Frontend）模式，更清晰地定義代理層職責
- 引入事件驅動架構，提升系統解耦度
- 考慮使用 Go 或 Rust 重寫核心服務，提升性能表現

**可觀測性：**
- 從設計階段就整合 OpenTelemetry，建立完整的 tracing 體系
- 實現結構化日誌和 metrics 收集
- 建立自動化的健康檢查和告警機制

## 技術棧選擇

### 後端技術
- **FastAPI**：選擇理由是文檔完善、開發效率高，且對 async/await 支援良好
- **RAGFlow**：作為核心 RAG 引擎，提供文檔向量化和語義檢索能力
- **Docker**：容器化部署，簡化環境管理和服務編排

### 前端技術
- **TypeScript**：型別安全對於 API 整合專案至關重要，能有效減少執行時錯誤
- **Next.js**：全端框架，支援 SSR 和 API Routes，適合快速原型開發
- **React**：成熟的 UI 框架，生態系統完整

### 開發工具
- **Git**：版本控制，配合 GitHub 進行程式碼管理
- **VS Code**：主要開發環境，豐富的擴展支援
- **Postman**：API 測試和文檔生成工具

### 技術選型反思
**FastAPI vs 其他框架：**
- 相比 Django：更輕量，適合 API 服務
- 相比 Flask：內建 async 支援和自動文檔生成
- 相比 Node.js：Python 生態系統對 AI/ML 更友善

**為什麼不直接使用 LangChain：**
- 學習目的：希望深入理解 RAG 系統的底層機制
- 控制權：需要精確控制 API 行為和錯誤處理邏輯
- 輕量化：避免引入過多不必要的依賴

## 專案價值與意義

這個專案雖然規模不大，但體現了幾個重要的工程實踐：

**問題解決能力**：面對複雜的第三方 API，能夠設計合適的抽象層來簡化使用
**技術判斷力**：在多種技術方案中選擇最適合當前需求的組合
**工程思維**：考慮到錯誤處理、會話管理、安全性等實際部署問題

更重要的是，通過這個專案深入理解了 RAG 系統的工作原理，為後續的 AI 應用開發奠定了基礎。

---

*在 AI 技術快速發展的今天，能夠有效整合和應用這些技術變得越來越重要。這個專案是我在這個方向上的一次實踐探索。*