import { tool } from 'ai'
import { z } from 'zod'

import { SearchResults } from '@/lib/types'

import { createSearchProvider } from './search/providers'

/**
 * 台灣法律專用深度搜索工具
 * 整合 Tavily 和 Exa API，針對中華民國裁判書和法律資源優化
 */

/**
 * 台灣法律相關網域清單
 * 優先搜索這些官方和權威法律資源
 */
const TAIWAN_LEGAL_DOMAINS = [
  // 司法院系統
  'judicial.gov.tw', // 司法院
  'judgment.judicial.gov.tw', // 判決書查詢系統
  'jirs.judicial.gov.tw', // 法學資料檢索系統

  // 政府法規資源
  'law.moj.gov.tw', // 全國法規資料庫
  'mojlaw.moj.gov.tw', // 法務部法規查詢
  'laws.taipei.gov.tw', // 台北市法規查詢

  // 專業法律網站
  'lawbank.com.tw', // 法源法律網
  'lawtw.com', // 植根法律網
  '6law.idv.tw', // 六法全書

  // 學術機構
  'ntu.edu.tw', // 台灣大學（法律學院）
  'nccur.lib.nccu.edu.tw', // 政治大學學術集成

  // 律師公會
  'twba.org.tw', // 台北律師公會
  'tcba.org.tw' // 台中律師公會
]

/**
 * 法律搜索關鍵字增強
 * 自動添加台灣法律相關的上下文
 */
function enhanceLegalQuery(query: string, legalContext?: string): string {
  // 如果查詢已經包含「台灣」、「中華民國」等關鍵字，則不需要增強
  const hasLocationContext = /台灣|中華民國|我國|本國/.test(query)

  if (hasLocationContext) {
    return query
  }

  // 根據法律領域添加上下文
  const contextPrefix = legalContext ? `${legalContext} ` : '台灣法律 '

  // 特殊處理：如果是詢問判決案例
  if (/判決|判例|案例|裁定/.test(query)) {
    return `${contextPrefix}${query} 司法院`
  }

  // 一般法律問題
  return `${contextPrefix}${query}`
}

/**
 * 雙 API 策略搜索
 * 使用 Tavily 獲取廣泛結果，Exa 獲取深度語義結果
 */
async function dualApiSearch(
  query: string,
  maxResults: number,
  searchDepth: 'basic' | 'advanced',
  includeDomains: string[],
  excludeDomains: string[]
): Promise<SearchResults> {
  try {
    // 合併台灣法律域名到 includeDomains
    const legalDomains = [...new Set([...TAIWAN_LEGAL_DOMAINS, ...includeDomains])]

    // 策略 1: 使用 Tavily (AI 優化搜索)
    const tavilyProvider = createSearchProvider('tavily')
    const tavilyPromise = tavilyProvider
      .search(query, Math.ceil(maxResults / 2), searchDepth, legalDomains, excludeDomains)
      .catch(error => {
        console.error('Tavily search error:', error)
        return null
      })

    // 策略 2: 使用 Exa (語義搜索)
    const exaProvider = createSearchProvider('exa')
    const exaPromise = exaProvider
      .search(query, Math.ceil(maxResults / 2), searchDepth, legalDomains, excludeDomains)
      .catch(error => {
        console.error('Exa search error:', error)
        return null
      })

    // 並行執行兩個搜索
    const [tavilyResults, exaResults] = await Promise.all([
      tavilyPromise,
      exaPromise
    ])

    // 合併結果
    const combinedResults: SearchResults = {
      results: [],
      query,
      images: [],
      number_of_results: 0
    }

    // 添加 Tavily 結果
    if (tavilyResults) {
      combinedResults.results.push(...tavilyResults.results)
      combinedResults.images.push(...(tavilyResults.images || []))
    }

    // 添加 Exa 結果（去重）
    if (exaResults) {
      const existingUrls = new Set(combinedResults.results.map(r => r.url))
      const uniqueExaResults = exaResults.results.filter(
        r => !existingUrls.has(r.url)
      )
      combinedResults.results.push(...uniqueExaResults)
    }

    // 優先排序：司法院判決書系統的結果
    combinedResults.results.sort((a, b) => {
      const aIsJudicial = a.url.includes('judicial.gov.tw')
      const bIsJudicial = b.url.includes('judicial.gov.tw')
      if (aIsJudicial && !bIsJudicial) return -1
      if (!aIsJudicial && bIsJudicial) return 1
      return 0
    })

    // 限制最大結果數
    combinedResults.results = combinedResults.results.slice(0, maxResults)
    combinedResults.number_of_results = combinedResults.results.length

    return combinedResults
  } catch (error) {
    console.error('Dual API search error:', error)
    throw error
  }
}

/**
 * 創建法律專用搜索工具
 */
export function createLegalSearchTool(fullModel: string) {
  return tool({
    description: `搜索台灣法律資源和中華民國裁判書。
此工具專門針對台灣法律領域優化，會優先搜索：
- 司法院判決書系統
- 全國法規資料庫
- 法律專業網站
- 學術法律資源

適用場景：
- 查詢相關判決案例
- 搜索法律條文解釋
- 尋找法律實務見解
- 研究特定法律議題`,
    parameters: z.object({
      query: z
        .string()
        .describe(
          '搜索關鍵字。例如：「車禍過失傷害判決」、「租賃契約押金返還」、「勞基法資遣規定」'
        ),
      legal_context: z
        .string()
        .optional()
        .describe(
          '法律領域上下文，用於優化搜索。例如：「民事法」、「刑事法」、「行政法」、「勞動法」'
        ),
      max_results: z
        .number()
        .optional()
        .default(20)
        .describe('最多返回幾筆結果（預設 20）'),
      search_depth: z
        .enum(['basic', 'advanced'])
        .optional()
        .default('advanced')
        .describe(
          '搜索深度。basic: 快速搜索；advanced: 深度搜索，包含更多來源和詳細內容（推薦）'
        ),
      include_judgment_only: z
        .boolean()
        .optional()
        .default(false)
        .describe('是否僅搜索司法院判決書系統（true 則只搜索 judicial.gov.tw）')
    }),
    execute: async ({
      query,
      legal_context,
      max_results = 20,
      search_depth = 'advanced',
      include_judgment_only = false
    }) => {
      console.log('Legal search:', {
        query,
        legal_context,
        search_depth,
        include_judgment_only
      })

      try {
        // 增強查詢關鍵字
        const enhancedQuery = enhanceLegalQuery(query, legal_context)

        // 設定域名篩選
        const includeDomains = include_judgment_only
          ? ['judicial.gov.tw', 'judgment.judicial.gov.tw']
          : TAIWAN_LEGAL_DOMAINS

        // 執行雙 API 搜索
        const results = await dualApiSearch(
          enhancedQuery,
          max_results,
          search_depth,
          includeDomains,
          []
        )

        // 添加元數據
        return {
          ...results,
          metadata: {
            enhanced_query: enhancedQuery,
            legal_context: legal_context || 'general',
            search_strategy: 'dual_api_taiwan_legal',
            apis_used: ['tavily', 'exa'],
            prioritized_domains: includeDomains.slice(0, 5)
          }
        }
      } catch (error) {
        console.error('Legal search error:', error)
        return {
          results: [],
          query,
          images: [],
          number_of_results: 0,
          error: '法律搜索失敗，請稍後再試'
        }
      }
    }
  })
}

/**
 * 創建判決書專用搜索工具
 * 專門搜索司法院判決書系統
 */
export function createJudgmentOnlySearchTool(fullModel: string) {
  return tool({
    description: `專門搜索司法院判決書系統的判決案例。
此工具會優先搜索：
- 司法院判決書查詢系統
- 司法院法學資料檢索系統

適用場景：
- 查詢特定類型的判決（如車禍、租賃糾紛等）
- 研究法院判決趨勢
- 尋找類似案例參考`,
    parameters: z.object({
      query: z
        .string()
        .describe(
          '判決搜索關鍵字。應包含具體的法律問題或案件類型。例如：「車禍過失傷害」、「租賃押金糾紛」'
        ),
      case_type: z
        .enum(['民事', '刑事', '行政', '全部'])
        .optional()
        .default('全部')
        .describe('案件類型篩選'),
      max_results: z
        .number()
        .optional()
        .default(15)
        .describe('最多返回幾筆判決（預設 15）')
    }),
    execute: async ({ query, case_type = '全部', max_results = 15 }) => {
      console.log('Judgment-only search:', { query, case_type })

      try {
        // 構建判決專用查詢
        const caseTypePrefix =
          case_type !== '全部' ? `${case_type}判決 ` : '判決 '
        const judgmentQuery = `${caseTypePrefix}${query} site:judicial.gov.tw`

        // 使用雙 API 搜索，但限制在司法院域名
        const results = await dualApiSearch(
          judgmentQuery,
          max_results,
          'advanced',
          ['judicial.gov.tw', 'judgment.judicial.gov.tw'],
          []
        )

        return {
          ...results,
          metadata: {
            case_type,
            search_scope: 'judicial_gov_tw_only',
            note: '結果來自司法院判決書系統'
          }
        }
      } catch (error) {
        console.error('Judgment-only search error:', error)
        return {
          results: [],
          query,
          images: [],
          number_of_results: 0,
          error: '判決書搜索失敗，建議直接前往司法院判決書查詢系統'
        }
      }
    }
  })
}

// 導出預設工具實例
export const legalSearchTool = createLegalSearchTool('openai:gpt-4o-mini')
export const judgmentOnlySearchTool = createJudgmentOnlySearchTool(
  'openai:gpt-4o-mini'
)
