/**
 * 數據集 API 端點
 * 獲取可用的知識庫列表
 */

import { RAGFlowClient } from '@/lib/clients/ragflow-client'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 10

export async function GET(request: NextRequest) {
  try {
    // 創建 RAGFlow 客戶端
    const ragflowClient = new RAGFlowClient()
    
    // 獲取數據集列表
    const datasets = await ragflowClient.getDatasets()
    
    // 按文檔數量排序（文檔多的優先）
    const sortedDatasets = datasets.sort((a, b) => b.document_count - a.document_count)
    
    return NextResponse.json({
      success: true,
      data: sortedDatasets,
      count: sortedDatasets.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Failed to fetch datasets:', error)
    
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '獲取知識庫列表失敗',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}