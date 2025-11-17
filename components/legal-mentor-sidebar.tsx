import { Suspense } from 'react'
import Link from 'next/link'

import { Plus } from 'lucide-react'

import { useBrandConfig } from '@/lib/branding/config'
import { cn } from '@/lib/utils/index'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger
} from '@/components/ui/sidebar'

import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'
import { LegalMentorLogo } from './ui/legal-icons'

export default function LegalMentorSidebar() {
  const brandConfig = useBrandConfig()

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      {/* 品牌標題區 */}
      <SidebarHeader className="flex flex-row justify-between items-center p-4 border-b">
        <Link href="/" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
          <LegalMentorLogo className={cn('size-6')} />
          <div className="flex flex-col">
            <span className="font-semibold text-base">{brandConfig.name}</span>
          </div>
        </Link>
        <SidebarTrigger className="hover:bg-sidebar-accent rounded-lg" />
      </SidebarHeader>

      <SidebarContent className="flex flex-col px-3 py-4 h-full">
        {/* 新對話按鈕 */}
        <SidebarMenu className="mb-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/"
                className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors"
              >
                <Plus className="size-4" />
                <span className="font-medium">新對話</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* 歷史記錄 */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-3">
            <h3 className="text-xs font-medium text-muted-foreground px-2">
              歷史記錄
            </h3>
          </div>
          <Suspense fallback={<ChatHistorySkeleton />}>
            <ChatHistorySection />
          </Suspense>
        </div>
      </SidebarContent>

      {/* 底部區域 */}
      <SidebarFooter className="p-4 border-t">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            AI 法律助理
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}