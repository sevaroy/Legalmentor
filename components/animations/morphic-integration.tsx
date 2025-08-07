'use client'

// Morphic 項目動畫集成示例
import { Message } from 'ai/react'
import {
    AIThinkingAnimation,
    AnimatedMessageBubble,
    FadeIn,
    SearchProgressAnimation,
    SmartLoadingAnimation,
    StaggerChildren
} from './index'

// 使用示例：在 ChatMessages 中集成動畫
export function MorphicChatExample({ 
  messages, 
  isLoading 
}: { 
  messages: Message[]
  isLoading: boolean 
}) {
  return (
    <div className="space-y-4">
      <StaggerChildren staggerDelay={150}>
        {messages.map((message, index) => (
          <AnimatedMessageBubble 
            key={message.id}
            isUser={message.role === 'user'}
            delay={index * 100}
          >
            <div className="p-3 rounded-lg bg-card">
              {message.content}
            </div>
          </AnimatedMessageBubble>
        ))}
      </StaggerChildren>
      
      {isLoading && (
        <FadeIn delay={200}>
          <AIThinkingAnimation />
        </FadeIn>
      )}
    </div>
  )
}

// 使用示例：搜索進度集成
export function MorphicSearchProgress() {
  const searchSteps = [
    '搜索網絡資源',
    '分析相關內容', 
    '生成智能回答',
    '優化結果展示'
  ]

  return (
    <SearchProgressAnimation 
      steps={searchSteps}
      currentStep={1}
      className="my-4"
    />
  )
}

// 使用示例：載入狀態集成
export function MorphicLoadingStates() {
  return (
    <div className="space-y-6">
      <SmartLoadingAnimation 
        stage="searching"
        progress={45}
      />
      
      <SmartLoadingAnimation 
        stage="analyzing" 
        progress={75}
      />
      
      <SmartLoadingAnimation 
        stage="generating"
        progress={90}
      />
    </div>
  )
}