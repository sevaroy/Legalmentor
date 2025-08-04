/**
 * RAGFlow API 客戶端
 * 用於與 RAGFlow FastAPI 代理服務通信
 */

export interface Dataset {
  id: string
  name: string
  description?: string
  document_count: number
  create_time?: number
}

export interface ChatRequest {
  question: string
  dataset_id: string
  session_id?: string
  user_id?: string
  quote?: boolean
  stream?: boolean
}

export interface ChatResponse {
  success: boolean
  answer: string
  sources: Array<{
    doc_name?: string
    content?: string
    [key: string]: any
  }>
  session_id: string
  chat_id: string
  message: string
  timestamp: string
}

export interface SessionInfo {
  session_id: string
  chat_id: string
  dataset_id: string
  dataset_name: string
  user_id?: string
  created_at: string
  last_used: string
}

export class RAGFlowClient {
  private baseUrl: string
  private timeout: number
  private maxRetries: number

  constructor(baseUrl?: string, timeout: number = 90000, maxRetries: number = 2) {
    // Use environment variable or fallback to provided baseUrl or default
    this.baseUrl = (process.env.RAGFLOW_PROXY_URL || baseUrl || 'http://localhost:8001').replace(/\/$/, '') // 移除尾部斜線
    this.timeout = timeout
    this.maxRetries = maxRetries
  }

  /**
   * 重試包裝器
   */
  private async retryRequest<T>(fn: () => Promise<T>, context: string): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        console.warn(`${context} attempt ${attempt}/${this.maxRetries} failed:`, error)
        
        if (attempt === this.maxRetries) {
          break
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError!
  }

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<{ service: string; status: string; version: string }> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`)
      }

      return response.json()
    }, 'Health check')
  }

  /**
   * 獲取數據集列表
   */
  async getDatasets(): Promise<Dataset[]> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/datasets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`Failed to fetch datasets: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    }, 'Get datasets')
  }

  /**
   * 發送聊天請求
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: request.question,
          dataset_id: request.dataset_id,
          session_id: request.session_id,
          user_id: request.user_id,
          quote: request.quote ?? true,
          stream: request.stream ?? false
        }),
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`Chat request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      
      // Validate response structure
      if (!result.success && !result.answer) {
        throw new Error(`Invalid response format: ${JSON.stringify(result)}`)
      }
      
      return result
    }, 'Chat request')
  }

  /**
   * 獲取活躍會話列表
   */
  async getSessions(): Promise<SessionInfo[]> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(this.timeout)
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * 刪除會話
   */
  async deleteSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(this.timeout)
    })

    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * 清理過期會話
   */
  async cleanupSessions(maxAgeHours: number = 24): Promise<{ success: boolean; message: string; cleaned_count: number }> {
    const response = await fetch(`${this.baseUrl}/sessions/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ max_age_hours: maxAgeHours }),
      signal: AbortSignal.timeout(this.timeout)
    })

    if (!response.ok) {
      throw new Error(`Failed to cleanup sessions: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}