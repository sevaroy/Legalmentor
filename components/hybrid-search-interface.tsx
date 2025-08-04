/**
 * 混合搜索界面組件
 * 整合 Tavily 網路搜索和 RAGFlow 知識庫搜索的完整界面
 */

'use client'

import DatasetSelector from '@/components/dataset-selector'
import HybridSearchConfig from '@/components/hybrid-search-config'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHybridSearch from '@/lib/hooks/use-hybrid-search'
import { RAGFlowDataset } from '@/lib/types/ragflow'
import {
    Activity,
    AlertCircle,
    BookOpen,
    Bot,
    CheckCircle,
    ExternalLink,
    Globe,
    Send,
    Settings,
    Trash2,
    User,
    XCircle,
    Zap
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface HybridSearchInterfaceProps {
  className?: string
}

export function HybridSearchInterface({ className = '' }: HybridSearchInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [selectedDataset, setSelectedDataset] = useState<RAGFlowDataset | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [healthStatus, setHealthStatus] = useState<{ ragflow: boolean; tavily: boolean } | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const {
    messages,
    isLoading,
    error,
    config,
    sendMessage,
    updateConfig,
    clearMessages,
    clearError,
    healthCheck
  } = useHybridSearch()

  // 自動滾動到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // 檢查健康狀態
  useEffect(() => {
    const checkHealth = async () => {
      const health = await healthCheck()
      setHealthStatus(health)
    }
    checkHealth()
  }, [healthCheck])

  // 處理發送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    
    await sendMessage(inputValue)
    setInputValue('')
  }

  // 處理按鍵事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 更新配置中的數據集ID
  const handleDatasetChange = (dataset: RAGFlowDataset | null) => {
    setSelectedDataset(dataset)
    updateConfig({
      ...config,
      datasetId: dataset?.id
    })
  }

  return (
    <div className={`flex flex-col h-full max-h-[900px] ${className}`}>
      {/* 頭部狀態欄 */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">混合搜索系統</span>
                <Badge variant="secondary">Tavily + RAGFlow</Badge>
              </div>
              
              {/* 健康狀態指示器 */}
              {healthStatus && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>Tavily:</span>
                    {healthStatus.tavily ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>RAGFlow:</span>
                    {healthStatus.ragflow ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
                <Settings className="h-4 w-4 mr-1" />
                {showConfig ? '隱藏配置' : '顯示配置'}
              </Button>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessages}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  清空
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 配置面板 */}
      {showConfig && (
        <div className="mb-4">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">搜索配置</TabsTrigger>
              <TabsTrigger value="dataset">知識庫選擇</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-4">
              <HybridSearchConfig
                config={config}
                onConfigChange={updateConfig}
                disabled={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="dataset" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <DatasetSelector
                    selectedDataset={selectedDataset}
                    onDatasetChange={handleDatasetChange}
                    disabled={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* 聊天區域 */}
      <Card className="flex-1 flex flex-col min-h-0">
        {/* 消息列表 */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Globe className="h-8 w-8 opacity-50" />
                  <Zap className="h-6 w-6 opacity-50" />
                  <BookOpen className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-lg font-medium mb-2">歡迎使用混合搜索系統</p>
                <p className="text-sm">
                  結合 Tavily 網路搜索和 RAGFlow 知識庫，為您提供最全面的答案
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  <Card className={`${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      {/* 搜索結果元數據 */}
                      {message.metadata && (
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                          {/* 搜索模式和置信度 */}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {message.metadata.modes_used?.map((mode) => (
                              <Badge key={mode} variant="secondary" className="text-xs">
                                {mode === 'web' && <Globe className="h-3 w-3 mr-1" />}
                                {mode === 'knowledge' && <BookOpen className="h-3 w-3 mr-1" />}
                                {mode === 'web' ? 'Tavily 搜索' : 'RAGFlow 知識庫'}
                              </Badge>
                            ))}
                            
                            {message.metadata.confidence && (
                              <Badge variant="outline" className="text-xs">
                                <Activity className="h-3 w-3 mr-1" />
                                置信度: {Math.round(message.metadata.confidence * 100)}%
                              </Badge>
                            )}
                            
                            {message.metadata.search_mode && (
                              <Badge variant="outline" className="text-xs">
                                策略: {message.metadata.search_mode}
                              </Badge>
                            )}
                          </div>
                          
                          {/* 來源信息 */}
                          {message.metadata.sources && message.metadata.sources.length > 0 && (
                            <div>
                              <div className="text-xs text-muted-foreground mb-2 font-medium">
                                參考來源 ({message.metadata.sources.length} 個):
                              </div>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {message.metadata.sources.slice(0, 5).map((source, index) => (
                                  <div key={index} className="text-xs p-2 bg-background/50 rounded border">
                                    <div className="font-medium flex items-center gap-1 mb-1">
                                      {source.type === 'web' ? (
                                        <Globe className="h-3 w-3 text-blue-500" />
                                      ) : (
                                        <BookOpen className="h-3 w-3 text-green-500" />
                                      )}
                                      <span className="truncate">
                                        {source.title || source.doc_name || `來源 ${index + 1}`}
                                      </span>
                                      {source.url && (
                                        <ExternalLink className="h-3 w-3 ml-auto cursor-pointer" 
                                          onClick={() => window.open(source.url, '_blank')} />
                                      )}
                                    </div>
                                    {source.content && (
                                      <div className="text-muted-foreground line-clamp-2">
                                        {source.content.substring(0, 150)}...
                                      </div>
                                    )}
                                    {source.dataset_name && (
                                      <div className="text-muted-foreground mt-1">
                                        知識庫: {source.dataset_name}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 order-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 載入指示器 */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      </div>
                      正在執行混合搜索...
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 錯誤提示 */}
        {error && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* 輸入區域 */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入您的問題，系統將智能搜索網路和知識庫..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
            <span>按 Enter 發送，Shift + Enter 換行</span>
            <span className="flex items-center gap-1">
              當前策略: 
              <Badge variant="outline" className="text-xs">
                {config.searchMode === 'intelligent' ? '智能策略' :
                 config.searchMode === 'hybrid' ? '標準混合' :
                 config.searchMode === 'knowledge-first' ? '知識庫優先' : '網路優先'}
              </Badge>
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default HybridSearchInterface