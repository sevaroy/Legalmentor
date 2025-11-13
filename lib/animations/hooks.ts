'use client'

import { useEffect, useState } from 'react'

import { ANIMATION_CONFIG, checkReducedMotion, isMobileDevice } from './config'

// 動畫偏好 Hook
export function useAnimationPreferences() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setReducedMotion(checkReducedMotion())
    setIsMobile(isMobileDevice())

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReducedMotion(mediaQuery.matches)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return {
    reducedMotion,
    isMobile,
    shouldAnimate: !reducedMotion,
    animationDuration: reducedMotion || isMobile 
      ? ANIMATION_CONFIG.durations.fast 
      : ANIMATION_CONFIG.durations.normal
  }
}

// 交錯動畫 Hook
export function useStaggeredAnimation(itemCount: number, delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState(0)
  const { shouldAnimate } = useAnimationPreferences()

  useEffect(() => {
    if (!shouldAnimate) {
      setVisibleItems(itemCount)
      return
    }

    if (visibleItems < itemCount) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + 1, itemCount))
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [itemCount, visibleItems, delay, shouldAnimate])

  return visibleItems
}

// 載入狀態動畫 Hook
export function useLoadingAnimation(stages: string[]) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)

  const nextStage = () => {
    setCurrentStage(prev => Math.min(prev + 1, stages.length - 1))
  }

  const updateProgress = (newProgress: number) => {
    setProgress(Math.min(Math.max(newProgress, 0), 100))
  }

  const reset = () => {
    setCurrentStage(0)
    setProgress(0)
  }

  return {
    currentStage,
    currentStageName: stages[currentStage],
    progress,
    nextStage,
    updateProgress,
    reset,
    isComplete: currentStage === stages.length - 1
  }
}

// 視窗可見性動畫 Hook
export function useInViewAnimation(threshold: number = 0.1) {
  const [isInView, setIsInView] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return [setRef, isInView] as const
}