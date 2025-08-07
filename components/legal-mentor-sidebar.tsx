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
import { useBrandConfig } from '@/lib/branding/config'
import { cn } from '@/lib/utils'
import { BookOpen, FileText, Plus, Scale, Search, Shield } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { FadeIn, SlideIn } from './animations'
import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'
import { Button } from './ui/button'
import { LegalMentorLogo } from './ui/legal-icons'

export default function LegalMentorSidebar() {
  const brandConfig = useBrandConfig()

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      {/* Legal Mentor 品牌標題區 */}
      <SidebarHeader className="flex flex-row justify-between items-center p-4 border-b border-border/50 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <FadeIn delay={0}>
          <Link href="/" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors group">
            <div className="relative">
              <LegalMentorLogo className={cn('size-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform')} />
              <div className="absolute -top-1 -right-1">
                <Scale className="size-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-blue-900 dark:text-blue-100">{brandConfig.name}</span>
              <span className="text-xs text-blue-600 dark:text-blue-300">{brandConfig.tagline}</span>
            </div>
          </Link>
        </FadeIn>
        <SidebarTrigger className="hover:bg-white/50 dark:hover:bg-white/10 rounded-lg" />
      </SidebarHeader>

      <SidebarContent className="flex flex-col px-3 py-4 h-full">
        {/* 新法律研究按鈕 */}
        <SlideIn direction="left" delay={100}>
          <SidebarMenu className="mb-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link 
                  href="/" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-[1.02] shadow-sm"
                >
                  <Plus className="size-5" />
                  <span className="font-medium">New Legal Research</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SlideIn>

        {/* 法律專業功能 */}
        <SlideIn direction="left" delay={200}>
          <div className="mb-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Legal Tools
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300"
              >
                <FileText className="size-4" />
                <span className="text-sm">Contract Analysis</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300"
              >
                <Search className="size-4" />
                <span className="text-sm">Case Law Search</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300"
              >
                <Shield className="size-4" />
                <span className="text-sm">Compliance Check</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300"
              >
                <BookOpen className="size-4" />
                <span className="text-sm">Legal Research</span>
              </Button>
            </div>
          </div>
        </SlideIn>

        {/* 專業領域 */}
        <SlideIn direction="left" delay={300}>
          <div className="mb-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Practice Areas
            </h3>
            <div className="space-y-1">
              {brandConfig.legal.specialties.slice(0, 3).map((specialty, index) => (
                <Button
                  key={specialty}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3 h-8 hover:bg-accent/50 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{specialty}</span>
                </Button>
              ))}
            </div>
          </div>
        </SlideIn>

        {/* 研究歷史 */}
        <div className="flex-1 overflow-y-auto">
          <SlideIn direction="left" delay={400}>
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Research History
              </h3>
            </div>
          </SlideIn>
          <Suspense fallback={<ChatHistorySkeleton />}>
            <ChatHistorySection />
          </Suspense>
        </div>
      </SidebarContent>

      {/* Legal Mentor 底部區域 */}
      <SidebarFooter className="p-4 border-t border-border/50 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <FadeIn delay={500}>
          <div className="text-center space-y-2">
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Powered by AI • Legal Professional Grade
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 dark:text-blue-400">Secure & Confidential</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Attorney-Client Privilege Protected
            </div>
          </div>
        </FadeIn>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}