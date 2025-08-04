/**
 * 智能策略演示頁面
 * 展示混合搜索系統的智能策略選擇機制
 */

import StrategyAnalysisChart from '@/components/strategy-analysis-chart'
import StrategyDemo from '@/components/strategy-demo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StrategyDemoPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">智能搜索策略系統</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-muted-foreground mb-4">
            我們的混合搜索系統能夠根據問題內容智能選擇最適合的搜索策略，
            結合 Tavily 深度網路搜索和 RAGFlow 專業知識庫的優勢。
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">🏛️ 法律專業問題</h3>
              <p className="text-sm text-green-700">
                自動選擇知識庫優先策略，確保答案的權威性和準確性
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">📰 時事新聞問題</h3>
              <p className="text-sm text-blue-700">
                自動選擇網路優先策略，獲取最新、最即時的資訊
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">🔄 綜合性問題</h3>
              <p className="text-sm text-purple-700">
                使用混合搜索策略，結合多種來源提供全面答案
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demo">互動演示</TabsTrigger>
          <TabsTrigger value="flow">流程圖</TabsTrigger>
          <TabsTrigger value="analytics">策略分析</TabsTrigger>
        </TabsList>
        
        <TabsContent value="demo" className="mt-6">
          <StrategyDemo />
        </TabsContent>
        
        <TabsContent value="flow" className="mt-6">
          <StrategyFlowDiagram />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <StrategyAnalysisChart />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const metadata = {
  title: '智能策略演示 - 混合搜索系統',
  description: '展示如何根據問題類型智能選擇搜索策略'
}