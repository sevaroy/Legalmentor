'use client'

import { cn } from '@/lib/utils/index'
import { ReactNode } from 'react'

// 增強的容器組件
export function EnhancedContainer({ 
  children, 
  className,
  variant = 'default'
}: {
  children: ReactNode
  className?: string
  variant?: 'default' | 'chat' | 'search' | 'sidebar'
}) {
  const variants = {
    default: 'max-w-4xl mx-auto px-4',
    chat: 'max-w-3xl mx-auto px-4',
    search: 'max-w-5xl mx-auto px-6',
    sidebar: 'w-full px-3'
  }

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  )
}

// 增強的卡片組件
export function EnhancedCard({
  children,
  className,
  variant = 'default',
  interactive = false
}: {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  interactive?: boolean
}) {
  const variants = {
    default: 'bg-card border border-border rounded-lg shadow-sm',
    elevated: 'bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-shadow',
    outlined: 'bg-transparent border-2 border-border rounded-lg hover:border-primary/50 transition-colors',
    glass: 'bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg'
  }

  const interactiveStyles = interactive 
    ? 'hover:scale-[1.02] transition-transform cursor-pointer' 
    : ''

  return (
    <div className={cn(variants[variant], interactiveStyles, className)}>
      {children}
    </div>
  )
}