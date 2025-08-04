/**
 * 混合搜索配置組件
 * 配置 Tavily 網路搜索和 RAGFlow 知識庫搜索的參數
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    Globe,
    Info,
    Settings,
    Zap
} from 'lucide-react'
import { useState } from 'react'

export type HybridSearchMode = 'hybrid' | 'intelligent' | 'knowledge-first' | 'web-first'

export interface HybridSearchConfig {
  searchMode: HybridSearchMode
  webSearchDepth: 'basic' | 'advanced'
  webMaxResults: number
  includeDomains: string[]
  excludeDomains: string[]
  prioritizeKnowledge: boolean
  combineResults: boolean
  datasetId?: string
}

interface HybridSearchConfigProps {
  config: HybridSearchConfig
  onConfigChange: (config: HybridSearchConfig) => void
  disabled?: boolean
  className?: string
}

const searchModeConfig = {
  hybrid: {
    icon: Zap,
    label: '標準混合',
    description: '同時進行網路和知識庫搜索',
    badge: '平衡'
  },
  intelligent: {
    icon: Settings,
    label: '智能策略',
    description: '根據問題類型自動選擇策略',
    badge: '智能'
  },
  'knowledge-first': {
    icon: BookOpen,
    label: '知識庫優先',
    description: '優先搜索知識庫，必要時補充網路搜索',
    badge: '專業'
  },
  'web-first': {
    icon: Globe,
    label: '網路優先',
    description: '優先搜索網路，補充知識庫內容',
    badge: '即時'
  }
}

export function HybridSearchConfig({ 
  config, 
  onConfigChange, 
  disabled = false,
  className = '' 
}: HybridSearchConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [domainInput, setDomainInput] = useState('')

  const updateConfig = (updates: Partial<HybridSearchConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  const addDomain = (type: 'include' | 'exclude') => {
    if (!domainInput.trim()) return
    
    const domain = domainInput.trim()
    if (type === 'include') {
      updateConfig({
        includeDomains: [...config.includeDomains, domain]
      })
    } else {
      updateConfig({
        excludeDomains: [...config.excludeDomains, domain]
      })
    }
    setDomainInput('')
  }

  const removeDomain = (domain: string, type: 'include' | 'exclude') => {
    if (type === 'include') {
      updateConfig({
        includeDomains: config.includeDomains.filter(d => d !== domain)
      })
    } else {
      updateConfig({
        excludeDomains: config.excludeDomains.filter(d => d !== domain)
      })
    }
  }

  const currentModeConfig = searchModeConfig[config.searchMode]
  const CurrentIcon = currentModeConfig.icon

  return (
    <TooltipProvider>
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              混合搜索配置
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8"
            >
              進階設定
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 搜索模式選擇 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">搜索策略</Label>
            <Select
              value={config.searchMode}
              onValueChange={(value: HybridSearchMode) => 
                updateConfig({ searchMode: value })
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <CurrentIcon className="h-4 w-4" />
                    <span>{currentModeConfig.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {currentModeConfig.badge}
                    </Badge>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(searchModeConfig).map(([key, modeConfig]) => {
                  const Icon = modeConfig.icon
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{modeConfig.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {modeConfig.description}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {modeConfig.badge}
                        </Badge>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* 基本配置 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Globe className="h-3 w-3" />
                網路搜索深度
              </Label>
              <Select
                value={config.webSearchDepth}
                onValueChange={(value: 'basic' | 'advanced') => 
                  updateConfig({ webSearchDepth: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">基礎搜索</SelectItem>
                  <SelectItem value="advanced">深度搜索</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">最大結果數</Label>
              <Input
                type="number"
                min="5"
                max="50"
                value={config.webMaxResults}
                onChange={(e) => 
                  updateConfig({ webMaxResults: parseInt(e.target.value) || 10 })
                }
                disabled={disabled}
                className="text-sm"
              />
            </div>
          </div>

          {/* 結果處理選項 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">優先知識庫結果</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>當同時有知識庫和網路搜索結果時，優先顯示知識庫內容</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={config.prioritizeKnowledge}
                onCheckedChange={(checked) => 
                  updateConfig({ prioritizeKnowledge: checked })
                }
                disabled={disabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">合併搜索結果</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>將網路搜索和知識庫結果合併成一個統一的答案</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={config.combineResults}
                onCheckedChange={(checked) => 
                  updateConfig({ combineResults: checked })
                }
                disabled={disabled}
              />
            </div>
          </div>

          {/* 進階設定 */}
          {showAdvanced && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">網域過濾設定</h4>
                
                {/* 域名輸入 */}
                <div className="flex gap-2">
                  <Input
                    placeholder="輸入網域名稱 (例: example.com)"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    disabled={disabled}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => addDomain('include')}
                    disabled={disabled || !domainInput.trim()}
                    variant="outline"
                  >
                    包含
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => addDomain('exclude')}
                    disabled={disabled || !domainInput.trim()}
                    variant="outline"
                  >
                    排除
                  </Button>
                </div>

                {/* 包含的域名 */}
                {config.includeDomains.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">包含的網域：</Label>
                    <div className="flex flex-wrap gap-1">
                      {config.includeDomains.map((domain) => (
                        <Badge
                          key={domain}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeDomain(domain, 'include')}
                        >
                          {domain} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 排除的域名 */}
                {config.excludeDomains.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">排除的網域：</Label>
                    <div className="flex flex-wrap gap-1">
                      {config.excludeDomains.map((domain) => (
                        <Badge
                          key={domain}
                          variant="destructive"
                          className="text-xs cursor-pointer hover:bg-muted"
                          onClick={() => removeDomain(domain, 'exclude')}
                        >
                          {domain} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 配置摘要 */}
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="font-medium mb-1">當前配置摘要：</div>
            <div className="text-muted-foreground space-y-1">
              <p>• 搜索策略: {currentModeConfig.label}</p>
              <p>• 網路搜索: {config.webSearchDepth === 'advanced' ? '深度搜索' : '基礎搜索'} ({config.webMaxResults} 個結果)</p>
              <p>• 結果處理: {config.combineResults ? '合併顯示' : '分別顯示'}</p>
              <p>• 優先級: {config.prioritizeKnowledge ? '知識庫優先' : '網路優先'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default HybridSearchConfig