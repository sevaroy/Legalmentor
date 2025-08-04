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
    // Use environment variables for configuration
    const proxyUrl = process.env.RAGFLOW_PROXY_URL || baseUrl
    this.client = new RAGFlowClient(proxyUrl)
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

    return this.intelligentDatasetSelection(question, datasets)
  }

  /**
   * 智能數據集選擇邏輯
   */
  private intelligentDatasetSelection(question: string, datasets: RAGFlowDataset[]): string {
    const question_lower = question.toLowerCase()
    
    // 定義關鍵詞映射規則
    const keywordRules = [
      {
        keywords: ['憲法', '行政法', '行政', '公法', '政府', '行政機關'],
        datasetPatterns: ['憲法', '行政法', '公法', 'constitutional', 'administrative']
      },
      {
        keywords: ['民法', '民事', '契約', '侵權', '物權', '債權'],
        datasetPatterns: ['民法', '民事', 'civil', 'contract']
      },
      {
        keywords: ['刑法', '刑事', '犯罪', '刑罰', '起訴'],
        datasetPatterns: ['刑法', '刑事', 'criminal', 'penal']
      },
      {
        keywords: ['商法', '公司法', '商業', '企業', '股份'],
        datasetPatterns: ['商法', '公司法', 'commercial', 'corporate', 'business']
      }
    ]

    // 計算每個數據集的匹配分數
    const scores = datasets.map(dataset => {
      let score = 0
      const datasetName = dataset.name.toLowerCase()
      const datasetDesc = (dataset.description || '').toLowerCase()
      
      for (const rule of keywordRules) {
        // 檢查問題中是否包含關鍵詞
        const questionMatches = rule.keywords.some(keyword => 
          question_lower.includes(keyword)
        )
        
        if (questionMatches) {
          // 檢查數據集名稱或描述是否匹配
          const datasetMatches = rule.datasetPatterns.some(pattern =>
            datasetName.includes(pattern) || datasetDesc.includes(pattern)
          )
          
          if (datasetMatches) {
            score += 10 // 高權重匹配
          }
        }
      }
      
      return { dataset, score }
    })

    // 選擇分數最高的數據集
    const bestMatch = scores.reduce((best, current) => 
      current.score > best.score ? current : best
    )

    // 如果沒有明確匹配，選擇文檔數量最多的數據集
    if (bestMatch.score === 0) {
      const largestDataset = datasets.reduce((largest, current) =>
        current.document_count > largest.document_count ? current : largest
      )
      return largestDataset.id
    }

    return bestMatch.dataset.id
  }

  /**
   * 多知識庫搜索
   * 同時搜索多個相關知識庫並合併結果
   */
  async multiDatasetSearch(question: string, options: Partial<ChatOptions> = {}): Promise<KnowledgeSearchResult> {
    const datasets = await this.getAvailableDatasets()
    
    if (datasets.length === 0) {
      throw new Error('沒有可用的知識庫')
    }

    // 選擇相關的數據集（最多3個）
    const relevantDatasets = this.selectRelevantDatasets(question, datasets).slice(0, 3)
    
    // 並行搜索多個數據集
    const searchPromises = relevantDatasets.map(async (dataset) => {
      try {
        const result = await this.search(question, {
          ...options,
          datasetId: dataset.id
        })
        return { dataset, result, success: true }
      } catch (error) {
        console.warn(`搜索數據集 ${dataset.name} 失敗:`, error)
        return { dataset, result: null, success: false }
      }
    })

    const searchResults = await Promise.all(searchPromises)
    const successfulResults = searchResults.filter(r => r.success && r.result)

    if (successfulResults.length === 0) {
      throw new Error('所有知識庫搜索都失敗了')
    }

    // 合併結果
    return this.mergeSearchResults(successfulResults.map(r => r.result!), question)
  }

  /**
   * 選擇相關的數據集
   */
  private selectRelevantDatasets(question: string, datasets: RAGFlowDataset[]): RAGFlowDataset[] {
    const question_lower = question.toLowerCase()
    
    // 為每個數據集計算相關性分數
    const scoredDatasets = datasets.map(dataset => {
      let relevanceScore = 0
      const name = dataset.name.toLowerCase()
      const desc = (dataset.description || '').toLowerCase()
      
      // 基於關鍵詞匹配計算分數
      const keywords = ['法', '法律', '規定', '條文', '法規', '判決']
      keywords.forEach(keyword => {
        if (question_lower.includes(keyword)) {
          if (name.includes(keyword) || desc.includes(keyword)) {
            relevanceScore += 2
          }
        }
      })
      
      // 基於文檔數量給予額外分數（更多文檔可能包含更多信息）
      relevanceScore += Math.min(dataset.document_count / 100, 3)
      
      return { dataset, score: relevanceScore }
    })

    // 按分數排序並返回
    return scoredDatasets
      .sort((a, b) => b.score - a.score)
      .map(item => item.dataset)
  }

  /**
   * 合併多個搜索結果
   */
  private mergeSearchResults(results: KnowledgeSearchResult[], question: string): KnowledgeSearchResult {
    // 選擇置信度最高的結果作為主要答案
    const bestResult = results.reduce((best, current) => 
      (current.confidence || 0) > (best.confidence || 0) ? current : best
    )

    // 合併所有來源
    const allSources = results.flatMap(r => r.sources)
    
    // 去重並按相似度排序
    const uniqueSources = allSources
      .filter((source, index, arr) => 
        arr.findIndex(s => s.doc_name === source.doc_name && s.content === source.content) === index
      )
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, 5) // 最多保留5個來源

    // 合併數據集名稱
    const datasetNames = [...new Set(results.map(r => r.dataset_name))].join(', ')

    return {
      answer: bestResult.answer,
      sources: uniqueSources,
      session_id: bestResult.session_id,
      dataset_name: datasetNames,
      confidence: this.calculateCombinedConfidence(results)
    }
  }

  /**
   * 計算合併結果的置信度
   */
  private calculateCombinedConfidence(results: KnowledgeSearchResult[]): number {
    if (results.length === 0) return 0

    const avgConfidence = results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length
    const bonusForMultipleSources = Math.min(results.length * 0.1, 0.2)
    
    return Math.min(0.95, avgConfidence + bonusForMultipleSources)
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
        user_id: options.userId,
        quote: options.quote ?? true,
        stream: options.stream ?? false
      }

      // 只有當 sessionId 存在且不是臨時生成的時候才傳遞
      if (options.sessionId && !options.sessionId.startsWith('session-')) {
        request.session_id = options.sessionId
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