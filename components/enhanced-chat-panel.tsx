'use client'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils/index'
import { Message } from 'ai'
import { ArrowUp, ChevronDown, MessageCirclePlus, Sparkles, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { FadeIn, SlideIn } from './animations'
import { useArtifact } from './artifact/artifact-context'
import { EmptyScreen } from './empty-screen'
import { ModelSelector } from './model-selector'
import { SearchModeToggle } from './search-mode-toggle'
import { Button } from './ui/button'
import { IconLogo } from './ui/icons'

interface EnhancedChatPanelProps {
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

export function EnhancedChatPanel({
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
}: EnhancedChatPanelProps) {
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
        'w-full bg-gradient-to-t from-background via-background to-background/80 group/form-container shrink-0',
        messages.length > 0 ? 'sticky bottom-0 px-2 pb-4' : 'px-6'
      )}
    >
      {messages.length === 0 && (
        <FadeIn delay={200}>
          <div className="mb-10 flex flex-col items-center gap-6">
            <div className="relative">
              <IconLogo className="size-16 text-primary animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="size-6 text-yellow-500 animate-bounce" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                How can I help you today?
              </h1>
              <p className="text-muted-foreground text-lg">
                Ask me anything, and I'll search and analyze to give you the best answer
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn('max-w-3xl w-full mx-auto relative')}
      >
        {/* 增強的滾動到底部按鈕 */}
        {showScrollToBottomButton && messages.length > 0 && (
          <SlideIn direction="up" delay={0}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -top-12 right-4 z-20 size-10 rounded-full shadow-lg border-2 bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all"
              onClick={handleScrollToBottom}
              title="Scroll to bottom"
            >
              <ChevronDown size={18} />
            </Button>
          </SlideIn>
        )}

        {/* 增強的輸入框設計 */}
        <div className={cn(
          'relative flex flex-col w-full gap-2 rounded-2xl border-2 transition-all duration-300',
          isFocused 
            ? 'bg-card/80 backdrop-blur-sm border-primary/50 shadow-lg shadow-primary/10' 
            : 'bg-muted/50 border-border hover:border-border/80',
          isLoading && 'animate-pulse'
        )}>
          {/* 輸入提示 */}
          {isFocused && input.length === 0 && (
            <div className="absolute top-3 left-4 text-xs text-muted-foreground/60 pointer-events-none">
              💡 Tip: Press Enter to send, Shift+Enter for new line
            </div>
          )}

          <Textarea
            ref={inputRef}
            name="input"
            rows={2}
            maxRows={6}
            tabIndex={0}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Ask a question..."
            spellCheck={false}
            value={input}
            disabled={isLoading || isToolInvocationInProgress()}
            className={cn(
              'resize-none w-full min-h-14 bg-transparent border-0 p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              isFocused && input.length === 0 && 'pt-8'
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

          {/* 增強的底部控制區 */}
          <div className="flex items-center justify-between p-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <ModelSelector models={models || []} />
              <SearchModeToggle />
              {/* 字數統計 */}
              {input.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {input.length} chars
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNewChat}
                  className="shrink-0 rounded-full group hover:bg-primary/10 transition-colors"
                  type="button"
                  disabled={isLoading || isToolInvocationInProgress()}
                  title="Start new chat"
                >
                  <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-transform" />
                </Button>
              )}
              
              <Button
                type={isLoading ? 'button' : 'submit'}
                size={'icon'}
                variant={'default'}
                className={cn(
                  'rounded-full transition-all duration-300',
                  isLoading 
                    ? 'bg-destructive hover:bg-destructive/90' 
                    : 'bg-primary hover:bg-primary/90 hover:scale-110',
                  input.length > 0 && !isLoading && 'shadow-lg shadow-primary/30'
                )}
                disabled={
                  (input.length === 0 && !isLoading) ||
                  isToolInvocationInProgress()
                }
                onClick={isLoading ? stop : undefined}
                title={isLoading ? 'Stop generation' : 'Send message'}
              >
                {isLoading ? (
                  <Square size={18} className="animate-pulse" />
                ) : (
                  <ArrowUp size={18} />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 增強的空白屏幕 */}
        {messages.length === 0 && (
          <FadeIn delay={400}>
            <EmptyScreen
              submitMessage={message => {
                handleInputChange({
                  target: { value: message }
                } as React.ChangeEvent<HTMLTextAreaElement>)
              }}
              className={cn(
                'transition-all duration-300',
                showEmptyScreen ? 'visible opacity-100' : 'invisible opacity-0'
              )}
            />
          </FadeIn>
        )}
      </form>
    </div>
  )
}