'use client'

import { animated, useSpring } from '@react-spring/web'

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export function LoadingDots({ 
  size = 'md', 
  color = 'bg-primary',
  className = '' 
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2', 
    lg: 'w-3 h-3'
  }

  const Dot = ({ delay }: { delay: number }) => {
    const styles = useSpring({
      from: { opacity: 0.3, transform: 'scale(0.8)' },
      to: async (next) => {
        while (true) {
          await next({ opacity: 1, transform: 'scale(1)' })
          await next({ opacity: 0.3, transform: 'scale(0.8)' })
        }
      },
      config: { duration: 600 },
      delay
    })

    return (
      <animated.div 
        style={styles}
        className={`${sizeClasses[size]} ${color} rounded-full`}
      />
    )
  }

  return (
    <div className={`flex space-x-1 items-center ${className}`}>
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </div>
  )
}