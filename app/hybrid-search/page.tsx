/**
 * 混合搜索示例頁面
 * 展示 Tavily + RAGFlow 混合搜索功能
 */

import HybridSearchInterface from '@/components/hybrid-search-interface'

export default function HybridSearchPage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">混合搜索系統</h1>
        <p className="text-muted-foreground">
          結合 Tavily 深度網路搜索和 RAGFlow 專業知識庫，提供最全面的搜索體驗
        </p>
      </div>
      
      <HybridSearchInterface className="h-[calc(100vh-200px)]" />
    </div>
  )
}

export const metadata = {
  title: '混合搜索 - Tavily + RAGFlow',
  description: '智能混合搜索系統，結合網路搜索和知識庫搜索'
}