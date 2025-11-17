'use client'

import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { useRouter } from 'next/navigation'

import { Message } from 'ai'
import { ArrowUp, ChevronDown, MessageCirclePlus, Square } from 'lucide-react'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils/index'

import { useArtifact } from './artifact/artifact-context'
import { Button } from './ui/button'
import { FadeIn, SlideIn } from './animations'
import { LegalMentorEmptyScreen } from './legal-mentor-empty-screen'
import { ModelSelector } from './model-selector'
import { SearchModeToggle } from './search-mode-toggle'

interface LegalMentorChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: any) => void
  models?: Model[]
  showScrollToBottomButton: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement>
}

export function LegalMentorChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append,
  models,
  showScrollToBottomButton,
  scrollContainerRef
}: LegalMentorChatPanelProps) {
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false)
  const [enterDisabled, setEnterDisabled] = useState(false)
  const { close: closeArtifact } = useArtifact()

  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => setEnterDisabled(false), 300)
  }

  const handleNewChat = () => {
    setMessages([])
    closeArtifact()
    router.push('/')
  }

  const isToolInvocationInProgress = () => {
    if (!messages.length) return false
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'assistant' || !lastMessage.parts) return false
    const parts = lastMessage.parts
    const lastPart = parts[parts.length - 1]
    return (
      lastPart?.type === 'tool-invocation' &&
      lastPart?.toolInvocation?.state === 'call'
    )
  }

  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      append({ role: 'user', content: query })
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const handleScrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div
      className={cn(
        'w-full bg-background group/form-container shrink-0',
        messages.length > 0 ? 'sticky bottom-0 px-2 pb-4' : 'px-6'
      )}
    >
      {messages.length === 0 && (
        <FadeIn delay={100}>
          <div className="mb-10 flex flex-col items-center gap-4">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                有什麼法律問題需要協助嗎？
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                我可以幫您查詢判決案例、解釋法律條文、分析法律問題
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn('max-w-3xl w-full mx-auto relative')}
      >
        {/* 滾動到底部按鈕 */}
        {showScrollToBottomButton && messages.length > 0 && (
          <SlideIn direction="up" delay={0}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -top-12 right-4 z-20 size-10 rounded-full shadow-md bg-background hover:bg-muted transition-colors"
              onClick={handleScrollToBottom}
              title="Scroll to bottom"
              aria-label="捲動至底部"
            >
              <ChevronDown size={18} />
            </Button>
          </SlideIn>
        )}

        {/* 輸入框設計 */}
        <div className={cn(
          'relative flex flex-col w-full gap-2 rounded-2xl border-2 transition-all duration-300',
          isFocused
            ? 'bg-background border-primary shadow-xl ring-4 ring-primary/10'
            : 'bg-background border-border hover:border-primary/30'
        )}>


          <Textarea
            ref={inputRef}
            name="input"
            rows={2}
            maxRows={6}
            tabIndex={0}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="詢問任何法律問題..."
            spellCheck={false}
            value={input}
            disabled={isLoading || isToolInvocationInProgress()}
            className={cn(
              'resize-none w-full min-h-14 bg-transparent border-0 p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            )}
            onChange={e => {
              handleInputChange(e)
              setShowEmptyScreen(e.target.value.length === 0)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !isComposing && !enterDisabled) {
                if (input.trim().length === 0) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                const textarea = e.target as HTMLTextAreaElement
                textarea.form?.requestSubmit()
              }
            }}
            onFocus={() => {
              setShowEmptyScreen(true)
              setIsFocused(true)
            }}
            onBlur={() => {
              setShowEmptyScreen(false)
              setIsFocused(false)
            }}
          />

          {/* 底部控制區 */}
          <div className="flex items-center justify-between p-3 border-t border-border">
            <div className="flex items-center gap-3">
              <ModelSelector models={models || []} />
              <SearchModeToggle />
            </div>
            
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewChat}
                  className="shrink-0 rounded-full transition-colors"
                  type="button"
                  disabled={isLoading || isToolInvocationInProgress()}
                  title="開始新對話"
                  aria-label="開始新的對話"
                >
                  <MessageCirclePlus className="size-4" />
                </Button>
              )}

              <Button
                type={isLoading ? 'button' : 'submit'}
                size={'icon'}
                variant={'default'}
                className={cn(
                  'rounded-full transition-all duration-200',
                  isLoading
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-primary hover:bg-primary/90 hover:scale-110 hover:shadow-lg'
                )}
                disabled={
                  (input.length === 0 && !isLoading) ||
                  isToolInvocationInProgress()
                }
                onClick={isLoading ? stop : undefined}
                title={isLoading ? '停止生成' : '送出訊息'}
                aria-label={isLoading ? '停止生成' : '送出訊息'}
              >
                {isLoading ? (
                  <Square size={18} />
                ) : (
                  <ArrowUp size={18} />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 空白屏幕 */}
        {messages.length === 0 && (
          <FadeIn delay={200}>
            <LegalMentorEmptyScreen
              submitMessage={message => {
                handleInputChange({
                  target: { value: message }
                } as React.ChangeEvent<HTMLTextAreaElement>)
              }}
              className={cn(
                'transition-all duration-200',
                showEmptyScreen ? 'visible opacity-100' : 'invisible opacity-0'
              )}
            />
          </FadeIn>
        )}
      </form>
    </div>
  )
}