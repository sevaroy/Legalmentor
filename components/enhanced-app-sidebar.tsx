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
import { cn } from '@/lib/utils'
import { History, Plus, Settings, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { FadeIn, SlideIn } from './animations'
import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'
import { Button } from './ui/button'
import { IconLogo } from './ui/icons'

export default function EnhancedAppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      {/* 增強的標題區 */}
      <SidebarHeader className="flex flex-row justify-between items-center p-4 border-b border-border/50">
        <FadeIn delay={0}>
          <Link href="/" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors group">
            <div className="relative">
              <IconLogo className={cn('size-6 text-primary group-hover:scale-110 transition-transform')} />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="size-3 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base">Morphic</span>
              <span className="text-xs text-muted-foreground">AI Search Engine</span>
            </div>
          </Link>
        </FadeIn>
        <SidebarTrigger className="hover:bg-accent/50 rounded-lg" />
      </SidebarHeader>

      <SidebarContent className="flex flex-col px-3 py-4 h-full">
        {/* 新聊天按鈕 */}
        <SlideIn direction="left" delay={100}>
          <SidebarMenu className="mb-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link 
                  href="/" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-sm"
                >
                  <Plus className="size-5" />
                  <span className="font-medium">New Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SlideIn>

        {/* 快捷功能 */}
        <SlideIn direction="left" delay={200}>
          <div className="mb-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Quick Actions
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 hover:bg-accent/50"
              >
                <History className="size-4" />
                <span className="text-sm">Recent Searches</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 hover:bg-accent/50"
              >
                <Settings className="size-4" />
                <span className="text-sm">Preferences</span>
              </Button>
            </div>
          </div>
        </SlideIn>

        {/* 聊天歷史 */}
        <div className="flex-1 overflow-y-auto">
          <SlideIn direction="left" delay={300}>
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Chat History
              </h3>
            </div>
          </SlideIn>
          <Suspense fallback={<ChatHistorySkeleton />}>
            <ChatHistorySection />
          </Suspense>
        </div>
      </SidebarContent>

      {/* 增強的底部區域 */}
      <SidebarFooter className="p-4 border-t border-border/50">
        <FadeIn delay={400}>
          <div className="text-center space-y-2">
            <div className="text-xs text-muted-foreground">
              Powered by AI • Made with ❤️
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </FadeIn>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}