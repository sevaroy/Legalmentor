/**
 * 數據集選擇組件
 * 允許用戶選擇要搜索的知識庫
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RAGFlowDataset } from '@/lib/types/ragflow'
import {
    AlertCircle,
    BookOpen,
    FileText,
    RefreshCw
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DatasetSelectorProps {
  selectedDataset?: RAGFlowDataset | null
  onDatasetChange: (dataset: RAGFlowDataset | null) => void
  disabled?: boolean
  className?: string
}

export function DatasetSelector({ 
  selectedDataset, 
  onDatasetChange, 
  disabled = false,
  className = '' 
}: DatasetSelectorProps) {
  const [datasets, setDatasets] = useState<RAGFlowDataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // 載入數據集列表
  const loadDatasets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/datasets')
      const data = await response.json()
      
      if (data.success) {
        setDatasets(data.data)
        
        // 如果沒有選中的數據集，自動選擇第一個
        if (!selectedDataset && data.data.length > 0) {
          onDatasetChange(data.data[0])
        }
      } else {
        setError(data.error || '載入知識庫失敗')
      }
    } catch (err) {
      setError('網路連接錯誤')
      console.error('Failed to load datasets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDatasets()
  }, [])

  // 格式化文檔數量
  const formatDocCount = (count: number) => {
    if (count === 0) return '無文檔'
    if (count === 1) return '1 個文檔'
    return `${count} 個文檔`
  }

  // 載入中狀態
  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">載入知識庫...</span>
      </div>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadDatasets}
          className="h-8"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          重試
        </Button>
      </div>
    )
  }

  // 沒有數據集
  if (datasets.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">沒有可用的知識庫</p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 主要選擇器 */}
      <div className="flex items-center gap-2">
        <Select
          value={selectedDataset?.id || ''}
          onValueChange={(value) => {
            const dataset = datasets.find(d => d.id === value)
            onDatasetChange(dataset || null)
          }}
          disabled={disabled}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="選擇知識庫">
              {selectedDataset && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="truncate">{selectedDataset.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {formatDocCount(selectedDataset.document_count)}
                  </Badge>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {datasets.map((dataset) => (
              <SelectItem key={dataset.id} value={dataset.id}>
                <div className="flex items-center gap-2 w-full">
                  <BookOpen className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{dataset.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDocCount(dataset.document_count)}
                      {dataset.chunk_count && ` • ${dataset.chunk_count} 片段`}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 重新載入按鈕 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={loadDatasets}
          className="h-8 w-8 p-0"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        {/* 詳情按鈕 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="h-8 w-8 p-0"
          disabled={!selectedDataset}
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      {/* 詳細資訊 */}
      {showDetails && selectedDataset && (
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {selectedDataset.name}
            </CardTitle>
            {selectedDataset.description && (
              <CardDescription className="text-xs">
                {selectedDataset.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">文檔數量：</span>
                <span className="font-medium">{selectedDataset.document_count}</span>
              </div>
              {selectedDataset.chunk_count && (
                <div>
                  <span className="text-muted-foreground">片段數量：</span>
                  <span className="font-medium">{selectedDataset.chunk_count}</span>
                </div>
              )}
              {selectedDataset.token_num && (
                <div>
                  <span className="text-muted-foreground">Token 數量：</span>
                  <span className="font-medium">{selectedDataset.token_num.toLocaleString()}</span>
                </div>
              )}
              {selectedDataset.create_time && (
                <div>
                  <span className="text-muted-foreground">創建時間：</span>
                  <span className="font-medium">
                    {new Date(selectedDataset.create_time).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DatasetSelector