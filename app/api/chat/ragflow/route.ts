/**
 * RAGFlow 聊天 API 端點
 * 處理知識庫模式的聊天請求
 */

import { RAGFlowAgent } from '@/lib/agents/ragflow-agent'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { ChatOptions } from '@/lib/types/ragflow'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 180

export async function POST(request: NextRequest) {
  try {
    const { messages, datasetId, sessionId, searchMode = 'single' } = await request.json()
    
    // 檢查是否為分享頁面
    const referer = request.headers.get('referer')
    const isSharePage = referer?.includes('/share/')
    
    if (isSharePage) {
      return NextResponse.json(
        { error: 'RAGFlow 功能在分享頁面不可用' },
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

    // 創建 RAGFlow Agent
    const ragflowAgent = new RAGFlowAgent()
    
    // 設置默認數據集（如果提供）
    if (datasetId) {
      ragflowAgent.setDefaultDataset(datasetId)
    }

    // 構建聊天選項
    const options: Partial<ChatOptions> = {
      mode: 'knowledge',
      datasetId,
      sessionId,
      userId,
      quote: true,
      stream: false
    }

    // 提取最新的用戶消息
    const lastMessage = messages.filter(m => m.role === 'user').pop()
    if (!lastMessage) {
      return NextResponse.json(
        { error: '沒有找到用戶消息' },
        { status: 400 }
      )
    }

    let result: any

    // 根據搜索模式執行不同的搜索策略
    switch (searchMode) {
      case 'multi':
        // 多知識庫搜索
        result = await ragflowAgent.multiDatasetSearch(lastMessage.content, options)
        break
      case 'intelligent':
        // 智能選擇知識庫
        result = await ragflowAgent.search(lastMessage.content, options)
        break
      case 'single':
      default:
        // 單一知識庫搜索（原有邏輯）
        result = await ragflowAgent.chat(messages, options)
        break
    }

    // 格式化回應
    const formattedAnswer = ragflowAgent.formatAnswer(result)

    return NextResponse.json({
      success: true,
      answer: formattedAnswer,
      raw_answer: result.answer,
      sources: result.sources,
      session_id: result.session_id,
      dataset_name: result.dataset_name,
      confidence: result.confidence,
      search_mode: searchMode,
      mode: 'knowledge',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('RAGFlow chat error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '知識庫搜索失敗',
        mode: 'knowledge',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}