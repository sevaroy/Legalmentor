/**
 * 搜索策略選擇組件
 * 允許用戶選擇不同的知識庫搜索策略
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    BookOpen,
    Brain,
    Info,
    Search,
    Zap
} from 'lucide-react'
import { useState } from 'react'

export type SearchStrategy = 'single' | 'intelligent' | 'multi'

interface SearchStrategySelectorProps {
  strategy: SearchStrategy
  onStrategyChange: (strategy: SearchStrategy) => void
  disabled?: boolean
  className?: string
}

const strategyConfig = {
  single: {
    icon: BookOpen,
    label: '單一知識庫',
    description: '搜索指定的單一知識庫',
    color: 'bg-blue-500',
    badge: '精確',
    details: '適合已知問題領域的精確搜索'
  },
  intelligent: {
    icon: Brain,
    label: '智能選擇',
    description: '自動選擇最相關的知識庫',
    color: 'bg-green-500',
    badge: '智能',
    details: '基於問題內容自動匹配最合適的知識庫'
  },
  multi: {
    icon: Zap,
    label: '多庫搜索',
    description: '同時搜索多個相關知識庫',
    color: 'bg-purple-500',
    badge: '全面',
    details: '並行搜索多個知識庫並合併結果，覆蓋面更廣'
  }
}

export function SearchStrategySelector({ 
  strategy, 
  onStrategyChange, 
  disabled = false,
  className = '' 
}: SearchStrategySelectorProps) {
  const [showDetails, setShowDetails] = useState(false)

  const currentConfig = strategyConfig[strategy]
  const CurrentIcon = currentConfig.icon

  return (
    <TooltipProvider>
      <div className={`space-y-2 ${className}`}>
        {/* 主要選擇器 */}
        <div className="flex items-center gap-2">
          <Select
            value={strategy}
            onValueChange={(value: SearchStrategy) => onStrategyChange(value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <CurrentIcon className="h-4 w-4" />
                  <span className="text-sm">{currentConfig.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentConfig.badge}
                  </Badge>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(strategyConfig).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{config.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {config.description}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {config.badge}
                      </Badge>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          {/* 詳情按鈕 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-8 w-8 p-0"
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>查看搜索策略詳情</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 詳細說明 */}
        {showDetails && (
          <div className="rounded-lg border bg-muted/50 p-3 text-sm space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <div className={`w-2 h-2 rounded-full ${currentConfig.color}`} />
              {currentConfig.label}
            </div>
            
            <p className="text-muted-foreground">
              {currentConfig.details}
            </p>
            
            {/* 策略特定說明 */}
            <div className="text-xs text-muted-foreground border-t pt-2">
              {strategy === 'single' && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    <span className="font-medium">適用場景：</span>
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-0.5">
                    <li>已知問題屬於特定領域</li>
                    <li>需要精確的專業回答</li>
                    <li>避免跨領域干擾</li>
                  </ul>
                </div>
              )}
              
              {strategy === 'intelligent' && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    <span className="font-medium">智能匹配規則：</span>
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-0.5">
                    <li>基於關鍵詞自動匹配</li>
                    <li>考慮知識庫內容相關性</li>
                    <li>優先選擇文檔豐富的知識庫</li>
                  </ul>
                </div>
              )}
              
              {strategy === 'multi' && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span className="font-medium">搜索特點：</span>
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-0.5">
                    <li>並行搜索多個知識庫</li>
                    <li>智能合併搜索結果</li>
                    <li>提供更全面的答案</li>
                    <li>去重並排序參考來源</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default SearchStrategySelector