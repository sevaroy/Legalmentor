'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { ReactNode, useEffect, useState } from 'react'

// AI 思考動畫
export function AIThinkingAnimation({ className }: { className?: string }) {
  const dots = [0, 1, 2]
  
  const Dot = ({ delay }: { delay: number }) => {
    const styles = useSpring({
      from: { opacity: 0.3, transform: 'scale(0.8)' },
      to: async (next) => {
        while (true) {
          await next({ opacity: 1, transform: 'scale(1.2)' })
          await next({ opacity: 0.3, transform: 'scale(0.8)' })
        }
      },
      config: { duration: 800 },
      delay
    })

    return (
      <animated.div 
        style={styles}
        className="w-2 h-2 bg-primary rounded-full"
      />
    )
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm text-muted-foreground">AI 正在思考</span>
      <div className="flex space-x-1">
        {dots.map((_, index) => (
          <Dot key={index} delay={index * 200} />
        ))}
      </div>
    </div>
  )
}

// 搜索進度動畫
interface SearchProgressProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function SearchProgressAnimation({ 
  steps, 
  currentStep, 
  className 
}: SearchProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className={cn(
              'w-4 h-4 rounded-full border-2 transition-all duration-300',
              isCompleted 
                ? 'bg-green-500 border-green-500' 
                : isActive 
                  ? 'border-primary animate-pulse' 
                  : 'border-muted-foreground/30'
            )}>
              {isCompleted && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <span className={cn(
              'text-sm transition-colors duration-300',
              isActive 
                ? 'text-primary font-medium' 
                : isCompleted 
                  ? 'text-green-600' 
                  : 'text-muted-foreground'
            )}>
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// 結果計數動畫
interface ResultCounterProps {
  count: number
  label: string
  duration?: number
}

export function ResultCounterAnimation({ 
  count, 
  label, 
  duration = 1000 
}: ResultCounterProps) {
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = count / (duration / 16) // 60fps
    
    const timer = setInterval(() => {
      start += increment
      if (start >= count) {
        setDisplayCount(count)
        clearInterval(timer)
      } else {
        setDisplayCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [count, duration])

  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-primary">
        {displayCount.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

// 搜索波紋動畫
export function SearchRippleAnimation({ 
  isActive, 
  children 
}: { 
  isActive: boolean
  children: ReactNode 
}) {
  const rippleStyles = useSpring({
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    boxShadow: isActive 
      ? '0 0 0 4px rgba(59, 130, 246, 0.3)' 
      : '0 0 0 0px rgba(59, 130, 246, 0)',
    config: { tension: 300, friction: 30 }
  })

  return (
    <animated.div style={rippleStyles} className="rounded-lg">
      {children}
    </animated.div>
  )
}

// 模型切換動畫
interface ModelSwitchProps {
  currentModel: string
  isChanging: boolean
}

export function ModelSwitchAnimation({ 
  currentModel, 
  isChanging 
}: ModelSwitchProps) {
  const styles = useSpring({
    opacity: isChanging ? 0.5 : 1,
    transform: isChanging ? 'scale(0.95)' : 'scale(1)',
    config: { tension: 300, friction: 30 }
  })

  return (
    <animated.div style={styles} className="flex items-center space-x-2">
      <div className={cn(
        'w-2 h-2 rounded-full',
        isChanging ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
      )} />
      <span className="text-sm font-medium">{currentModel}</span>
      {isChanging && (
        <div className="text-xs text-muted-foreground">切換中...</div>
      )}
    </animated.div>
  )
}

// 搜索建議動畫
interface SearchSuggestionProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function SearchSuggestionsAnimation({ 
  suggestions, 
  onSelect 
}: SearchSuggestionProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (suggestions.length > visibleCount) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 1, suggestions.length))
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [suggestions.length, visibleCount])

  return (
    <div className="space-y-2">
      {suggestions.slice(0, visibleCount).map((suggestion, index) => (
        <div
          key={index}
          className="animate-in slide-in-from-left-4 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <button
            onClick={() => onSelect(suggestion)}
            className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
          >
            {suggestion}
          </button>
        </div>
      ))}
    </div>
  )
}