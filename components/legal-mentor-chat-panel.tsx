'use client'

import { useBrandConfig } from '@/lib/branding/config'
import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils/index'
import { Message } from 'ai'
import { ArrowUp, ChevronDown, MessageCirclePlus, Scale, Shield, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { FadeIn, SlideIn } from './animations'
import { useArtifact } from './artifact/artifact-context'
import { LegalMentorEmptyScreen } from './legal-mentor-empty-screen'
import { ModelSelector } from './model-selector'
import { SearchModeToggle } from './search-mode-toggle'
import { Button } from './ui/button'
import { LegalMentorLogo } from './ui/legal-icons'

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
  const brandConfig = useBrandConfig()
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
        'w-full bg-gradient-to-t from-background via-background to-blue-50/30 dark:to-blue-950/30 group/form-container shrink-0',
        messages.length > 0 ? 'sticky bottom-0 px-2 pb-4' : 'px-6'
      )}
    >
      {messages.length === 0 && (
        <FadeIn delay={200}>
          <div className="mb-10 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                <LegalMentorLogo className="size-20 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                <Scale className="size-6 text-amber-600 dark:text-amber-400 animate-bounce" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                有什麼法律問題需要協助嗎？
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                我可以幫您查詢判決案例、解釋法律條文、分析法律問題。
                <br />
                用淺顯易懂的方式，讓您了解法律怎麼說。
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-blue-600 dark:text-blue-400">
                <div className="flex items-center gap-2">
                  <Shield className="size-4" />
                  <span>隱私保護</span>
                </div>
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                <div className="flex items-center gap-2">
                  <Scale className="size-4" />
                  <span>判決書智能搜尋</span>
                </div>
              </div>
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
              className="absolute -top-12 right-4 z-20 size-10 rounded-full shadow-lg border-2 bg-blue-50/80 dark:bg-blue-950/80 backdrop-blur-sm hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-110 transition-all border-blue-200 dark:border-blue-800"
              onClick={handleScrollToBottom}
              title="Scroll to bottom"
            >
              <ChevronDown size={18} className="text-blue-600 dark:text-blue-400" />
            </Button>
          </SlideIn>
        )}

        {/* Legal Mentor 輸入框設計 */}
        <div className={cn(
          'relative flex flex-col w-full gap-2 rounded-2xl border-2 transition-all duration-300',
          isFocused 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-blue-500/50 shadow-lg shadow-blue-500/10' 
            : 'bg-blue-50/50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
          isLoading && 'animate-pulse'
        )}>
          {/* 法律專業輸入提示 */}
          {isFocused && input.length === 0 && (
            <div className="absolute top-3 left-4 text-xs text-blue-600/60 dark:text-blue-400/60 pointer-events-none">
              ⚖️ Legal Research Tip: Be specific about jurisdiction, case type, or legal area
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
            placeholder="Ask about contracts, case law, regulations, or any legal matter..."
            spellCheck={false}
            value={input}
            disabled={isLoading || isToolInvocationInProgress()}
            className={cn(
              'resize-none w-full min-h-14 bg-transparent border-0 p-4 text-sm placeholder:text-blue-400/70 dark:placeholder:text-blue-500/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
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

          {/* 法律專業底部控制區 */}
          <div className="flex items-center justify-between p-3 border-t border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center gap-3">
              <ModelSelector models={models || []} />
              <SearchModeToggle />
              {/* 法律專業字數統計 */}
              {input.length > 0 && (
                <span className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  {input.length} chars • Legal Analysis Ready
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNewChat}
                  className="shrink-0 rounded-full group hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border-blue-200 dark:border-blue-800"
                  type="button"
                  disabled={isLoading || isToolInvocationInProgress()}
                  title="Start new legal research"
                >
                  <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-transform text-blue-600 dark:text-blue-400" />
                </Button>
              )}
              
              <Button
                type={isLoading ? 'button' : 'submit'}
                size={'icon'}
                variant={'default'}
                className={cn(
                  'rounded-full transition-all duration-300',
                  isLoading 
                    ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' 
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 hover:scale-110',
                  input.length > 0 && !isLoading && 'shadow-lg shadow-blue-500/30'
                )}
                disabled={
                  (input.length === 0 && !isLoading) ||
                  isToolInvocationInProgress()
                }
                onClick={isLoading ? stop : undefined}
                title={isLoading ? 'Stop legal analysis' : 'Start legal research'}
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

        {/* Legal Mentor 空白屏幕 */}
        {messages.length === 0 && (
          <FadeIn delay={400}>
            <LegalMentorEmptyScreen
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