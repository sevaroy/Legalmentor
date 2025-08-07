'use client'

import { animated, useSpring } from '@react-spring/web'
import { ReactNode, useEffect, useState } from 'react'

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

// 按鈕懸停動畫
interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function AnimatedButton({ 
  children, 
  onClick, 
  className = '' 
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const styles = useSpring({
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered 
      ? '0 10px 25px rgba(0,0,0,0.1)' 
      : '0 2px 10px rgba(0,0,0,0.05)',
    config: { tension: 300, friction: 30 }
  })

  return (
    <animated.button
      style={styles}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </animated.button>
  )
}

// 載入骨架動畫
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  )
}