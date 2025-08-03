/**
 * RAGFlow Agent
 * 處理知識庫搜索和對話邏輯
 */

import { RAGFlowClient } from '@/lib/clients/ragflow-client'
import {
    ChatOptions,
    KnowledgeSearchResult,
    RAGFlowChatRequest,
    RAGFlowDataset
} from '@/lib/types/ragflow'

export class RAGFlowAgent {
  private client: RAGFlowClient
  private defaultDatasetId?: string

  constructor(baseUrl?: string) {
    this.client = new RAGFlowClient(baseUrl)
  }

  /**
   * 設置默認數據集
   */
  setDefaultDataset(datasetId: string) {
    this.defaultDatasetId = datasetId
  }

  /**
   * 獲取可用的數據集
   */
  async getAvailableDatasets(): Promise<RAGFlowDataset[]> {
    try {
      return await this.client.getDatasets()
    } catch (error) {
      console.error('Failed to fetch datasets:', error)
      throw new Error('無法獲取知識庫列表')
    }
  }

  /**
   * 智能選擇數據集
   * 基於問題內容選擇最合適的數據集
   */
  async selectDataset(question: string, availableDatasets?: RAGFlowDataset[]): Promise<string> {
    // 如果指定了默認數據集，直接使用
    if (this.defaultDatasetId) {
      return this.defaultDatasetId
    }

    // 獲取可用數據集
    const datasets = availableDatasets || await this.getAvailableDatasets()
    
    if (datasets.length === 0) {
      throw new Error('沒有可用的知識庫')
    }

    // 簡單的關鍵詞匹配邏輯
    const question_lower = question.toLowerCase()
    
    // 法律相關關鍵詞匹配
    if (question_lower.includes('憲法') || question_lower.includes('行政法')) {
      const constitutionalDataset = datasets.find(d => d.name.includes('憲法') || d.name.includes('行政法'))
      if (constitutionalDataset) return constitutionalDataset.id
    }
    
    if (question_lower.includes('民法') || question_lower.includes('民事')) {
      const civilDataset = datasets.find(d => d.name.includes('民法') || d.name.includes('民事'))
      if (civilDataset) return civilDataset.id
    }

    // 默認使用第一個數據集
    return datasets[0].id
  }

  /**
   * 執行知識庫搜索
   */
  async search(question: string, options: Partial<ChatOptions> = {}): Promise<KnowledgeSearchResult> {
    try {
      // 選擇數據集
      const datasetId = options.datasetId || await this.selectDataset(question)
      
      // 構建請求
      const request: RAGFlowChatRequest = {
        question,
        dataset_id: datasetId,
        session_id: options.sessionId,
        user_id: options.userId,
        quote: options.quote ?? true,
        stream: options.stream ?? false
      }

      // 發送請求
      const response = await this.client.chat(request)

      if (!response.success) {
        throw new Error(response.message || '知識庫搜索失敗')
      }

      // 獲取數據集名稱
      const datasets = await this.getAvailableDatasets()
      const dataset = datasets.find(d => d.id === datasetId)
      const datasetName = dataset?.name || 'Unknown'

      return {
        answer: response.answer,
        sources: response.sources,
        session_id: response.session_id,
        dataset_name: datasetName,
        confidence: this.calculateConfidence(response.sources)
      }

    } catch (error) {
      console.error('RAGFlow search failed:', error)
      throw error
    }
  }

  /**
   * 多輪對話
   */
  async chat(messages: Array<{ role: string; content: string }>, options: Partial<ChatOptions> = {}): Promise<KnowledgeSearchResult> {
    // 提取最新的用戶消息
    const lastMessage = messages.filter(m => m.role === 'user').pop()
    
    if (!lastMessage) {
      throw new Error('沒有找到用戶消息')
    }

    return this.search(lastMessage.content, options)
  }

  /**
   * 計算回答的置信度
   */
  private calculateConfidence(sources: any[]): number {
    if (!sources || sources.length === 0) {
      return 0.1 // 沒有來源，置信度很低
    }

    // 基於來源數量和相似度計算置信度
    const sourceCount = sources.length
    const avgSimilarity = sources.reduce((sum, source) => {
      return sum + (source.similarity || 0.5)
    }, 0) / sourceCount

    // 簡單的置信度計算公式
    const confidence = Math.min(0.9, (sourceCount * 0.1) + (avgSimilarity * 0.6))
    
    return Math.max(0.1, confidence)
  }

  /**
   * 格式化知識庫回答
   */
  formatAnswer(result: KnowledgeSearchResult): string {
    let formatted = result.answer

    // 添加來源信息
    if (result.sources && result.sources.length > 0) {
      formatted += '\n\n**參考來源：**\n'
      result.sources.slice(0, 3).forEach((source, index) => {
        const docName = source.doc_name || '未知文檔'
        formatted += `${index + 1}. ${docName}\n`
      })
    }

    // 添加數據集信息
    formatted += `\n*來源知識庫：${result.dataset_name}*`

    return formatted
  }

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.healthCheck()
      return true
    } catch (error) {
      console.error('RAGFlow health check failed:', error)
      return false
    }
  }
}