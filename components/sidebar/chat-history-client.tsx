'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'

import { Chat } from '@/lib/types'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar'

import { ChatHistorySkeleton } from './chat-history-skeleton'
import { ChatMenuItem } from './chat-menu-item'
import { ClearHistoryAction } from './clear-history-action'

// interface ChatHistoryClientProps {} // Removed empty interface

interface ChatPageResponse {
  chats: Chat[]
  nextOffset: number | null
}

export function ChatHistoryClient() {
  const t = useTranslations('sidebar')
  const tToast = useTranslations('toast')
  // Removed props from function signature
  const [chats, setChats] = useState<Chat[]>([])
  const [nextOffset, setNextOffset] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  const fetchInitialChats = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/chats?offset=0&limit=20`)
      if (!response.ok) {
        throw new Error('Failed to fetch initial chat history')
      }
      const { chats: newChats, nextOffset: newNextOffset } =
        (await response.json()) as ChatPageResponse

      setChats(newChats)
      setNextOffset(newNextOffset)
    } catch (error) {
      console.error('Failed to load initial chats:', error)
      toast.error(tToast('failedToLoadHistory'))
      setNextOffset(null)
    } finally {
      setIsLoading(false)
    }
  }, [tToast])

  useEffect(() => {
    fetchInitialChats()
  }, [fetchInitialChats])

  useEffect(() => {
    const handleHistoryUpdate = () => {
      startTransition(() => {
        fetchInitialChats()
      })
    }
    window.addEventListener('chat-history-updated', handleHistoryUpdate)
    return () => {
      window.removeEventListener('chat-history-updated', handleHistoryUpdate)
    }
  }, [fetchInitialChats])

  const fetchMoreChats = useCallback(async () => {
    if (isLoading || nextOffset === null) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/chats?offset=${nextOffset}&limit=20`)
      if (!response.ok) {
        throw new Error('Failed to fetch more chat history')
      }
      const { chats: newChats, nextOffset: newNextOffset } =
        (await response.json()) as ChatPageResponse

      setChats(prevChats => [...prevChats, ...newChats])
      setNextOffset(newNextOffset)
    } catch (error) {
      console.error('Failed to load more chats:', error)
      toast.error(tToast('failedToLoadMoreHistory'))
      setNextOffset(null)
    } finally {
      setIsLoading(false)
    }
  }, [nextOffset, isLoading, tToast])

  useEffect(() => {
    const observerRefValue = loadMoreRef.current
    if (!observerRefValue || nextOffset === null || isPending) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && !isPending) {
          fetchMoreChats()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerRefValue)

    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue)
      }
    }
  }, [fetchMoreChats, nextOffset, isLoading, isPending])

  const isHistoryEmpty = !isLoading && !chats.length && nextOffset === null

  return (
    <div className="flex flex-col flex-1 h-full">
      <SidebarGroup className="pb-2">
        <div className="flex items-center justify-between w-full">
          <SidebarGroupLabel className="p-0 text-xs font-semibold tracking-tight">{t('history')}</SidebarGroupLabel>
          <ClearHistoryAction empty={isHistoryEmpty} />
        </div>
      </SidebarGroup>
      <div className="flex-1 overflow-y-auto mb-2 relative">
        {isHistoryEmpty && !isPending ? (
          <div className="px-3 text-foreground/40 text-sm text-center py-6">
            {t('noHistory')}
          </div>
        ) : (
          <SidebarMenu className="gap-1">
            {chats.map(
              (chat: Chat) => chat && <ChatMenuItem key={chat.id} chat={chat} />
            )}
          </SidebarMenu>
        )}
        <div ref={loadMoreRef} style={{ height: '1px' }} />
        {(isLoading || isPending) && (
          <div className="py-2">
            <ChatHistorySkeleton />
          </div>
        )}
      </div>
    </div>
  )
}
