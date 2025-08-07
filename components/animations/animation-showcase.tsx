'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import {
    FadeIn,
    LoadingDots,
    SlideIn,
    StaggerChildren,
    TypingAnimation
} from './index'
import {
    TailwindBounce,
    TailwindFadeIn,
    TailwindPulse,
    TailwindScaleIn,
    TailwindSlideIn,
    TailwindSpin,
    TailwindWiggle
} from './tailwind-animations'

export function AnimationShowcase() {
  const [showAnimations, setShowAnimations] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">動畫效果展示</h1>
        <Button 
          onClick={() => setShowAnimations(!showAnimations)}
          className="mb-8"
        >
          {showAnimations ? '重置動畫' : '播放動畫'}
        </Button>
      </div>

      {showAnimations && (
        <>
          {/* React Spring 動畫 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">React Spring 動畫</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FadeIn delay={0}>
                <Card>
                  <CardHeader>
                    <CardTitle>淡入效果</CardTitle>
                    <CardDescription>FadeIn 組件</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>這是一個淡入動畫效果</p>
                  </CardContent>
                </Card>
              </FadeIn>

              <SlideIn direction="left" delay={200}>
                <Card>
                  <CardHeader>
                    <CardTitle>左滑入</CardTitle>
                    <CardDescription>SlideIn 組件</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>從左側滑入的動畫</p>
                  </CardContent>
                </Card>
              </SlideIn>

              <SlideIn direction="right" delay={400}>
                <Card>
                  <CardHeader>
                    <CardTitle>右滑入</CardTitle>
                    <CardDescription>SlideIn 組件</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>從右側滑入的動畫</p>
                  </CardContent>
                </Card>
              </SlideIn>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>打字機效果</CardTitle>
              </CardHeader>
              <CardContent>
                <TypingAnimation 
                  text="這是一個打字機動畫效果，文字會逐個顯示出來..."
                  speed={100}
                  className="text-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>載入動畫</CardTitle>
              </CardHeader>
              <CardContent className="flex space-x-4 items-center">
                <LoadingDots size="sm" />
                <LoadingDots size="md" />
                <LoadingDots size="lg" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>錯開動畫</CardTitle>
              </CardHeader>
              <CardContent>
                <StaggerChildren staggerDelay={150}>
                  <div className="p-2 bg-blue-100 rounded mb-2">項目 1</div>
                  <div className="p-2 bg-green-100 rounded mb-2">項目 2</div>
                  <div className="p-2 bg-yellow-100 rounded mb-2">項目 3</div>
                  <div className="p-2 bg-red-100 rounded mb-2">項目 4</div>
                </StaggerChildren>
              </CardContent>
            </Card>
          </section>

          {/* Tailwind CSS 動畫 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Tailwind CSS 動畫</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TailwindFadeIn>
                <Card className="h-32 flex items-center justify-center">
                  <p>淡入</p>
                </Card>
              </TailwindFadeIn>

              <TailwindSlideIn>
                <Card className="h-32 flex items-center justify-center">
                  <p>滑入</p>
                </Card>
              </TailwindSlideIn>

              <TailwindScaleIn>
                <Card className="h-32 flex items-center justify-center">
                  <p>縮放</p>
                </Card>
              </TailwindScaleIn>

              <Card className="h-32 flex items-center justify-center">
                <TailwindBounce>
                  <p>彈跳</p>
                </TailwindBounce>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="h-32 flex items-center justify-center">
                <TailwindPulse>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </TailwindPulse>
              </Card>

              <Card className="h-32 flex items-center justify-center">
                <TailwindSpin>
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </TailwindSpin>
              </Card>

              <Card className="h-32 flex items-center justify-center">
                <TailwindWiggle>
                  <p>搖擺</p>
                </TailwindWiggle>
              </Card>
            </div>

            {/* 自定義 Tailwind 動畫 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="h-32 flex items-center justify-center">
                <div className="animate-float">
                  <p>浮動效果</p>
                </div>
              </Card>

              <Card className="h-32 flex items-center justify-center">
                <div className="animate-glow p-4 rounded">
                  <p>發光效果</p>
                </div>
              </Card>

              <Card className="h-32 flex items-center justify-center overflow-hidden">
                <div className="animate-typewriter whitespace-nowrap overflow-hidden border-r-2 border-blue-500">
                  <p>打字機效果</p>
                </div>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  )
}