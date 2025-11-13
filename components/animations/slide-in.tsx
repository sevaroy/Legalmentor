'use client'

import { ReactNode, useEffect, useState } from 'react'

import { animated, useSpring } from '@react-spring/web'

interface SlideInProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 600,
  className = '' 
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const getTransform = () => {
    const distance = 30
    switch (direction) {
      case 'left': return isVisible ? 'translateX(0px)' : `translateX(-${distance}px)`
      case 'right': return isVisible ? 'translateX(0px)' : `translateX(${distance}px)`
      case 'up': return isVisible ? 'translateY(0px)' : `translateY(${distance}px)`
      case 'down': return isVisible ? 'translateY(0px)' : `translateY(-${distance}px)`
      default: return 'translateY(0px)'
    }
  }

  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    config: { tension: 280, friction: 60 }
  })

  return (
    <animated.div style={styles} className={className}>
      {children}
    </animated.div>
  )
}