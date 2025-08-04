/**
 * 混合搜索 API 端點
 * 整合 Tavily 網路搜索和 RAGFlow 知識庫搜索
 */

import { HybridSearchAgent, HybridSearchOptions } from '@/lib/agents/hybrid-search-agent'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60 // 混合搜索可能需要更長時間

export async function POST(request: NextRequest) {
  try {
    const { 
      messages, 
      datasetId, 
      sessionId,
      searchMode = 'hybrid',
      webSearchDepth = 'advanced',
      webMaxResults = 10,
      includeDomains = [],
      excludeDomains = [],
      prioritizeKnowledge = true,
      combineResults = true
    } = await request.json()
    
    // 檢查是否為分享頁面
    const referer = request.headers.get('referer')
    const isSharePage = referer?.includes('/share/')
    
    if (isSharePage) {
      return NextResponse.json(
        { error: '混合搜索功能在分享頁面不可用' },
        { status: 403 }
      )
    }

    // 獲取用戶 ID
    const userId = await getCurrentUserId()

    // 驗證請求參數
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '消息列表不能為空' },
        { status: 400 }
      )
    }

    // 提取最新的用戶消息
    const lastMessage = messages.filter(m => m.role === 'user').pop()
    if (!lastMessage) {
      return NextResponse.json(
        { error: '沒有找到用戶消息' },
        { status: 400 }
      )
    }

    // 創建混合搜索代理
    const hybridAgent = new HybridSearchAgent()

    // 構建搜索選項
    const searchOptions: HybridSearchOptions = {
      mode: 'hybrid',
      datasetId,
      sessionId,
      userId,
      quote: true,
      stream: false,
      webSearchDepth: webSearchDepth as 'basic' | 'advanced',
      webMaxResults,
      includeDomains,
      excludeDomains,
      prioritizeKnowledge,
      combineResults
    }

    let result: any

    // 根據搜索模式執行不同的搜索策略
    switch (searchMode) {
      case 'intelligent':
        // 智能搜索策略
        result = await hybridAgent.intelligentSearch(lastMessage.content, searchOptions)
        break
      case 'knowledge-first':
        // 知識庫優先
        result = await hybridAgent.hybridSearch(lastMessage.content, {
          ...searchOptions,
          prioritizeKnowledge: true
        })
        break
      case 'web-first':
        // 網路搜索優先
        result = await hybridAgent.hybridSearch(lastMessage.content, {
          ...searchOptions,
          prioritizeKnowledge: false
        })
        break
      case 'hybrid':
      default:
        // 標準混合搜索
        result = await hybridAgent.hybridSearch(lastMessage.content, searchOptions)
        break
    }

    // 格式化回應
    const answer = result.combined_answer || 
                  result.knowledge_results?.answer || 
                  '抱歉，沒有找到相關信息'

    // 計算置信度
    const confidence = calculateHybridConfidence(result)

    return NextResponse.json({
      success: true,
      answer,
      raw_answer: answer,
      web_results: result.web_results || [],
      knowledge_results: result.knowledge_results,
      sources: result.sources || [],
      modes_used: result.mode_used || [],
      confidence,
      search_mode: searchMode,
      mode: 'hybrid',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Hybrid search error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '混合搜索失敗',
        mode: 'hybrid',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * 計算混合搜索的置信度
 */
function calculateHybridConfidence(result: any): number {
  let confidence = 0.5 // 基礎置信度

  // 知識庫結果的置信度
  if (result.knowledge_results?.confidence) {
    confidence += result.knowledge_results.confidence * 0.4
  }

  // 網路搜索結果的置信度
  if (result.web_results && result.web_results.length > 0) {
    confidence += Math.min(result.web_results.length / 10, 0.3)
  }

  // 多模式搜索的加成
  if (result.mode_used && result.mode_used.length > 1) {
    confidence += 0.1
  }

  return Math.min(confidence, 0.95)
}

// 健康檢查端點
export async function GET() {
  try {
    const hybridAgent = new HybridSearchAgent()
    const health = await hybridAgent.healthCheck()
    
    return NextResponse.json({
      success: true,
      health,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '健康檢查失敗',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}