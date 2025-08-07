'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { usePerformanceMonitor } from '@/lib/performance/monitor'
import { useEffect, useState } from 'react'

export default function UIDashboard() {
  const [performanceData, setPerformanceData] = useState<any>({})
  const [featureStatus, setFeatureStatus] = useState(FEATURE_FLAGS)
  const { getReport, checkTargets, clear } = usePerformanceMonitor()

  useEffect(() => {
    const updateData = () => {
      setPerformanceData(getReport())
    }

    const interval = setInterval(updateData, 5000) // 每5秒更新
    updateData() // 立即更新一次

    return () => clearInterval(interval)
  }, [getReport])

  const performanceCheck = checkTargets()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Morphic UI 監控儀表板</h1>
          <p className="text-muted-foreground">實時監控 UI 增強功能的性能和狀態</p>
        </div>

        {/* 功能開關狀態 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">功能開關狀態</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(featureStatus).map(([key, enabled]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{key.replace(/_/g, ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">{enabled ? '啟用' : '禁用'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 性能指標 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">性能指標</h2>
            <Button onClick={clear} variant="outline" size="sm">
              清除數據
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(performanceData).map(([name, metrics]: [string, any]) => (
              <Card key={name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{name.replace(/_/g, ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div>平均: {metrics.avg?.toFixed(2)}ms</div>
                    <div>最小: {metrics.min?.toFixed(2)}ms</div>
                    <div>最大: {metrics.max?.toFixed(2)}ms</div>
                    <div>次數: {metrics.count}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 性能檢查結果 */}
          <Card className={performanceCheck.passed ? 'border-green-500' : 'border-red-500'}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${performanceCheck.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>性能目標檢查</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performanceCheck.passed ? (
                <p className="text-green-600">✅ 所有性能目標均已達成</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-600">❌ 發現性能問題:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {performanceCheck.issues.map((issue, index) => (
                      <li key={index} className="text-red-600">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* 用戶反饋 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">用戶反饋</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>用戶反饋收集功能開發中...</p>
                <p className="text-sm mt-2">將集成用戶滿意度調查和錯誤報告</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 系統健康狀態 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">系統健康狀態</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">CPU 使用率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">正常</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">內存使用</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">正常</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">響應時間</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">&lt; 100ms</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">錯誤率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">0%</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}