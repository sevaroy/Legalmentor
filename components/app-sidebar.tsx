'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils/index'

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger
} from '@/components/ui/sidebar'

import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'
import { IconLogo } from './ui/icons'

export default function AppSidebar() {
  const t = useTranslations('sidebar')

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row justify-between items-center border-b border-border/40 pb-3">
        <Link href="/" className="flex items-center gap-2.5 px-2 py-3 group">
          <IconLogo className={cn('size-5 transition-transform group-hover:scale-110')} />
          <span className="font-semibold text-sm tracking-tight">Morphic</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-3 py-4 h-full gap-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 font-medium hover:bg-accent/50 transition-colors">
              <Link href="/" className="flex items-center gap-3">
                <Plus className="size-4" />
                <span>{t('new')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          <Suspense fallback={<ChatHistorySkeleton />}>
            <ChatHistorySection />
          </Suspense>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
