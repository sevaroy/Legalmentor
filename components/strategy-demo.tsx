/**
 * 智能策略演示組件
 * 展示不同問題如何觸發不同的搜索策略
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle,
    Globe,
    Zap
} from 'lucide-react'
import { useState } from 'react'

type SearchStrategy = 'knowledge-first' | 'web-first' | 'hybrid'

interface StrategyResult {
  strategy: SearchStrategy
  confidence: number
  reasoning: string[]
  keywords: string[]
}

interface DemoExample {
  question: string
  expectedStrategy: SearchStrategy
  description: string
  category: string
}

const demoExamples: DemoExample[] = [
  {
    question: "民法中關於契約違約的責任規定是什麼？",
    expectedStrategy: "knowledge-first",
    description: "法律專業問題，需要權威準確的法條解釋",
    category: "法律專業"
  },
  {
    question: "2024年最新的AI法規政策有哪些？",
    expectedStrategy: "web-first", 
    description: "時事新聞問題，需要最新資訊",
    category: "時事新聞"
  },
  {
    question: "如何理解人工智能在醫療領域的應用？",
    expectedStrategy: "hybrid",
    description: "一般性問題，需要多角度資訊",
    category: "綜合問題"
  },
  {
    question: "憲法第一條的內容和意義是什麼？",
    expectedStrategy: "knowledge-first",
    description: "憲法條文查詢，需要專業知識庫",
    category: "法律專業"
  },
  {
    question: "今天台股的表現如何？",
    expectedStrategy: "web-first",
    description: "即時資訊查詢，需要最新數據",
    category: "時事新聞"
  }
]

const strategyConfig = {
  'knowledge-first': {
    icon: BookOpen,
    label: '知識庫優先',
    color: 'bg-green-500',
    description: '優先搜索專業知識庫，必要時補充網路搜索'
  },
  'web-first': {
    icon: Globe,
    label: '網路優先', 
    color: 'bg-blue-500',
    description: '優先搜索網路資訊，補充知識庫內容'
  },
  'hybrid': {
    icon: Zap,
    label: '混合搜索',
    color: 'bg-purple-500', 
    description: '同時進行網路和知識庫搜索，智能合併結果'
  }
}

export function StrategyDemo() {
  const [inputQuestion, setInputQuestion] = useState('')
  const [analysisResult, setAnalysisResult] = useState<StrategyResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // 模擬策略分析邏輯
  const analyzeStrategy = (question: string): StrategyResult => {
    const questionLower = question.toLowerCase()
    const detectedKeywords: string[] = []
    const reasoning: string[] = []

    // 法律專業關鍵詞
    const legalKeywords = ['法律', '法規', '條文', '判決', '憲法', '民法', '刑法', '商法', '行政法', '契約', '侵權', '物權', '債權']
    const foundLegalKeywords = legalKeywords.filter(keyword => questionLower.includes(keyword))
    
    if (foundLegalKeywords.length > 0) {
      detectedKeywords.push(...foundLegalKeywords)
      reasoning.push(`檢測到法律專業關鍵詞: ${foundLegalKeywords.join(', ')}`)
      reasoning.push('法律問題需要權威準確的專業知識')
      return {
        strategy: 'knowledge-first',
        confidence: 0.85 + (foundLegalKeywords.length * 0.05),
        reasoning,
        keywords: detectedKeywords
      }
    }

    // 時事新聞關鍵詞
    const currentKeywords = ['最新', '今天', '現在', '新聞', '時事', '2024', '2025', '近期', '最近', '剛剛']
    const foundCurrentKeywords = currentKeywords.filter(keyword => questionLower.includes(keyword))
    
    if (foundCurrentKeywords.length > 0) {
      detectedKeywords.push(...foundCurrentKeywords)
      reasoning.push(`檢測到時事相關關鍵詞: ${foundCurrentKeywords.join(', ')}`)
      reasoning.push('時事問題需要最新的網路資訊')
      return {
        strategy: 'web-first',
        confidence: 0.80 + (foundCurrentKeywords.length * 0.05),
        reasoning,
        keywords: detectedKeywords
      }
    }

    // 技術專業關鍵詞
    const techKeywords = ['AI', '人工智能', '機器學習', '深度學習', '區塊鏈', '加密貨幣']
    const foundTechKeywords = techKeywords.filter(keyword => questionLower.includes(keyword))
    
    if (foundTechKeywords.length > 0) {
      detectedKeywords.push(...foundTechKeywords)
      reasoning.push(`檢測到技術相關關鍵詞: ${foundTechKeywords.join(', ')}`)
    }

    // 默認混合搜索
    reasoning.push('沒有明確的專業或時事關鍵詞')
    reasoning.push('使用混合搜索策略獲得全面資訊')
    
    return {
      strategy: 'hybrid',
      confidence: 0.70,
      reasoning,
      keywords: detectedKeywords
    }
  }

  const handleAnalyze = async () => {
    if (!inputQuestion.trim()) return
    
    setIsAnalyzing(true)
    
    // 模擬分析延遲
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = analyzeStrategy(inputQuestion)
    setAnalysisResult(result)
    setIsAnalyzing(false)
  }

  const handleExampleClick = (example: DemoExample) => {
    setInputQuestion(example.question)
    setAnalysisResult(null)
  }

  const currentStrategyConfig = analysisResult ? strategyConfig[analysisResult.strategy] : null
  const CurrentIcon = currentStrategyConfig?.icon

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Brain className="h-6 w-6" />
          智能策略演示
        </h2>
        <p className="text-muted-foreground">
          輸入問題，看看系統如何智能選擇最適合的搜索策略
        </p>
      </div>

      {/* 輸入區域 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">問題分析</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="輸入您的問題..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button 
              onClick={handleAnalyze}
              disabled={!inputQuestion.trim() || isAnalyzing}
            >
              {isAnalyzing ? '分析中...' : '分析策略'}
            </Button>
          </div>

          {/* 分析結果 */}
          {analysisResult && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {CurrentIcon && <CurrentIcon className="h-5 w-5" />}
                  <span className="font-medium text-lg">
                    推薦策略: {currentStrategyConfig?.label}
                  </span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  置信度: {Math.round(analysisResult.confidence * 100)}%
                </Badge>
              </div>

              <p className="text-muted-foreground">
                {currentStrategyConfig?.description}
              </p>

              {/* 檢測到的關鍵詞 */}
              {analysisResult.keywords.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">檢測到的關鍵詞:</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 推理過程 */}
              <div>
                <h4 className="font-medium mb-2">分析推理:</h4>
                <div className="space-y-1">
                  {analysisResult.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* 執行流程預覽 */}
              <div>
                <h4 className="font-medium mb-2">執行流程預覽:</h4>
                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  {analysisResult.strategy === 'knowledge-first' && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-500 rounded-full text-xs flex items-center justify-center text-white">1</span>
                        <span>搜索 RAGFlow 知識庫</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-gray-400 rounded-full text-xs flex items-center justify-center text-white">2</span>
                        <span>評估結果置信度</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                        <span>如需要，補充 Tavily 網路搜索</span>
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.strategy === 'web-first' && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white">1</span>
                        <span>執行 Tavily 深度網路搜索</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-500 rounded-full text-xs flex items-center justify-center text-white">2</span>
                        <span>補充 RAGFlow 知識庫搜索</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                        <span>合併結果，以網路搜索為主</span>
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.strategy === 'hybrid' && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">1</span>
                        <span>並行執行網路搜索和知識庫搜索</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-gray-400 rounded-full text-xs flex items-center justify-center text-white">2</span>
                        <span>智能合併兩種搜索結果</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                        <span>根據配置決定結果優先級</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 示例問題 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">示例問題</CardTitle>
          <p className="text-sm text-muted-foreground">
            點擊下面的示例問題，看看不同類型的問題如何觸發不同的策略
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {demoExamples.map((example, index) => {
              const strategyConfig = strategyConfig[example.expectedStrategy]
              const StrategyIcon = strategyConfig.icon
              
              return (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleExampleClick(example)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <StrategyIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">
                        {example.question}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {example.description}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {example.category}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                          {strategyConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 策略說明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">策略說明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(strategyConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StrategyDemo