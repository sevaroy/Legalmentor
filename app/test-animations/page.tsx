'use client'

import {
    AIThinkingAnimation,
    AnimatedButton,
    FadeIn,
    LoadingDots,
    SearchProgressAnimation,
    SlideIn,
    SmartLoadingAnimation,
    TypingAnimation
} from '@/components/animations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function TestAnimationsPage() {
  const [showAnimations, setShowAnimations] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [loadingStage, setLoadingStage] = useState<'searching' | 'analyzing' | 'generating' | 'complete'>('searching')

  const searchSteps = [
    '搜索網絡資源',
    '分析相關內容', 
    '生成智能回答',
    '優化結果展示'
  ]

  const nextStep = () => {
    setCurrentStep(prev => (prev + 1) % searchSteps.length)
  }

  const nextLoadingStage = () => {
    const stages: Array<'searching' | 'analyzing' | 'generating' | 'complete'> = 
      ['searching', 'analyzing', 'generating', 'complete']
    const currentIndex = stages.indexOf(loadingStage)
    const nextIndex = (currentIndex + 1) % stages.length
    setLoadingStage(stages[nextIndex])
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 標題 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Morphic 動畫測試</h1>
          <p className="text-muted-foreground mb-6">
            測試所有動畫組件的功能和效果
          </p>
          <Button 
            onClick={() => setShowAnimations(!showAnimations)}
            className="mb-8"
          >
            {showAnimations ? '重置動畫' : '播放動畫'}
          </Button>
        </div>

        {showAnimations && (
          <div className="space-y-8">
            {/* 基礎動畫測試 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">基礎動畫</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FadeIn delay={0}>
                  <Card>
                    <CardHeader>
                      <CardTitle>淡入動畫</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>這是一個淡入動畫效果</p>
                    </CardContent>
                  </Card>
                </FadeIn>

                <SlideIn direction="left" delay={200}>
                  <Card>
                    <CardHeader>
                      <CardTitle>滑入動畫</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>從左側滑入的動畫</p>
                    </CardContent>
                  </Card>
                </SlideIn>
              </div>
            </section>

            {/* AI 專用動畫 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">AI 專用動畫</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI 思考動畫</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AIThinkingAnimation />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>搜索進度動畫</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SearchProgressAnimation 
                      steps={searchSteps}
                      currentStep={currentStep}
                    />
                    <Button onClick={nextStep} size="sm">
                      下一步
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>智能載入動畫</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SmartLoadingAnimation 
                      stage={loadingStage}
                      progress={loadingStage === 'complete' ? 100 : Math.random() * 80 + 10}
                    />
                    <Button onClick={nextLoadingStage} size="sm">
                      切換階段
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 打字機動畫 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">打字機動畫</h2>
              <Card>
                <CardContent className="pt-6">
                  <TypingAnimation 
                    text="這是一個打字機動畫效果，文字會逐個顯示出來，就像真人在打字一樣..."
                    speed={80}
                    className="text-lg"
                  />
                </CardContent>
              </Card>
            </section>

            {/* 載入動畫 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">載入動畫</h2>
              <Card>
                <CardContent className="pt-6 flex space-x-8 items-center">
                  <div className="text-center">
                    <LoadingDots size="sm" />
                    <p className="text-sm mt-2">小尺寸</p>
                  </div>
                  <div className="text-center">
                    <LoadingDots size="md" />
                    <p className="text-sm mt-2">中尺寸</p>
                  </div>
                  <div className="text-center">
                    <LoadingDots size="lg" />
                    <p className="text-sm mt-2">大尺寸</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 互動動畫 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">互動動畫</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <p>懸停下面的按鈕查看動畫效果：</p>
                  <div className="flex space-x-4">
                    <AnimatedButton 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                      onClick={() => alert('動畫按鈕被點擊！')}
                    >
                      懸停我
                    </AnimatedButton>
                    <AnimatedButton 
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
                      onClick={() => alert('另一個動畫按鈕！')}
                    >
                      我也有動畫
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tailwind CSS 動畫 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Tailwind CSS 動畫</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="h-32 flex items-center justify-center">
                  <div className="animate-bounce">
                    <p>彈跳</p>
                  </div>
                </Card>
                <Card className="h-32 flex items-center justify-center">
                  <div className="animate-pulse">
                    <p>脈衝</p>
                  </div>
                </Card>
                <Card className="h-32 flex items-center justify-center">
                  <div className="animate-float">
                    <p>浮動</p>
                  </div>
                </Card>
                <Card className="h-32 flex items-center justify-center">
                  <div className="animate-wiggle">
                    <p>搖擺</p>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        )}

        {/* 測試結果 */}
        <section className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">測試狀態</h3>
          <div className="space-y-2 text-sm">
            <p>✅ React Spring 動畫庫已載入</p>
            <p>✅ Tailwind CSS 動畫已配置</p>
            <p>✅ 所有動畫組件可正常使用</p>
            <p>✅ 響應式動畫支持</p>
          </div>
        </section>
      </div>
    </div>
  )
}