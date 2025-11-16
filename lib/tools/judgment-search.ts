import { tool } from 'ai'
import { z } from 'zod'

/**
 * 司法院判決書搜尋工具
 * 整合司法院開放資料 API，提供判決書智能搜尋功能
 */

// 判決書資料結構
export interface JudgmentResult {
  jid: string // 判決書唯一識別碼
  title: string // 判決書標題
  court: string // 法院名稱
  judgeDate: string // 判決日期
  caseType: string // 案件類型
  caseNumber: string // 案號
  content?: string // 判決書內容
  summary?: string // AI 生成的摘要
  url: string // 司法院判決書連結
}

export interface JudgmentSearchResults {
  results: JudgmentResult[]
  total: number
  query: string
}

/**
 * 從司法院 API 取得判決書清單
 */
async function fetchJudgmentList(date: string): Promise<string[]> {
  try {
    const response = await fetch(
      `http://data.judicial.gov.tw/jdg/api/JList?date=${date}`
    )
    if (!response.ok) {
      console.error('Failed to fetch judgment list:', response.statusText)
      return []
    }
    const data = await response.json()
    return data.jids || []
  } catch (error) {
    console.error('Error fetching judgment list:', error)
    return []
  }
}

/**
 * 從司法院 API 取得單一判決書內容
 */
async function fetchJudgmentContent(jid: string): Promise<any> {
  try {
    const response = await fetch(
      `http://data.judicial.gov.tw/jdg/api/JDoc/${jid}`
    )
    if (!response.ok) {
      console.error(`Failed to fetch judgment ${jid}:`, response.statusText)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching judgment ${jid}:`, error)
    return null
  }
}

/**
 * 解析判決書資料
 */
function parseJudgmentData(data: any): JudgmentResult | null {
  try {
    if (!data) return null

    return {
      jid: data.JID || '',
      title: data.JTITLE || '未命名判決書',
      court: data.JCOURT || '未知法院',
      judgeDate: data.JDATE || '',
      caseType: data.JCASE || '',
      caseNumber: data.JNO || '',
      content: data.JFULL || '',
      url: `https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=${data.JID || ''}`
    }
  } catch (error) {
    console.error('Error parsing judgment data:', error)
    return null
  }
}

/**
 * 搜尋判決書（使用關鍵字）
 * 注意：由於司法院 API 限制，此函數會先取得最近的判決書清單，
 * 然後在內容中搜尋關鍵字。對於生產環境，建議建立自己的資料庫。
 */
async function searchJudgments(
  query: string,
  maxResults: number = 10,
  filters?: {
    court?: string // 法院名稱篩選
    caseType?: string // 案件類型篩選
    startDate?: string // 開始日期
    endDate?: string // 結束日期
  }
): Promise<JudgmentSearchResults> {
  const results: JudgmentResult[] = []

  // 這是簡化版本，實際應用應該：
  // 1. 建立本地資料庫定期同步司法院資料
  // 2. 使用全文搜尋引擎（如 Elasticsearch）
  // 3. 實作更複雜的搜尋邏輯

  // 目前返回空結果，並提示需要建立本地資料庫
  return {
    results: [],
    total: 0,
    query
  }
}

/**
 * 創建判決書搜尋工具
 */
export function createJudgmentSearchTool(fullModel: string) {
  return tool({
    description:
      '搜尋司法院判決書系統，找出相關判決案例。適用於法律問題查詢、判例研究、案件參考等。',
    parameters: z.object({
      query: z
        .string()
        .describe(
          '搜尋關鍵字，可以是案件類型、法律問題、當事人名稱等。例如：「車禍過失傷害」、「租賃契約糾紛」'
        ),
      max_results: z
        .number()
        .optional()
        .default(10)
        .describe('最多返回幾筆判決書結果'),
      court: z
        .string()
        .optional()
        .describe(
          '指定法院，例如：「臺灣高等法院」、「臺北地方法院」。不指定則搜尋所有法院'
        ),
      case_type: z
        .string()
        .optional()
        .describe(
          '案件類型，例如：「民事」、「刑事」、「行政」。不指定則搜尋所有類型'
        ),
      date_range: z
        .object({
          start: z.string().optional().describe('開始日期 (YYYY-MM-DD)'),
          end: z.string().optional().describe('結束日期 (YYYY-MM-DD)')
        })
        .optional()
        .describe('判決日期範圍')
    }),
    execute: async ({ query, max_results, court, case_type, date_range }) => {
      console.log('Searching judgments with query:', query)

      const searchResults = await searchJudgments(query, max_results, {
        court,
        caseType: case_type,
        startDate: date_range?.start,
        endDate: date_range?.end
      })

      return {
        ...searchResults,
        message:
          '⚠️ 判決書搜尋功能目前處於開發階段。建議使用司法院判決書查詢系統 https://judgment.judicial.gov.tw/ 進行詳細查詢。'
      }
    }
  })
}

/**
 * 取得特定判決書詳細內容
 */
export function createGetJudgmentTool(fullModel: string) {
  return tool({
    description: '根據判決書 ID (JID) 取得完整判決書內容',
    parameters: z.object({
      jid: z.string().describe('判決書唯一識別碼 (JID)')
    }),
    execute: async ({ jid }) => {
      console.log('Fetching judgment:', jid)

      const data = await fetchJudgmentContent(jid)
      const judgment = parseJudgmentData(data)

      if (!judgment) {
        return {
          error: '無法取得該判決書，請確認 JID 是否正確',
          jid
        }
      }

      return judgment
    }
  })
}

// 導出預設工具實例
export const judgmentSearchTool = createJudgmentSearchTool('openai:gpt-4o-mini')
export const getJudgmentTool = createGetJudgmentTool('openai:gpt-4o-mini')
