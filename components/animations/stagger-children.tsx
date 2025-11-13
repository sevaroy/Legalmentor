'use client'

import { Children, ReactNode, useEffect, useState } from 'react'

import { animated, useTrail } from '@react-spring/web'

interface StaggerChildrenProps {
  children: ReactNode
  delay?: number
  staggerDelay?: number
  className?: string
}

export function StaggerChildren({ 
  children, 
  delay = 0,
  staggerDelay = 100,
  className = '' 
}: StaggerChildrenProps) {
  const [isVisible, setIsVisible] = useState(false)
  const items = Children.toArray(children)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const trail = useTrail(items.length, {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  })

  return (
    <div className={className}>
      {trail.map((styles, index) => (
        <animated.div key={index} style={styles}>
          {items[index]}
        </animated.div>
      ))}
    </div>
  )
}