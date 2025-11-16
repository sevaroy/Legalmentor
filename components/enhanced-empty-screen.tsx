import { ArrowRight, FileText, Globe, Sparkles, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { FadeIn, StaggerChildren } from './animations'

const exampleMessages = [
  {
    heading: 'What is DeepSeek R1?',
    message: 'What is DeepSeek R1?',
    icon: Sparkles,
    category: 'AI & Tech'
  },
  {
    heading: 'Why is Nvidia growing rapidly?',
    message: 'Why is Nvidia growing rapidly?',
    icon: TrendingUp,
    category: 'Business'
  },
  {
    heading: 'Tesla vs Rivian comparison',
    message: 'Tesla vs Rivian',
    icon: Globe,
    category: 'Analysis'
  },
  {
    heading: 'Summarize research paper',
    message: 'Summary: https://arxiv.org/pdf/2501.05707',
    icon: FileText,
    category: 'Research'
  }
]

export function EnhancedEmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all duration-500 ${className}`}>
      <FadeIn delay={0}>
        <div className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
          {/* 標題區域 */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Try these examples
            </h2>
            <p className="text-sm text-muted-foreground">
              Click on any example below to get started
            </p>
          </div>

          {/* 示例按鈕網格 */}
          <StaggerChildren staggerDelay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleMessages.map((message, index) => {
                const IconComponent = message.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto p-4 text-left justify-start hover:bg-accent/50 hover:scale-[1.02] transition-all duration-200 border border-border/30 hover:border-primary/30 rounded-xl group"
                    onClick={() => submitMessage(message.message)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="size-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-primary/70 uppercase tracking-wide">
                            {message.category}
                          </span>
                          <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {message.heading}
                        </p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </StaggerChildren>

          {/* 底部提示 */}
          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <Sparkles className="size-3" />
              <span>Or ask me anything about any topic</span>
              <Sparkles className="size-3" />
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}