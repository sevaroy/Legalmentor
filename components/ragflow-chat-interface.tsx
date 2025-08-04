/**
 * RAGFlow 聊天界面組件
 * 完整的知識庫聊天界面，包含消息顯示、配置面板等
 */

'use client'

import RAGFlowChatPanel from '@/components/ragflow-chat-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// import { ScrollArea } from '@/components/ui/scroll-area' // 使用 div 替代
import useRAGFlowChat from '@/lib/hooks/use-ragflow-chat'
import {
    AlertCircle,
    BookOpen,
    Bot,
    ExternalLink,
    Send,
    Trash2,
    User
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface RAGFlowChatInterfaceProps {
  className?: string
}

export function RAGFlowChatInterface({ className = '' }: RAGFlowChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [showConfig, setShowConfig] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError
  } = useRAGFlowChat()

  // 自動滾動到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // 處理發送消息
  const handleSendMessage = async (message: string, config: any) => {
    if (!message.trim()) return
    
    await sendMessage(message, config)
    setInputValue('')
  }

  // 處理輸入框提交
  const handleInputSubmit = async () => {
    if (!inputValue.trim() || isLoading) return
    
    // 使用默認配置
    const defaultConfig = {
      searchStrategy: 'intelligent' as const
    }
    
    await handleSendMessage(inputValue, defaultConfig)
  }

  // 處理按鍵事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleInputSubmit()
    }
  }

  return (
    <div className={`flex flex-col h-full max-h-[800px] ${className}`}>
      {/* 配置面板 */}
      {showConfig && (
        <div className="mb-4">
          <RAGFlowChatPanel
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      )}

      {/* 聊天區域 */}
      <Card className="flex-1 flex flex-col min-h-0">
        {/* 頭部 */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-medium">RAGFlow 知識庫助手</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
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
        </div>

        {/* 消息列表 */}
        <div className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">歡迎使用 RAGFlow 知識庫助手</p>
                <p className="text-sm">
                  請輸入您的問題，我會從專業知識庫中為您尋找答案
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

                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  <Card className={`${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50'
                  }`}>
                    <CardContent className="p-3">
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      {/* 元數據 */}
                      {message.metadata && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex flex-wrap gap-2 text-xs">
                            {message.metadata.dataset_name && (
                              <Badge variant="secondary" className="text-xs">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {message.metadata.dataset_name}
                              </Badge>
                            )}
                            
                            {message.metadata.confidence && (
                              <Badge variant="outline" className="text-xs">
                                置信度: {Math.round(message.metadata.confidence * 100)}%
                              </Badge>
                            )}
                            
                            {message.metadata.search_mode && (
                              <Badge variant="outline" className="text-xs">
                                {message.metadata.search_mode === 'multi' ? '多庫搜索' : 
                                 message.metadata.search_mode === 'intelligent' ? '智能選擇' : '單庫搜索'}
                              </Badge>
                            )}
                          </div>
                          
                          {/* 來源信息 */}
                          {message.metadata.sources && message.metadata.sources.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-muted-foreground mb-1">
                                參考來源 ({message.metadata.sources.length} 個):
                              </div>
                              <div className="space-y-1">
                                {message.metadata.sources.slice(0, 3).map((source, index) => (
                                  <div key={index} className="text-xs p-2 bg-background/50 rounded border">
                                    <div className="font-medium flex items-center gap-1">
                                      <ExternalLink className="h-3 w-3" />
                                      {source.doc_name || `文檔 ${index + 1}`}
                                    </div>
                                    {source.content && (
                                      <div className="text-muted-foreground mt-1 line-clamp-2">
                                        {source.content.substring(0, 100)}...
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
                      正在搜索知識庫...
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

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
              placeholder="輸入您的問題..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleInputSubmit}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            按 Enter 發送，Shift + Enter 換行
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RAGFlowChatInterface