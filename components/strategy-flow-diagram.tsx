/**
 * 策略流程圖組件
 * 可視化展示智能策略的決策流程
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertTriangle,
    ArrowDown,
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle,
    Globe,
    Search,
    Target,
    Zap
} from 'lucide-react'

interface FlowStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  type: 'input' | 'process' | 'decision' | 'output'
  color: string
}

const flowSteps: FlowStep[] = [
  {
    id: 'input',
    title: '用戶問題輸入',
    description: '接收用戶的查詢問題',
    icon: Search,
    type: 'input',
    color: 'bg-gray-100 border-gray-300'
  },
  {
    id: 'analysis',
    title: '問題分析',
    description: '分析問題內容和複雜度',
    icon: Brain,
    type: 'process',
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'keyword',
    title: '關鍵詞檢測',
    description: '識別專業領域關鍵詞',
    icon: Target,
    type: 'process',
    color: 'bg-purple-100 border-purple-300'
  },
  {
    id: 'strategy',
    title: '策略決策',
    description: '選擇最適合的搜索策略',
    icon: CheckCircle,
    type: 'decision',
    color: 'bg-green-100 border-green-300'
  }
]

const strategies = [
  {
    id: 'knowledge-first',
    title: '知識庫優先',
    icon: BookOpen,
    color: 'bg-green-50 border-green-200',
    steps: [
      '搜索 RAGFlow 知識庫',
      '評估結果置信度',
      '如需要，補充網路搜索',
      '返回專業權威答案'
    ]
  },
  {
    id: 'web-first',
    title: '網路優先',
    icon: Globe,
    color: 'bg-blue-50 border-blue-200',
    steps: [
      '執行 Tavily 深度搜索',
      '獲取最新網路資訊',
      '補充知識庫背景',
      '返回即時準確答案'
    ]
  },
  {
    id: 'hybrid',
    title: '混合搜索',
    icon: Zap,
    color: 'bg-purple-50 border-purple-200',
    steps: [
      '並行執行雙重搜索',
      '智能合併搜索結果',
      '優化答案完整性',
      '返回全面綜合答案'
    ]
  }
]

export function StrategyFlowDiagram() {
  return (
    <div className="space-y-8">
      {/* 主流程 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            智能策略決策流程
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            {flowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.id} className="flex flex-col items-center">
                  {/* 步驟卡片 */}
                  <div className={`
                    p-4 rounded-lg border-2 w-64 text-center
                    ${step.color}
                  `}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{step.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* 箭頭 */}
                  {index < flowSteps.length - 1 && (
                    <ArrowDown className="h-6 w-6 text-muted-foreground my-2" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 策略分支 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            策略執行分支
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            根據問題特徵選擇對應的執行策略
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {strategies.map((strategy) => {
              const Icon = strategy.icon
              return (
                <div key={strategy.id} className="space-y-4">
                  {/* 策略標題 */}
                  <div className={`
                    p-4 rounded-lg border-2 text-center
                    ${strategy.color}
                  `}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{strategy.title}</span>
                    </div>
                  </div>
                  
                  {/* 執行步驟 */}
                  <div className="space-y-2">
                    {strategy.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                          {stepIndex + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 關鍵詞觸發規則 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            關鍵詞觸發規則
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* 法律關鍵詞 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span className="font-medium">法律專業</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">知識庫優先</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['法律', '法規', '條文', '判決', '憲法', '民法', '刑法', '契約'].map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 時事關鍵詞 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">時事新聞</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">網路優先</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['最新', '今天', '現在', '新聞', '時事', '2024', '2025', '近期'].map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 技術關鍵詞 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">技術科學</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">混合搜索</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['AI', '人工智能', '機器學習', '區塊鏈', '程式設計', '軟體開發'].map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* 複雜度分析 */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                問題複雜度分析因素
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">簡單問題 (基礎搜索):</span>
                  <ul className="list-disc list-inside mt-1 text-muted-foreground">
                    <li>問題長度 &lt; 50 字</li>
                    <li>單一問號</li>
                    <li>直接查詢</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium">複雜問題 (深度搜索):</span>
                  <ul className="list-disc list-inside mt-1 text-muted-foreground">
                    <li>問題長度 &gt; 100 字</li>
                    <li>多個問號或連接詞</li>
                    <li>包含分析性詞彙</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StrategyFlowDiagram