'use client'

import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import { AnimatedMessageBubble, TypingAnimation } from './animations'

interface EnhancedChatMessageProps {
  message: Message
  index: number
  isTyping?: boolean
}

export function EnhancedChatMessage({ 
  message, 
  index, 
  isTyping = false 
}: EnhancedChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <AnimatedMessageBubble 
      isUser={isUser} 
      delay={index * 100}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2 shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-muted text-muted-foreground mr-auto'
        )}
      >
        {isTyping && !isUser ? (
          <TypingAnimation 
            text={message.content}
            speed={30}
            className="text-sm"
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap">
            {message.content}
          </p>
        )}
      </div>
    </AnimatedMessageBubble>
  )
}