'use client'

import { useEffect, useMemo, useState } from 'react'

import { ChatRequestOptions, JSONValue, Message } from 'ai'

import { cn } from '@/lib/utils/index'

import { Spinner } from './ui/spinner'
import { AnimatedMessageBubble, FadeIn, StaggerChildren } from './animations'
import { RenderMessage } from './render-message'
import { ToolSection } from './tool-section'

interface ChatSection {
  id: string
  userMessage: Message
  assistantMessages: Message[]
}

interface AnimatedChatMessagesProps {
  sections: ChatSection[]
  data: JSONValue[] | undefined
  onQuerySelect: (query: string) => void
  isLoading: boolean
  chatId?: string
  addToolResult?: (params: { toolCallId: string; result: any }) => void
  scrollContainerRef: React.RefObject<HTMLDivElement>
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
  reload?: (messageId: string, options?: ChatRequestOptions) => Promise<string | null | undefined>
}

export function AnimatedChatMessages({
  sections,
  data,
  onQuerySelect,
  isLoading,
  chatId,
  addToolResult,
  scrollContainerRef,
  onUpdateMessage,
  reload
}: AnimatedChatMessagesProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
  const [visibleSections, setVisibleSections] = useState<number>(0)
  const manualToolCallId = 'manual-tool-call'

  // 逐步顯示聊天區塊
  useEffect(() => {
    if (sections.length > visibleSections) {
      const timer = setTimeout(() => {
        setVisibleSections(prev => Math.min(prev + 1, sections.length))
      }, 150) // 每個區塊間隔150ms顯示
      return () => clearTimeout(timer)
    }
  }, [sections.length, visibleSections])

  useEffect(() => {
    if (sections.length > 0) {
      const lastSection = sections[sections.length - 1]
      if (lastSection.userMessage.role === 'user') {
        setOpenStates({ [manualToolCallId]: true })
      }
    }
  }, [sections])

  const lastToolData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null

    const lastItem = data[data.length - 1] as {
      type: 'tool_call'
      data: {
        toolCallId: string
        state: 'call' | 'result'
        toolName: string
        args: string
      }
    }

    if (lastItem.type !== 'tool_call') return null

    const toolData = lastItem.data
    return {
      state: 'call' as const,
      toolCallId: toolData.toolCallId,
      toolName: toolData.toolName,
      args: toolData.args ? JSON.parse(toolData.args) : undefined
    }
  }, [data])

  if (!sections.length) return null

  const allMessages = sections.flatMap(section => [
    section.userMessage,
    ...section.assistantMessages
  ])

  const lastUserIndex =
    allMessages.length -
    1 -
    [...allMessages].reverse().findIndex(msg => msg.role === 'user')

  const showLoading =
    isLoading &&
    sections.length > 0 &&
    sections[sections.length - 1].assistantMessages.length === 0

  const getIsOpen = (id: string) => {
    if (id.includes('call')) {
      return openStates[id] ?? true
    }
    const baseId = id.endsWith('-related') ? id.slice(0, -8) : id
    const index = allMessages.findIndex(msg => msg.id === baseId)
    return openStates[id] ?? index >= lastUserIndex
  }

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenStates(prev => ({
      ...prev,
      [id]: open
    }))
  }

  return (
    <div
      id="scroll-container"
      ref={scrollContainerRef}
      role="list"
      aria-roledescription="chat messages"
      className={cn(
        'relative size-full pt-14',
        sections.length > 0 ? 'flex-1 overflow-y-auto' : ''
      )}
    >
      <div className="relative mx-auto w-full max-w-3xl px-4">
        <StaggerChildren staggerDelay={100}>
          {sections.slice(0, visibleSections).map((section, sectionIndex) => (
            <FadeIn key={section.id} delay={sectionIndex * 50}>
              <div
                id={`section-${section.id}`}
                className="chat-section mb-8"
                style={
                  sectionIndex === sections.length - 1
                    ? { minHeight: 'calc(-228px + 100dvh)' }
                    : {}
                }
              >
                {/* User message with animation */}
                <div className="flex flex-col gap-4 mb-4">
                  <AnimatedMessageBubble isUser={true} delay={0}>
                    <RenderMessage
                      message={section.userMessage}
                      messageId={section.userMessage.id}
                      getIsOpen={getIsOpen}
                      onOpenChange={handleOpenChange}
                      onQuerySelect={onQuerySelect}
                      chatId={chatId}
                      addToolResult={addToolResult}
                      onUpdateMessage={onUpdateMessage}
                      reload={reload}
                    />
                  </AnimatedMessageBubble>
                  {showLoading && (
                    <FadeIn delay={200}>
                      <Spinner />
                    </FadeIn>
                  )}
                </div>

                {/* Assistant messages with staggered animation */}
                <StaggerChildren staggerDelay={150}>
                  {section.assistantMessages.map(assistantMessage => (
                    <AnimatedMessageBubble 
                      key={assistantMessage.id} 
                      isUser={false} 
                      delay={0}
                    >
                      <div className="flex flex-col gap-4">
                        <RenderMessage
                          message={assistantMessage}
                          messageId={assistantMessage.id}
                          getIsOpen={getIsOpen}
                          onOpenChange={handleOpenChange}
                          onQuerySelect={onQuerySelect}
                          chatId={chatId}
                          addToolResult={addToolResult}
                          onUpdateMessage={onUpdateMessage}
                          reload={reload}
                        />
                      </div>
                    </AnimatedMessageBubble>
                  ))}
                </StaggerChildren>
              </div>
            </FadeIn>
          ))}
        </StaggerChildren>

        {showLoading && lastToolData && (
          <FadeIn delay={300}>
            <ToolSection
              key={manualToolCallId}
              tool={lastToolData}
              isOpen={getIsOpen(manualToolCallId)}
              onOpenChange={open => handleOpenChange(manualToolCallId, open)}
              addToolResult={addToolResult}
            />
          </FadeIn>
        )}
      </div>
    </div>
  )
}