/**
 * RAGFlow 聊天面板組件
 * 整合知識庫選擇、搜索策略和聊天功能
 */

'use client'

import DatasetSelector from '@/components/dataset-selector'
import SearchStrategySelector, { SearchStrategy } from '@/components/search-strategy-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RAGFlowDataset } from '@/lib/types/ragflow'
import {
    ChevronDown,
    ChevronUp,
    Loader2,
    MessageSquare,
    Settings
} from 'lucide-react'
import { useState } from 'react'

interface RAGFlowChatPanelProps {
  onSendMessage?: (message: string, config: ChatConfig) => void
  disabled?: boolean
  className?: string
}

interface ChatConfig {
  datasetId?: string
  datasetName?: string
  searchStrategy: SearchStrategy
}

export function RAGFlowChatPanel({ 
  onSendMessage, 
  disabled = false,
  className = '' 
}: RAGFlowChatPanelProps) {
  const [selectedDataset, setSelectedDataset] = useState<RAGFlowDataset | null>(null)
  const [searchStrategy, setSearchStrategy] = useState<SearchStrategy>('intelligent')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 處理發送消息
  const handleSendMessage = async (message: string) => {
    if (!onSendMessage || isLoading) return

    setIsLoading(true)
    
    const config: ChatConfig = {
      datasetId: selectedDataset?.id,
      datasetName: selectedDataset?.name,
      searchStrategy
    }

    try {
      await onSendMessage(message, config)
    } finally {
      setIsLoading(false)
    }
  }

  // 獲取當前配置摘要
  const getConfigSummary = () => {
    const parts = []
    
    if (selectedDataset) {
      parts.push(`知識庫: ${selectedDataset.name}`)
    }
    
    const strategyLabels = {
      single: '單一知識庫',
      intelligent: '智能選擇',
      multi: '多庫搜索'
    }
    parts.push(`策略: ${strategyLabels[searchStrategy]}`)
    
    return parts.join(' • ')
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            RAGFlow 知識庫聊天
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-8"
          >
            <Settings className="h-4 w-4 mr-1" />
            設定
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>
        
        {/* 配置摘要 */}
        <div className="text-sm text-muted-foreground">
          {getConfigSummary()}
        </div>
      </CardHeader>

      {showAdvanced && (
        <>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            {/* 知識庫選擇 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">知識庫選擇</label>
              <DatasetSelector
                selectedDataset={selectedDataset}
                onDatasetChange={setSelectedDataset}
                disabled={disabled || isLoading}
              />
            </div>

            {/* 搜索策略選擇 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">搜索策略</label>
              <SearchStrategySelector
                strategy={searchStrategy}
                onStrategyChange={setSearchStrategy}
                disabled={disabled || isLoading}
              />
            </div>

            {/* 配置提示 */}
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <div className="font-medium mb-1">當前配置說明：</div>
              <div className="text-muted-foreground space-y-1">
                {searchStrategy === 'single' && selectedDataset && (
                  <p>將只搜索「{selectedDataset.name}」知識庫</p>
                )}
                {searchStrategy === 'intelligent' && (
                  <p>系統將根據問題內容自動選擇最合適的知識庫</p>
                )}
                {searchStrategy === 'multi' && (
                  <p>將同時搜索多個相關知識庫並合併結果</p>
                )}
              </div>
            </div>
          </CardContent>
        </>
      )}

      {/* 狀態指示器 */}
      {isLoading && (
        <>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              正在搜索知識庫...
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default RAGFlowChatPanel