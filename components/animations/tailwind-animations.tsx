'use client'

import { ReactNode } from 'react'

import { cn } from '@/lib/utils/index'

interface AnimationProps {
  children: ReactNode
  className?: string
}

// 淡入動畫
export function TailwindFadeIn({ children, className }: AnimationProps) {
  return (
    <div className={cn('animate-in fade-in duration-500', className)}>
      {children}
    </div>
  )
}

// 滑入動畫
export function TailwindSlideIn({ children, className }: AnimationProps) {
  return (
    <div className={cn('animate-in slide-in-from-bottom-4 duration-500', className)}>
      {children}
    </div>
  )
}

// 縮放動畫
export function TailwindScaleIn({ children, className }: AnimationProps) {
  return (
    <div className={cn('animate-in zoom-in-95 duration-300', className)}>
      {children}
    </div>
  )
}

// 彈跳動畫
export function TailwindBounce({ children, className }: AnimationProps) {
  return (
    <div className={cn('animate-bounce', className)}>
      {children}
    </div>
  )
}

// 脈衝動畫
export function TailwindPulse({ children, className }: AnimationProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      {children}
    </div>
  )
}

// 旋轉動畫
export function TailwindSpin({ children, className }: AnimationProps) {
  return (
    <div className={cn('animate-spin', className)}>
      {children}
    </div>
  )
}

// 搖擺動畫
export function TailwindWiggle({ children, className }: AnimationProps) {
  return (
    <div className={cn('animate-wiggle', className)}>
      {children}
    </div>
  )
}