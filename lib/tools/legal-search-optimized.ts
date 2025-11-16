import { tool } from 'ai'
import { z } from 'zod'

import { SearchResults } from '@/lib/types'

import { createSearchProvider } from './search/providers'

/**
 * 優化版台灣法律專用深度搜索工具
 * 整合多層搜索策略、智能關鍵字優化、結果評分排序
 */

/**
 * 台灣法律相關網域清單（按優先級排序）
 */
const TAIWAN_LEGAL_DOMAINS = {
  // 第一級：政府官方資源（最高優先）
  tier1: [
    'judicial.gov.tw', // 司法院
    'judgment.judicial.gov.tw', // 判決書查詢
    'jirs.judicial.gov.tw', // 法學資料檢索
    'law.moj.gov.tw', // 全國法規資料庫
    'mojlaw.moj.gov.tw' // 法務部法規
  ],
  // 第二級：專業法律平台
  tier2: [
    'lawbank.com.tw', // 法源法律網
    'lawtw.com', // 植根法律網
    '6law.idv.tw', // 六法全書
    'lawtw.com' // 台灣法律網
  ],
  // 第三級：學術機構
  tier3: [
    'ntu.edu.tw', // 台大
    'nccur.lib.nccu.edu.tw', // 政大
    'lawdata.com.tw' // 法律資料庫
  ],
  // 第四級：律師公會和專業組織
  tier4: [
    'twba.org.tw', // 台北律師公會
    'tcba.org.tw', // 台中律師公會
    'tba.org.tw' // 台灣律師公會
  ]
}

/**
 * 所有台灣法律網域（扁平化）
 */
const ALL_LEGAL_DOMAINS = [
  ...TAIWAN_LEGAL_DOMAINS.tier1,
  ...TAIWAN_LEGAL_DOMAINS.tier2,
  ...TAIWAN_LEGAL_DOMAINS.tier3,
  ...TAIWAN_LEGAL_DOMAINS.tier4
]

/**
 * 法律領域關鍵字映射
 */
const LEGAL_CONTEXT_KEYWORDS = {
  民事法: ['民法', '契約', '侵權', '債務', '物權', '親屬', '繼承'],
  刑事法: ['刑法', '犯罪', '刑責', '緩刑', '假釋', '保護管束'],
  行政法: ['行政程序', '訴願', '行政訴訟', '行政處分', '公法'],
  勞動法: ['勞基法', '勞工', '雇主', '資遣', '解僱', '工資', '加班'],
  商事法: ['公司法', '證券', '票據', '保險', '海商'],
  智財法: ['專利', '商標', '著作權', '營業秘密'],
  家事法: ['離婚', '監護', '扶養', '收養', '家暴'],
  消費者保護: ['消保法', '退貨', '瑕疵', '定型化契約']
}

/**
 * 判決書相關關鍵字
 */
const JUDGMENT_KEYWORDS = [
  '判決', '判例', '裁定', '裁判', '案例', '判字', '訴字', '上訴', '更審'
]

/**
 * 進階關鍵字增強
 * 根據查詢內容和法律領域進行智能優化
 */
function enhancedQueryOptimization(
  query: string,
  legalContext?: string
): {
  enhancedQuery: string
  searchStrategy: 'judgment-focused' | 'law-focused' | 'general'
  suggestedDomains: string[]
} {
  let enhancedQuery = query
  let searchStrategy: 'judgment-focused' | 'law-focused' | 'general' = 'general'
  let suggestedDomains = ALL_LEGAL_DOMAINS

  // 檢查是否已包含地區關鍵字
  const hasLocationContext = /台灣|中華民國|我國|本國/.test(query)

  // 檢查是否包含判決書相關關鍵字
  const hasJudgmentKeyword = JUDGMENT_KEYWORDS.some(kw => query.includes(kw))

  // 策略 1: 判決書重點搜索
  if (hasJudgmentKeyword) {
    searchStrategy = 'judgment-focused'
    suggestedDomains = [...TAIWAN_LEGAL_DOMAINS.tier1] // 優先司法院

    if (!hasLocationContext) {
      enhancedQuery = `台灣 ${query} 司法院`
    } else {
      enhancedQuery = `${query} 司法院`
    }
  }
  // 策略 2: 法規重點搜索
  else if (/第\s*\d+\s*條|法規|法律|條文/.test(query)) {
    searchStrategy = 'law-focused'
    suggestedDomains = [
      'law.moj.gov.tw',
      'mojlaw.moj.gov.tw',
      ...TAIWAN_LEGAL_DOMAINS.tier2
    ]

    if (!hasLocationContext) {
      enhancedQuery = `台灣法律 ${query}`
    }
  }
  // 策略 3: 一般法律問題
  else {
    searchStrategy = 'general'

    // 根據法律領域添加關鍵字
    if (legalContext && LEGAL_CONTEXT_KEYWORDS[legalContext as keyof typeof LEGAL_CONTEXT_KEYWORDS]) {
      const contextKeywords = LEGAL_CONTEXT_KEYWORDS[legalContext as keyof typeof LEGAL_CONTEXT_KEYWORDS]
      const matchedKeyword = contextKeywords.find(kw => query.includes(kw))

      if (!matchedKeyword && !hasLocationContext) {
        enhancedQuery = `台灣 ${legalContext} ${query}`
      } else if (!hasLocationContext) {
        enhancedQuery = `台灣 ${query}`
      }
    } else if (!hasLocationContext) {
      enhancedQuery = `台灣法律 ${query}`
    }
  }

  return {
    enhancedQuery,
    searchStrategy,
    suggestedDomains
  }
}

/**
 * 搜索結果評分
 * 根據來源、相關性、新鮮度進行評分
 */
function scoreSearchResult(result: any): number {
  let score = 0

  // 域名評分（最高 50 分）
  if (TAIWAN_LEGAL_DOMAINS.tier1.some(d => result.url.includes(d))) {
    score += 50 // 政府官方
  } else if (TAIWAN_LEGAL_DOMAINS.tier2.some(d => result.url.includes(d))) {
    score += 35 // 專業法律平台
  } else if (TAIWAN_LEGAL_DOMAINS.tier3.some(d => result.url.includes(d))) {
    score += 25 // 學術機構
  } else if (TAIWAN_LEGAL_DOMAINS.tier4.some(d => result.url.includes(d))) {
    score += 15 // 律師公會
  } else if (ALL_LEGAL_DOMAINS.some(d => result.url.includes(d))) {
    score += 10 // 其他法律網站
  }

  // 標題相關性評分（最高 30 分）
  const title = result.title?.toLowerCase() || ''
  if (title.includes('判決') || title.includes('裁定')) {
    score += 15
  }
  if (title.includes('法院')) {
    score += 10
  }
  if (/\d+年度.*字第\d+號/.test(title)) {
    score += 15 // 案號格式
  }

  // 內容長度評分（最高 10 分）
  const contentLength = result.content?.length || 0
  if (contentLength > 500) {
    score += 10
  } else if (contentLength > 200) {
    score += 5
  }

  // URL 品質評分（最高 10 分）
  if (result.url.includes('judgment') || result.url.includes('FJUD')) {
    score += 10 // 判決書專用 URL
  }

  return score
}

/**
 * 智能搜索策略選擇
 * 根據查詢自動選擇最佳搜索引擎組合
 */
async function intelligentSearch(
  query: string,
  maxResults: number,
  searchDepth: 'basic' | 'advanced',
  legalContext?: string
): Promise<SearchResults & { metadata: any }> {
  // 1. 關鍵字優化
  const optimization = enhancedQueryOptimization(query, legalContext)

  console.log('Search optimization:', {
    original: query,
    enhanced: optimization.enhancedQuery,
    strategy: optimization.searchStrategy
  })

  // 2. 根據策略選擇搜索引擎
  let useTavily = true
  let useExa = true

  // 如果是 basic 模式，可以只用一個引擎節省成本
  if (searchDepth === 'basic') {
    if (optimization.searchStrategy === 'judgment-focused') {
      useExa = true // Exa 更擅長語義搜索
      useTavily = false
    } else {
      useTavily = true // Tavily 更快
      useExa = false
    }
  }

  // 3. 執行搜索
  const tavilyProvider = createSearchProvider('tavily')
  const exaProvider = createSearchProvider('exa')

  const searchPromises: Promise<SearchResults | null>[] = []

  if (useTavily) {
    searchPromises.push(
      tavilyProvider
        .search(
          optimization.enhancedQuery,
          Math.ceil(maxResults / (useExa ? 2 : 1)),
          searchDepth,
          optimization.suggestedDomains,
          []
        )
        .catch(error => {
          console.error('Tavily search error:', error)
          return null
        })
    )
  } else {
    searchPromises.push(Promise.resolve(null))
  }

  if (useExa) {
    searchPromises.push(
      exaProvider
        .search(
          optimization.enhancedQuery,
          Math.ceil(maxResults / (useTavily ? 2 : 1)),
          searchDepth,
          optimization.suggestedDomains,
          []
        )
        .catch(error => {
          console.error('Exa search error:', error)
          return null
        })
    )
  } else {
    searchPromises.push(Promise.resolve(null))
  }

  const [tavilyResults, exaResults] = await Promise.all(searchPromises)

  // 4. 合併結果
  const combinedResults: SearchResults = {
    results: [],
    query: optimization.enhancedQuery,
    images: [],
    number_of_results: 0
  }

  if (tavilyResults) {
    combinedResults.results.push(...tavilyResults.results)
    combinedResults.images.push(...(tavilyResults.images || []))
  }

  if (exaResults) {
    const existingUrls = new Set(combinedResults.results.map(r => r.url))
    const uniqueExaResults = exaResults.results.filter(
      r => !existingUrls.has(r.url)
    )
    combinedResults.results.push(...uniqueExaResults)
  }

  // 5. 結果評分和排序
  const scoredResults = combinedResults.results.map(result => ({
    ...result,
    score: scoreSearchResult(result)
  }))

  scoredResults.sort((a, b) => b.score - a.score)

  // 6. 限制結果數量
  combinedResults.results = scoredResults.slice(0, maxResults)
  combinedResults.number_of_results = combinedResults.results.length

  // 7. 生成元數據
  const metadata = {
    original_query: query,
    enhanced_query: optimization.enhancedQuery,
    search_strategy: optimization.searchStrategy,
    engines_used: [
      useTavily && 'tavily',
      useExa && 'exa'
    ].filter(Boolean),
    suggested_domains: optimization.suggestedDomains.slice(0, 5),
    legal_context: legalContext || 'general',
    avg_score: scoredResults.reduce((sum, r) => sum + (r.score || 0), 0) / scoredResults.length,
    top_sources: [
      ...new Set(
        combinedResults.results
          .slice(0, 3)
          .map(r => {
            try {
              return new URL(r.url).hostname
            } catch {
              return 'unknown'
            }
          })
      )
    ]
  }

  return {
    ...combinedResults,
    metadata
  }
}

/**
 * 創建優化版法律搜索工具
 */
export function createOptimizedLegalSearchTool(fullModel: string) {
  return tool({
    description: `優化版台灣法律專用深度搜索工具。

特色：
- 🎯 智能關鍵字優化（根據查詢自動調整）
- 🏆 結果評分排序（優先政府官方資源）
- 💰 成本優化（basic 模式只用單引擎）
- 🚀 搜索策略自動選擇（判決書/法規/一般）

適用場景：
- 查詢判決案例（自動優先司法院）
- 搜索法律條文（自動優先法規資料庫）
- 研究法律問題（綜合多種來源）`,
    parameters: z.object({
      query: z
        .string()
        .describe('搜索關鍵字。例如：「車禍過失傷害」、「民法 184 條」、「勞基法資遣規定」'),
      legal_context: z
        .enum([
          '民事法',
          '刑事法',
          '行政法',
          '勞動法',
          '商事法',
          '智財法',
          '家事法',
          '消費者保護'
        ])
        .optional()
        .describe('法律領域（會自動添加相關關鍵字）'),
      max_results: z
        .number()
        .optional()
        .default(20)
        .describe('最多返回幾筆結果'),
      search_depth: z
        .enum(['basic', 'advanced'])
        .optional()
        .default('advanced')
        .describe('basic: 單引擎快速搜索；advanced: 雙引擎深度搜索（推薦）'),
      priority_judgment: z
        .boolean()
        .optional()
        .default(false)
        .describe('是否優先判決書（true 則只搜索司法院）')
    }),
    execute: async ({
      query,
      legal_context,
      max_results = 20,
      search_depth = 'advanced',
      priority_judgment = false
    }) => {
      try {
        // 如果優先判決書，強制使用判決書策略
        let finalQuery = query
        let suggestedDomains = ALL_LEGAL_DOMAINS

        if (priority_judgment) {
          const judgmentOpt = enhancedQueryOptimization(
            query.includes('判決') ? query : `${query} 判決`,
            legal_context
          )
          finalQuery = judgmentOpt.enhancedQuery
          suggestedDomains = TAIWAN_LEGAL_DOMAINS.tier1
        }

        // 執行智能搜索
        const results = await intelligentSearch(
          priority_judgment ? finalQuery : query,
          max_results,
          search_depth,
          legal_context
        )

        return results
      } catch (error) {
        console.error('Optimized legal search error:', error)
        return {
          results: [],
          query,
          images: [],
          number_of_results: 0,
          error: '搜索失敗，請稍後再試',
          metadata: {
            error_message: error instanceof Error ? error.message : String(error)
          }
        }
      }
    }
  })
}

/**
 * 創建快速法律搜索工具（成本優化）
 * 只使用單引擎，適合簡單查詢
 */
export function createQuickLegalSearchTool(fullModel: string) {
  return tool({
    description: `快速法律搜索工具（成本優化版）。

使用 Tavily 單引擎，速度快、成本低。
適合簡單查詢和快速確認。`,
    parameters: z.object({
      query: z.string().describe('搜索關鍵字'),
      max_results: z.number().optional().default(10)
    }),
    execute: async ({ query, max_results = 10 }) => {
      try {
        const optimization = enhancedQueryOptimization(query)
        const tavilyProvider = createSearchProvider('tavily')

        const results = await tavilyProvider.search(
          optimization.enhancedQuery,
          max_results,
          'basic',
          optimization.suggestedDomains,
          []
        )

        // 評分排序
        const scored = results.results.map(r => ({
          ...r,
          score: scoreSearchResult(r)
        }))
        scored.sort((a, b) => b.score - a.score)

        return {
          ...results,
          results: scored.slice(0, max_results),
          metadata: {
            engine: 'tavily-only',
            mode: 'quick',
            enhanced_query: optimization.enhancedQuery
          }
        }
      } catch (error) {
        console.error('Quick legal search error:', error)
        return {
          results: [],
          query,
          images: [],
          number_of_results: 0
        }
      }
    }
  })
}

// 導出預設工具實例
export const optimizedLegalSearchTool = createOptimizedLegalSearchTool(
  'openai:gpt-4o-mini'
)
export const quickLegalSearchTool = createQuickLegalSearchTool(
  'openai:gpt-4o-mini'
)

// 保留舊版本以向後相容
export { createJudgmentOnlySearchTool,createLegalSearchTool } from './legal-search'
