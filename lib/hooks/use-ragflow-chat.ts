/**
 * RAGFlow 聊天 Hook
 * 處理知識庫聊天的狀態管理和 API 調用
 */

import { SearchStrategy } from '@/lib/types/ragflow'
import { useCallback, useState } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    dataset_name?: string
    confidence?: number
    sources?: any[]
    search_mode?: string
  }
}

interface ChatConfig {
  datasetId?: string
  datasetName?: string
  searchStrategy: SearchStrategy
}

interface UseRAGFlowChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string, config: ChatConfig) => Promise<void>
  clearMessages: () => void
  clearError: () => void
}

export function useRAGFlowChat(): UseRAGFlowChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string, config: ChatConfig) => {
    if (!content.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    // 添加用戶消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    try {
      // 構建請求體
      const requestBody = {
        messages: [
          { role: 'user', content: content.trim() }
        ],
        datasetId: config.datasetId,
        searchMode: config.searchStrategy
        // 不提供 sessionId，讓後端自動創建新會話
      }

      // 發送請求到 RAGFlow API
      const response = await fetch('/api/chat/ragflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '請求失敗')
      }

      if (!data.success) {
        throw new Error(data.error || '知識庫搜索失敗')
      }

      // 添加助手回應
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        metadata: {
          dataset_name: data.dataset_name,
          confidence: data.confidence,
          sources: data.sources,
          search_mode: data.search_mode
        }
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤'
      setError(errorMessage)
      
      // 根據錯誤類型提供不同的提示
      let userFriendlyMessage = `抱歉，搜索過程中發生錯誤：${errorMessage}`
      
      if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
        userFriendlyMessage = '搜索超時，請嘗試簡化問題或稍後再試。複雜的法律問題可能需要更長的處理時間。'
      } else if (errorMessage.includes('404')) {
        userFriendlyMessage = '知識庫服務暫時不可用，請稍後再試。'
      } else if (errorMessage.includes('500')) {
        userFriendlyMessage = '服務器處理出現問題，請稍後再試。'
      }
      
      // 添加錯誤消息
      const errorResponse: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: userFriendlyMessage,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError
  }
}

export default useRAGFlowChat