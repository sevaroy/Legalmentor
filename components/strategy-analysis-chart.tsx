/**
 * 策略分析圖表組件
 * 可視化展示不同問題類型的策略分佈
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
    BarChart3,
    BookOpen,
    Globe,
    PieChart,
    TrendingUp,
    Zap
} from 'lucide-react'

interface StrategyStats {
  strategy: 'knowledge-first' | 'web-first' | 'hybrid'
  count: number
  percentage: number
  examples: string[]
}

interface CategoryStats {
  category: string
  icon: React.ComponentType<any>
  color: string
  strategies: StrategyStats[]
  totalQuestions: number
}

const mockData: CategoryStats[] = [
  {
    category: '法律專業',
    icon: BookOpen,
    color: 'text-green-600',
    totalQuestions: 45,
    strategies: [
      {
        strategy: 'knowledge-first',
        count: 42,
        percentage: 93.3,
        examples: ['民法契約條文', '憲法解釋', '刑法構成要件']
      },
      {
        strategy: 'hybrid',
        count: 3,
        percentage: 6.7,
        examples: ['法律科技應用', '國際法比較']
      },
      {
        strategy: 'web-first',
        count: 0,
        percentage: 0,
        examples: []
      }
    ]
  },
  {
    category: '時事新聞',
    icon: Globe,
    color: 'text-blue-600',
    totalQuestions: 38,
    strategies: [
      {
        strategy: 'web-first',
        count: 35,
        percentage: 92.1,
        examples: ['今日股市', '最新政策', '即時新聞']
      },
      {
        strategy: 'hybrid',
        count: 3,
        percentage: 7.9,
        examples: ['政策法律影響', '新聞背景分析']
      },
      {
        strategy: 'knowledge-first',
        count: 0,
        percentage: 0,
        examples: []
      }
    ]
  },
  {
    category: '技術科學',
    icon: Zap,
    color: 'text-purple-600',
    totalQuestions: 52,
    strategies: [
      {
        strategy: 'hybrid',
        count: 31,
        percentage: 59.6,
        examples: ['AI應用', '區塊鏈技術', '科學研究']
      },
      {
        strategy: 'web-first',
        count: 12,
        percentage: 23.1,
        examples: ['最新技術趨勢', '產品發布']
      },
      {
        strategy: 'knowledge-first',
        count: 9,
        percentage: 17.3,
        examples: ['基礎科學原理', '技術標準']
      }
    ]
  },
  {
    category: '綜合問題',
    icon: BarChart3,
    color: 'text-gray-600',
    totalQuestions: 65,
    strategies: [
      {
        strategy: 'hybrid',
        count: 48,
        percentage: 73.8,
        examples: ['生活常識', '學習建議', '綜合分析']
      },
      {
        strategy: 'web-first',
        count: 10,
        percentage: 15.4,
        examples: ['購物推薦', '旅遊資訊']
      },
      {
        strategy: 'knowledge-first',
        count: 7,
        percentage: 10.8,
        examples: ['學術概念', '專業定義']
      }
    ]
  }
]

const strategyConfig = {
  'knowledge-first': {
    label: '知識庫優先',
    color: 'bg-green-500',
    icon: BookOpen
  },
  'web-first': {
    label: '網路優先',
    color: 'bg-blue-500',
    icon: Globe
  },
  'hybrid': {
    label: '混合搜索',
    color: 'bg-purple-500',
    icon: Zap
  }
}

export function StrategyAnalysisChart() {
  const totalQuestions = mockData.reduce((sum, category) => sum + category.totalQuestions, 0)
  
  // 計算整體策略分佈
  const overallStats = {
    'knowledge-first': 0,
    'web-first': 0,
    'hybrid': 0
  }
  
  mockData.forEach(category => {
    category.strategies.forEach(strategy => {
      overallStats[strategy.strategy] += strategy.count
    })
  })

  return (
    <div className="space-y-6">
      {/* 整體統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            整體策略分佈統計
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            基於 {totalQuestions} 個問題的分析結果
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(overallStats).map(([strategy, count]) => {
              const config = strategyConfig[strategy as keyof typeof strategyConfig]
              const percentage = (count / totalQuestions) * 100
              const Icon = config.icon
              
              return (
                <div key={strategy} className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{count}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {percentage.toFixed(1)}%
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 分類詳細統計 */}
      <div className="grid gap-4">
        {mockData.map((category) => {
          const CategoryIcon = category.icon
          
          return (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CategoryIcon className={`h-5 w-5 ${category.color}`} />
                  {category.category}
                  <Badge variant="secondary" className="ml-auto">
                    {category.totalQuestions} 個問題
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.strategies
                    .filter(strategy => strategy.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .map((strategy) => {
                      const config = strategyConfig[strategy.strategy]
                      const StrategyIcon = config.icon
                      
                      return (
                        <div key={strategy.strategy} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StrategyIcon className="h-4 w-4" />
                              <span className="font-medium text-sm">
                                {config.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {strategy.count}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {strategy.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          
                          <Progress 
                            value={strategy.percentage} 
                            className="h-2"
                          />
                          
                          {strategy.examples.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">典型問題: </span>
                              {strategy.examples.slice(0, 3).join('、')}
                              {strategy.examples.length > 3 && '...'}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 策略效果分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            策略效果分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">策略準確性</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>法律問題 → 知識庫優先</span>
                  <Badge variant="secondary">93.3% 準確</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>時事問題 → 網路優先</span>
                  <Badge variant="secondary">92.1% 準確</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>技術問題 → 混合搜索</span>
                  <Badge variant="secondary">59.6% 準確</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">用戶滿意度</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>知識庫優先策略</span>
                  <div className="flex items-center gap-1">
                    <Progress value={88} className="w-16 h-2" />
                    <span className="text-xs">88%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>網路優先策略</span>
                  <div className="flex items-center gap-1">
                    <Progress value={85} className="w-16 h-2" />
                    <span className="text-xs">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>混合搜索策略</span>
                  <div className="flex items-center gap-1">
                    <Progress value={91} className="w-16 h-2" />
                    <span className="text-xs">91%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StrategyAnalysisChart