/**
 * 混合搜索 Hook
 * 處理 Tavily + RAGFlow 混合搜索的狀態管理和 API 調用
 */

import { HybridSearchConfig } from '@/components/hybrid-search-config'
import { useCallback, useState } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    web_results?: any[]
    knowledge_results?: any
    sources?: any[]
    modes_used?: string[]
    confidence?: number
    search_mode?: string
  }
}

interface UseHybridSearchReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  config: HybridSearchConfig
  sendMessage: (content: string) => Promise<void>
  updateConfig: (newConfig: HybridSearchConfig) => void
  clearMessages: () => void
  clearError: () => void
  healthCheck: () => Promise<{ ragflow: boolean; tavily: boolean }>
}

const defaultConfig: HybridSearchConfig = {
  searchMode: 'intelligent',
  webSearchDepth: 'advanced',
  webMaxResults: 10,
  includeDomains: [],
  excludeDomains: [],
  prioritizeKnowledge: true,
  combineResults: true
}

export function useHybridSearch(): UseHybridSearchReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<HybridSearchConfig>(defaultConfig)

  const sendMessage = useCallback(async (content: string) => {
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
        sessionId: `session-${Date.now()}`,
        searchMode: config.searchMode,
        webSearchDepth: config.webSearchDepth,
        webMaxResults: config.webMaxResults,
        includeDomains: config.includeDomains,
        excludeDomains: config.excludeDomains,
        prioritizeKnowledge: config.prioritizeKnowledge,
        combineResults: config.combineResults
      }

      console.log('發送混合搜索請求:', requestBody)

      // 發送請求到混合搜索 API
      const response = await fetch('/api/chat/hybrid', {
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
        throw new Error(data.error || '混合搜索失敗')
      }

      // 添加助手回應
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        metadata: {
          web_results: data.web_results,
          knowledge_results: data.knowledge_results,
          sources: data.sources,
          modes_used: data.modes_used,
          confidence: data.confidence,
          search_mode: data.search_mode
        }
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤'
      setError(errorMessage)
      
      // 添加錯誤消息
      const errorResponse: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `抱歉，搜索過程中發生錯誤：${errorMessage}`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, config])

  const updateConfig = useCallback((newConfig: HybridSearchConfig) => {
    setConfig(newConfig)
    console.log('更新混合搜索配置:', newConfig)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const healthCheck = useCallback(async (): Promise<{ ragflow: boolean; tavily: boolean }> => {
    try {
      const response = await fetch('/api/chat/hybrid', {
        method: 'GET'
      })
      
      const data = await response.json()
      
      if (data.success && data.health) {
        return data.health
      }
      
      return { ragflow: false, tavily: false }
    } catch (error) {
      console.error('健康檢查失敗:', error)
      return { ragflow: false, tavily: false }
    }
  }, [])

  return {
    messages,
    isLoading,
    error,
    config,
    sendMessage,
    updateConfig,
    clearMessages,
    clearError,
    healthCheck
  }
}

export default useHybridSearch