'use client'

import { useEffect, useState } from 'react'

import { animated, useSpring } from '@react-spring/web'

import { cn } from '@/lib/utils/index'

// 智能載入動畫
interface SmartLoadingProps {
  stage: 'searching' | 'analyzing' | 'generating' | 'complete'
  progress?: number
  className?: string
}

export function SmartLoadingAnimation({ 
  stage, 
  progress = 0, 
  className 
}: SmartLoadingProps) {
  const stageMessages = {
    searching: '搜索相關資訊...',
    analyzing: '分析搜索結果...',
    generating: '生成回答...',
    complete: '完成'
  }

  const progressStyles = useSpring({
    width: `${progress}%`,
    config: { tension: 280, friction: 60 }
  })

  const pulseStyles = useSpring({
    from: { opacity: 0.5 },
    to: async (next) => {
      if (stage !== 'complete') {
        while (true) {
          await next({ opacity: 1 })
          await next({ opacity: 0.5 })
        }
      }
    },
    config: { duration: 1000 }
  })

  return (
    <div className={cn('space-y-3', className)}>
      <animated.div style={pulseStyles} className="flex items-center space-x-3">
        <div className={cn(
          'w-4 h-4 rounded-full',
          stage === 'complete' ? 'bg-green-500' : 'bg-primary animate-spin border-2 border-transparent border-t-current'
        )} />
        <span className="text-sm font-medium">
          {stageMessages[stage]}
        </span>
      </animated.div>
      
      {progress > 0 && (
        <div className="w-full bg-muted rounded-full h-2">
          <animated.div 
            style={progressStyles}
            className="bg-primary h-2 rounded-full transition-all duration-300"
          />
        </div>
      )}
    </div>
  )
}

// 搜索結果骨架動畫
export function SearchResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-muted rounded-full flex-shrink-0 mt-1" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 打字機載入動畫
interface TypewriterLoadingProps {
  messages: string[]
  speed?: number
  className?: string
}

export function TypewriterLoadingAnimation({ 
  messages, 
  speed = 100,
  className 
}: TypewriterLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      const currentMessage = messages[currentMessageIndex]
      
      if (currentCharIndex < currentMessage.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + currentMessage[currentCharIndex])
          setCurrentCharIndex(prev => prev + 1)
        }, speed)
        return () => clearTimeout(timer)
      } else {
        // 當前消息完成，等待一下然後切換到下一個
        const timer = setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1)
          setDisplayText('')
          setCurrentCharIndex(0)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [currentMessageIndex, currentCharIndex, messages, speed])

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm">{displayText}</span>
      <span className="animate-pulse text-primary">|</span>
    </div>
  )
}

// 網絡狀態動畫
interface NetworkStatusProps {
  status: 'connecting' | 'connected' | 'error' | 'offline'
  className?: string
}

export function NetworkStatusAnimation({ 
  status, 
  className 
}: NetworkStatusProps) {
  const statusConfig = {
    connecting: { color: 'bg-yellow-500', message: '連接中...', animate: true },
    connected: { color: 'bg-green-500', message: '已連接', animate: false },
    error: { color: 'bg-red-500', message: '連接錯誤', animate: true },
    offline: { color: 'bg-gray-500', message: '離線', animate: false }
  }

  const config = statusConfig[status]

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'w-2 h-2 rounded-full',
        config.color,
        config.animate && 'animate-pulse'
      )} />
      <span className="text-xs text-muted-foreground">
        {config.message}
      </span>
    </div>
  )
}