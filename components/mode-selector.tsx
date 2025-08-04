/**
 * 聊天模式選擇組件
 * 允許用戶在 Web 搜索和知識庫模式間切換
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
import { ChatMode } from '@/lib/types/ragflow'
import {
    BookOpen,
    Globe,
    Info,
    Zap
} from 'lucide-react'
import { useState } from 'react'

interface ModeSelectorProps {
  mode: ChatMode
  onModeChange: (mode: ChatMode) => void
  disabled?: boolean
  className?: string
}

const modeConfig = {
  web: {
    icon: Globe,
    label: 'Web 搜索',
    description: '使用 Tavily 搜索網路上的最新資訊',
    color: 'bg-blue-500',
    badge: '即時'
  },
  knowledge: {
    icon: BookOpen,
    label: '知識庫',
    description: '搜索 RAGFlow 專業知識庫內容',
    color: 'bg-green-500',
    badge: '專業'
  },
  hybrid: {
    icon: Zap,
    label: '混合搜索',
    description: '智能結合 Tavily 網路搜索和 RAGFlow 知識庫',
    color: 'bg-purple-500',
    badge: '全能'
  }
}

export function ModeSelector({ 
  mode, 
  onModeChange, 
  disabled = false,
  className = '' 
}: ModeSelectorProps) {
  const [showDetails, setShowDetails] = useState(false)

  const currentConfig = modeConfig[mode]
  const CurrentIcon = currentConfig.icon

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 主要選擇器 */}
      <div className="flex items-center gap-2">
        <Select
          value={mode}
          onValueChange={(value: ChatMode) => onModeChange(value)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                <CurrentIcon className="h-4 w-4" />
                <span>{currentConfig.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {currentConfig.badge}
                </Badge>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(modeConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{config.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {config.badge}
                    </Badge>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        {/* 詳情按鈕 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="h-8 w-8 p-0"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* 詳細說明 */}
      {showDetails && (
        <div className="rounded-lg border bg-muted/50 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium mb-1">
            <div className={`w-2 h-2 rounded-full ${currentConfig.color}`} />
            {currentConfig.label}
          </div>
          <p className="text-muted-foreground">
            {currentConfig.description}
          </p>
          
          {/* 模式特定說明 */}
          {mode === 'web' && (
            <div className="mt-2 text-xs text-muted-foreground">
              • 使用 Tavily 深度搜索網路資訊<br/>
              • 適合時事、新聞、最新資料<br/>
              • 支援基礎和進階搜索模式
            </div>
          )}
          
          {mode === 'knowledge' && (
            <div className="mt-2 text-xs text-muted-foreground">
              • 搜索 RAGFlow 專業知識庫<br/>
              • 適合法律、學術、專業領域<br/>
              • 支援單庫、智能選擇、多庫搜索
            </div>
          )}
          
          {mode === 'hybrid' && (
            <div className="mt-2 text-xs text-muted-foreground">
              • 同時使用 Tavily 和 RAGFlow<br/>
              • 智能決定搜索策略<br/>
              • 合併網路和知識庫結果<br/>
              • 提供最全面的答案
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ModeSelector