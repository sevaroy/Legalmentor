'use client'

import { ReactNode, useEffect, useState } from 'react'

import { animated, useSpring } from '@react-spring/web'

// 消息氣泡動畫
interface MessageBubbleProps {
  children: ReactNode
  isUser?: boolean
  delay?: number
}

export function AnimatedMessageBubble({ 
  children, 
  isUser = false, 
  delay = 0 
}: MessageBubbleProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateY(0px) scale(1)' 
      : 'translateY(20px) scale(0.95)',
    config: { tension: 300, friction: 30 }
  })

  return (
    <animated.div 
      style={styles}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {children}
    </animated.div>
  )
}

// 打字指示器
export function TypingIndicator() {
  const dots = [0, 1, 2]
  
  const Dot = ({ delay }: { delay: number }) => {
    const styles = useSpring({
      from: { opacity: 0.3, transform: 'translateY(0px)' },
      to: async (next) => {
        while (true) {
          await next({ opacity: 1, transform: 'translateY(-5px)' })
          await next({ opacity: 0.3, transform: 'translateY(0px)' })
        }
      },
      config: { duration: 600 },
      delay
    })

    return (
      <animated.div 
        style={styles}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
    )
  }

  return (
    <div className="flex space-x-1 items-center p-3 bg-gray-100 rounded-lg max-w-16">
      {dots.map((_, index) => (
        <Dot key={index} delay={index * 200} />
      ))}
    </div>
  )
}

// 搜索結果動畫
interface SearchResultProps {
  children: ReactNode
  index: number
}

export function AnimatedSearchResult({ children, index }: SearchResultProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateX(0px)' 
      : 'translateX(-30px)',
    config: { tension: 280, friction: 60 }
  })

  return (
    <animated.div style={styles}>
      {children}
    </animated.div>
  )
}

// 按鈕懸停動畫 - 增強版
interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'subtle' | 'bounce'
}

export function AnimatedButton({
  children,
  onClick,
  className = '',
  variant = 'default'
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const getAnimationConfig = () => {
    switch (variant) {
      case 'subtle':
        return {
          transform: isPressed
            ? 'scale(0.97)'
            : isHovered
            ? 'scale(1.02)'
            : 'scale(1)',
          boxShadow: isHovered
            ? '0 4px 12px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          config: { tension: 280, friction: 60 }
        }
      case 'bounce':
        return {
          transform: isPressed
            ? 'scale(0.95)'
            : isHovered
            ? 'scale(1.1)'
            : 'scale(1)',
          boxShadow: isHovered
            ? '0 12px 28px rgba(0,0,0,0.12)'
            : '0 2px 8px rgba(0,0,0,0.05)',
          config: { tension: 400, friction: 17 }
        }
      default:
        return {
          transform: isPressed
            ? 'scale(0.96)'
            : isHovered
            ? 'scale(1.05)'
            : 'scale(1)',
          boxShadow: isHovered
            ? '0 10px 25px rgba(0,0,0,0.1)'
            : '0 2px 10px rgba(0,0,0,0.05)',
          config: { tension: 300, friction: 30 }
        }
    }
  }

  const styles = useSpring(getAnimationConfig())

  return (
    <animated.button
      style={styles}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {children}
    </animated.button>
  )
}

// 載入骨架動畫
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  )
}

// 卡片懸停動畫
interface AnimatedCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AnimatedCard({ children, className = '', onClick }: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const styles = useSpring({
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
    boxShadow: isHovered
      ? '0 12px 24px rgba(0,0,0,0.12)'
      : '0 2px 8px rgba(0,0,0,0.06)',
    config: { tension: 280, friction: 60 }
  })

  return (
    <animated.div
      style={styles}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </animated.div>
  )
}

// 漸入漸出容器
interface FadeContainerProps {
  children: ReactNode
  isVisible: boolean
  className?: string
}

export function FadeContainer({ children, isVisible, className = '' }: FadeContainerProps) {
  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    config: { tension: 280, friction: 60 }
  })

  return (
    <animated.div style={styles} className={className}>
      {children}
    </animated.div>
  )
}

// 數字滾動動畫
interface AnimatedNumberProps {
  value: number
  className?: string
}

export function AnimatedNumber({ value, className = '' }: AnimatedNumberProps) {
  const { number } = useSpring({
    number: value,
    from: { number: 0 },
    config: { tension: 180, friction: 12 }
  })

  return (
    <animated.span className={className}>
      {number.to(n => Math.floor(n))}
    </animated.span>
  )
}

// 進度條動畫
interface AnimatedProgressProps {
  progress: number // 0-100
  className?: string
}

export function AnimatedProgress({ progress, className = '' }: AnimatedProgressProps) {
  const styles = useSpring({
    width: `${Math.min(100, Math.max(0, progress))}%`,
    config: { tension: 280, friction: 60 }
  })

  return (
    <div className={`h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <animated.div
        style={styles}
        className="h-full bg-primary rounded-full"
      />
    </div>
  )
}