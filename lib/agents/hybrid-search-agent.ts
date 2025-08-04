/**
 * 混合搜索代理
 * 整合 Tavily 深度搜尋和 RAGFlow 知識庫搜索
 */

import { search } from '@/lib/tools/search'
import { SearchResults } from '@/lib/types'
import {
    ChatOptions,
    HybridSearchResult,
    KnowledgeSearchResult
} from '@/lib/types/ragflow'
import { RAGFlowAgent } from './ragflow-agent'

export interface HybridSearchOptions extends Partial<ChatOptions> {
  webSearchDepth?: 'basic' | 'advanced'
  webMaxResults?: number
  includeDomains?: string[]
  excludeDomains?: string[]
  prioritizeKnowledge?: boolean
  combineResults?: boolean
}

export class HybridSearchAgent {
  private ragflowAgent: RAGFlowAgent
  
  constructor(ragflowBaseUrl?: string) {
    this.ragflowAgent = new RAGFlowAgent(ragflowBaseUrl)
  }

  /**
   * 執行混合搜索
   * 同時進行網路搜索和知識庫搜索
   */
  async hybridSearch(
    query: string, 
    options: HybridSearchOptions = {}
  ): Promise<HybridSearchResult> {
    const {
      webSearchDepth = 'advanced',
      webMaxResults = 10,
      includeDomains = [],
      excludeDomains = [],
      prioritizeKnowledge = true,
      combineResults = true,
      ...ragflowOptions
    } = options

    console.log(`執行混合搜索: "${query}"`)

    // 並行執行網路搜索和知識庫搜索
    const [webResults, knowledgeResults] = await Promise.allSettled([
      this.performWebSearch(query, {
        searchDepth: webSearchDepth,
        maxResults: webMaxResults,
        includeDomains,
        excludeDomains
      }),
      this.performKnowledgeSearch(query, ragflowOptions)
    ])

    // 處理搜索結果
    const webSearchData = webResults.status === 'fulfilled' ? webResults.value : null
    const knowledgeSearchData = knowledgeResults.status === 'fulfilled' ? knowledgeResults.value : null

    // 記錄搜索結果
    console.log('網路搜索結果:', webSearchData ? `${webSearchData.results.length} 個結果` : '失敗')
    console.log('知識庫搜索結果:', knowledgeSearchData ? '成功' : '失敗')

    // 根據選項決定如何組合結果
    if (combineResults && webSearchData && knowledgeSearchData) {
      return this.combineSearchResults(query, webSearchData, knowledgeSearchData, prioritizeKnowledge)
    }

    // 如果不組合結果，返回分別的結果
    return {
      web_results: webSearchData?.results || [],
      knowledge_results: knowledgeSearchData || undefined,
      combined_answer: undefined,
      sources: this.mergeSources(webSearchData, knowledgeSearchData),
      mode_used: this.getModesUsed(webSearchData, knowledgeSearchData)
    }
  }

  /**
   * 智能搜索策略
   * 根據問題類型決定搜索策略
   */
  async intelligentSearch(
    query: string,
    options: HybridSearchOptions = {}
  ): Promise<HybridSearchResult> {
    console.log(`🧠 開始智能搜索分析: "${query}"`)
    
    // 分析問題複雜度
    const complexityAnalysis = this.analyzeQueryComplexity(query)
    console.log(`📊 問題複雜度: ${complexityAnalysis.complexity}`)
    console.log(`📋 複雜度因素: ${complexityAnalysis.factors.join(', ')}`)
    
    // 決定搜索策略
    const searchStrategy = this.determineSearchStrategy(query)
    console.log(`🎯 選定策略: ${searchStrategy}`)

    // 根據複雜度調整搜索參數
    const adjustedOptions = this.adjustOptionsForComplexity(options, complexityAnalysis.complexity)

    switch (searchStrategy) {
      case 'knowledge-first':
        return this.knowledgeFirstSearch(query, adjustedOptions)
      
      case 'web-first':
        return this.webFirstSearch(query, adjustedOptions)
      
      case 'hybrid':
      default:
        return this.hybridSearch(query, adjustedOptions)
    }
  }

  /**
   * 根據問題複雜度調整搜索選項
   */
  private adjustOptionsForComplexity(
    options: HybridSearchOptions,
    complexity: 'simple' | 'medium' | 'complex'
  ): HybridSearchOptions {
    const adjusted = { ...options }

    switch (complexity) {
      case 'complex':
        // 複雜問題需要更多結果和更深度的搜索
        adjusted.webMaxResults = Math.max(adjusted.webMaxResults || 10, 15)
        adjusted.webSearchDepth = 'advanced'
        adjusted.combineResults = true
        console.log('🔍 複雜問題 - 增加搜索深度和結果數量')
        break
        
      case 'medium':
        // 中等複雜度使用標準設置
        adjusted.webMaxResults = adjusted.webMaxResults || 10
        adjusted.webSearchDepth = adjusted.webSearchDepth || 'advanced'
        console.log('⚖️ 中等複雜度 - 使用標準搜索設置')
        break
        
      case 'simple':
        // 簡單問題可以使用較少的結果
        adjusted.webMaxResults = Math.min(adjusted.webMaxResults || 10, 8)
        adjusted.webSearchDepth = adjusted.webSearchDepth || 'basic'
        console.log('⚡ 簡單問題 - 使用基礎搜索設置')
        break
    }

    return adjusted
  }

  /**
   * 知識庫優先搜索
   */
  private async knowledgeFirstSearch(
    query: string,
    options: HybridSearchOptions
  ): Promise<HybridSearchResult> {
    try {
      // 先搜索知識庫
      const knowledgeResult = await this.performKnowledgeSearch(query, options)
      
      // 如果知識庫結果置信度高，直接返回
      if (knowledgeResult && (knowledgeResult.confidence || 0) > 0.7) {
        console.log('知識庫結果置信度高，直接使用')
        return {
          knowledge_results: knowledgeResult,
          sources: knowledgeResult.sources,
          mode_used: ['knowledge']
        }
      }

      // 否則補充網路搜索
      console.log('知識庫結果置信度較低，補充網路搜索')
      const webResult = await this.performWebSearch(query, {
        searchDepth: options.webSearchDepth || 'basic',
        maxResults: options.webMaxResults || 5
      })

      return this.combineSearchResults(query, webResult, knowledgeResult, true)

    } catch (error) {
      console.error('知識庫優先搜索失敗，回退到網路搜索:', error)
      return this.webFirstSearch(query, options)
    }
  }

  /**
   * 網路優先搜索
   */
  private async webFirstSearch(
    query: string,
    options: HybridSearchOptions
  ): Promise<HybridSearchResult> {
    try {
      // 先進行網路搜索
      const webResult = await this.performWebSearch(query, {
        searchDepth: options.webSearchDepth || 'advanced',
        maxResults: options.webMaxResults || 10,
        includeDomains: options.includeDomains,
        excludeDomains: options.excludeDomains
      })

      // 嘗試補充知識庫搜索
      let knowledgeResult: KnowledgeSearchResult | null = null
      try {
        knowledgeResult = await this.performKnowledgeSearch(query, options)
      } catch (error) {
        console.warn('知識庫搜索失敗:', error)
      }

      return this.combineSearchResults(query, webResult, knowledgeResult, false)

    } catch (error) {
      console.error('網路搜索失敗:', error)
      throw new Error('所有搜索方式都失敗了')
    }
  }

  /**
   * 執行網路搜索
   */
  private async performWebSearch(
    query: string,
    options: {
      searchDepth?: 'basic' | 'advanced'
      maxResults?: number
      includeDomains?: string[]
      excludeDomains?: string[]
    }
  ): Promise<SearchResults> {
    const {
      searchDepth = 'advanced',
      maxResults = 10,
      includeDomains = [],
      excludeDomains = []
    } = options

    console.log(`執行 Tavily 網路搜索: 深度=${searchDepth}, 最大結果=${maxResults}`)

    return search(
      query,
      maxResults,
      searchDepth,
      includeDomains,
      excludeDomains
    )
  }

  /**
   * 執行知識庫搜索
   */
  private async performKnowledgeSearch(
    query: string,
    options: Partial<ChatOptions>
  ): Promise<KnowledgeSearchResult> {
    console.log('執行 RAGFlow 知識庫搜索')
    
    // 根據搜索策略選擇方法
    const strategy = options.searchStrategy || 'intelligent'
    
    switch (strategy) {
      case 'multi':
        return this.ragflowAgent.multiDatasetSearch(query, options)
      case 'intelligent':
      case 'single':
      default:
        return this.ragflowAgent.search(query, options)
    }
  }

  /**
   * 組合搜索結果
   */
  private combineSearchResults(
    query: string,
    webResults: SearchResults | null,
    knowledgeResults: KnowledgeSearchResult | null,
    prioritizeKnowledge: boolean
  ): HybridSearchResult {
    let combinedAnswer = ''
    const sources = this.mergeSources(webResults, knowledgeResults)
    const modesUsed = this.getModesUsed(webResults, knowledgeResults)

    // 生成組合答案
    if (prioritizeKnowledge && knowledgeResults?.answer) {
      combinedAnswer = knowledgeResults.answer
      
      // 如果有網路搜索結果，添加補充信息
      if (webResults?.results && webResults.results.length > 0) {
        const webSummary = this.generateWebResultsSummary(webResults.results.slice(0, 3))
        if (webSummary) {
          combinedAnswer += `\n\n**最新網路資訊補充：**\n${webSummary}`
        }
      }
    } else if (webResults?.results && webResults.results.length > 0) {
      // 以網路搜索為主
      combinedAnswer = this.generateWebResultsSummary(webResults.results.slice(0, 5))
      
      // 如果有知識庫結果，添加專業見解
      if (knowledgeResults?.answer) {
        combinedAnswer += `\n\n**專業知識庫見解：**\n${knowledgeResults.answer}`
      }
    }

    return {
      web_results: webResults?.results || [],
      knowledge_results: knowledgeResults || undefined,
      combined_answer: combinedAnswer,
      sources,
      mode_used: modesUsed
    }
  }

  /**
   * 決定搜索策略
   */
  private determineSearchStrategy(query: string): 'knowledge-first' | 'web-first' | 'hybrid' {
    const queryLower = query.toLowerCase()
    const analysisLog: string[] = []

    // 法律專業問題 - 知識庫優先
    const legalKeywords = [
      '法律', '法規', '條文', '判決', '憲法', '民法', '刑法', '商法', '行政法',
      '契約', '侵權', '物權', '債權', '犯罪', '起訴', '法院', '律師', '法官',
      '檢察官', '公司法', '勞動法', '智慧財產權', '著作權', '專利'
    ]
    
    const foundLegalKeywords = legalKeywords.filter(keyword => queryLower.includes(keyword))
    if (foundLegalKeywords.length > 0) {
      analysisLog.push(`檢測到法律專業關鍵詞: ${foundLegalKeywords.join(', ')}`)
      analysisLog.push('選擇知識庫優先策略 - 法律問題需要權威準確的專業知識')
      console.log('🏛️ 策略分析:', analysisLog.join(' | '))
      return 'knowledge-first'
    }

    // 時事、新聞、最新資訊 - 網路優先
    const currentKeywords = [
      '最新', '今天', '現在', '新聞', '時事', '2024', '2025', '近期', '最近',
      '剛剛', '發生', '公布', '宣布', '更新', '即時', '當前', '目前'
    ]
    
    const foundCurrentKeywords = currentKeywords.filter(keyword => queryLower.includes(keyword))
    if (foundCurrentKeywords.length > 0) {
      analysisLog.push(`檢測到時事相關關鍵詞: ${foundCurrentKeywords.join(', ')}`)
      analysisLog.push('選擇網路優先策略 - 時事問題需要最新的網路資訊')
      console.log('📰 策略分析:', analysisLog.join(' | '))
      return 'web-first'
    }

    // 技術專業問題 - 可能需要混合搜索
    const techKeywords = [
      'AI', '人工智能', '機器學習', '深度學習', '區塊鏈', '加密貨幣',
      '程式設計', '軟體開發', '資料科學', '雲端運算', '物聯網'
    ]
    
    const foundTechKeywords = techKeywords.filter(keyword => queryLower.includes(keyword))
    if (foundTechKeywords.length > 0) {
      analysisLog.push(`檢測到技術相關關鍵詞: ${foundTechKeywords.join(', ')}`)
      analysisLog.push('選擇混合搜索策略 - 技術問題需要多角度資訊')
      console.log('💻 策略分析:', analysisLog.join(' | '))
      return 'hybrid'
    }

    // 醫療健康問題 - 知識庫優先（需要專業可靠資訊）
    const medicalKeywords = [
      '醫療', '健康', '疾病', '症狀', '治療', '藥物', '診斷', '醫生',
      '醫院', '手術', '康復', '預防', '疫苗', '病毒', '細菌'
    ]
    
    const foundMedicalKeywords = medicalKeywords.filter(keyword => queryLower.includes(keyword))
    if (foundMedicalKeywords.length > 0) {
      analysisLog.push(`檢測到醫療相關關鍵詞: ${foundMedicalKeywords.join(', ')}`)
      analysisLog.push('選擇知識庫優先策略 - 醫療問題需要專業可靠的資訊')
      console.log('🏥 策略分析:', analysisLog.join(' | '))
      return 'knowledge-first'
    }

    // 金融投資問題 - 網路優先（市場資訊變化快）
    const financeKeywords = [
      '股票', '投資', '基金', '保險', '銀行', '貸款', '利率', '匯率',
      '債券', '期貨', '選擇權', '加密貨幣', '比特幣', '以太幣'
    ]
    
    const foundFinanceKeywords = financeKeywords.filter(keyword => queryLower.includes(keyword))
    if (foundFinanceKeywords.length > 0) {
      analysisLog.push(`檢測到金融相關關鍵詞: ${foundFinanceKeywords.join(', ')}`)
      analysisLog.push('選擇網路優先策略 - 金融資訊需要即時更新')
      console.log('💰 策略分析:', analysisLog.join(' | '))
      return 'web-first'
    }

    // 其他情況使用混合搜索
    analysisLog.push('沒有檢測到特定領域關鍵詞')
    analysisLog.push('選擇混合搜索策略 - 提供全面的資訊覆蓋')
    console.log('🔄 策略分析:', analysisLog.join(' | '))
    return 'hybrid'
  }

  /**
   * 分析問題複雜度
   */
  private analyzeQueryComplexity(query: string): {
    complexity: 'simple' | 'medium' | 'complex'
    factors: string[]
  } {
    const factors: string[] = []
    let complexityScore = 0

    // 問題長度
    if (query.length > 100) {
      complexityScore += 2
      factors.push('問題較長，可能包含多個子問題')
    } else if (query.length > 50) {
      complexityScore += 1
      factors.push('問題長度適中')
    }

    // 問號數量（多個問題）
    const questionMarks = (query.match(/？|\?/g) || []).length
    if (questionMarks > 1) {
      complexityScore += 2
      factors.push(`包含 ${questionMarks} 個問題`)
    }

    // 連接詞（表示複合問題）
    const conjunctions = ['和', '與', '以及', '還有', '另外', '同時', '並且']
    const foundConjunctions = conjunctions.filter(conj => query.includes(conj))
    if (foundConjunctions.length > 0) {
      complexityScore += 1
      factors.push('包含連接詞，可能是複合問題')
    }

    // 專業術語密度
    const professionalTerms = ['分析', '比較', '評估', '探討', '研究', '調查']
    const foundTerms = professionalTerms.filter(term => query.includes(term))
    if (foundTerms.length > 0) {
      complexityScore += 1
      factors.push('包含分析性詞彙')
    }

    let complexity: 'simple' | 'medium' | 'complex'
    if (complexityScore >= 4) {
      complexity = 'complex'
    } else if (complexityScore >= 2) {
      complexity = 'medium'
    } else {
      complexity = 'simple'
    }

    return { complexity, factors }
  }

  /**
   * 合併來源信息
   */
  private mergeSources(
    webResults: SearchResults | null,
    knowledgeResults: KnowledgeSearchResult | null
  ): Array<any> {
    const sources: Array<any> = []

    // 添加知識庫來源
    if (knowledgeResults?.sources) {
      sources.push(...knowledgeResults.sources.map(source => ({
        ...source,
        type: 'knowledge',
        dataset_name: knowledgeResults.dataset_name
      })))
    }

    // 添加網路搜索來源
    if (webResults?.results) {
      sources.push(...webResults.results.slice(0, 5).map(result => ({
        title: result.title,
        url: result.url,
        content: result.content,
        type: 'web',
        published_date: result.published_date
      })))
    }

    return sources
  }

  /**
   * 獲取使用的搜索模式
   */
  private getModesUsed(
    webResults: SearchResults | null,
    knowledgeResults: KnowledgeSearchResult | null
  ): Array<'web' | 'knowledge'> {
    const modes: Array<'web' | 'knowledge'> = []
    
    if (webResults?.results && webResults.results.length > 0) {
      modes.push('web')
    }
    
    if (knowledgeResults) {
      modes.push('knowledge')
    }
    
    return modes
  }

  /**
   * 生成網路搜索結果摘要
   */
  private generateWebResultsSummary(results: any[]): string {
    if (!results || results.length === 0) return ''

    const summaries = results.map((result, index) => {
      const title = result.title || '未知標題'
      const content = result.content ? result.content.substring(0, 200) + '...' : '無內容摘要'
      const url = result.url || ''
      
      return `${index + 1}. **${title}**\n   ${content}\n   來源: ${url}`
    })

    return summaries.join('\n\n')
  }

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<{ ragflow: boolean; tavily: boolean }> {
    const [ragflowHealth, tavilyHealth] = await Promise.allSettled([
      this.ragflowAgent.healthCheck(),
      this.checkTavilyHealth()
    ])

    return {
      ragflow: ragflowHealth.status === 'fulfilled' ? ragflowHealth.value : false,
      tavily: tavilyHealth.status === 'fulfilled' ? tavilyHealth.value : false
    }
  }

  /**
   * 檢查 Tavily 健康狀態
   */
  private async checkTavilyHealth(): Promise<boolean> {
    try {
      const testResult = await search('test', 1, 'basic')
      return testResult.results !== undefined
    } catch (error) {
      console.error('Tavily health check failed:', error)
      return false
    }
  }
}