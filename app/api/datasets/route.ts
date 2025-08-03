/**
 * 數據集 API 端點
 * 獲取 RAGFlow 知識庫列表
 */

import { RAGFlowAgent } from '@/lib/agents/ragflow-agent'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const ragflowAgent = new RAGFlowAgent()
    
    // 檢查 RAGFlow 服務健康狀態
    const isHealthy = await ragflowAgent.healthCheck()
    if (!isHealthy) {
      return NextResponse.json(
        { error: 'RAGFlow 服務不可用' },
        { status: 503 }
      )
    }

    // 獲取數據集列表
    const datasets = await ragflowAgent.getAvailableDatasets()
    
    return NextResponse.json({
      success: true,
      data: datasets,
      count: datasets.length
    })

  } catch (error) {
    console.error('Failed to fetch datasets:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '獲取知識庫列表失敗',
        data: []
      },
      { status: 500 }
    )
  }
}