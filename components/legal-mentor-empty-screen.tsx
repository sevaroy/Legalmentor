import { ArrowRight, BookOpen, FileText, Gavel, Scale, Search, Shield, Users } from 'lucide-react'

import { useBrandConfig } from '@/lib/branding/config'

import { Button } from '@/components/ui/button'

import { FadeIn, StaggerChildren } from './animations'

const legalExampleMessages = [
  {
    heading: 'Analyze this employment contract',
    message: 'Please analyze this employment contract for potential issues and standard clauses',
    icon: FileText,
    category: 'Contract Law',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    heading: 'Research intellectual property case law',
    message: 'Find recent case law on software patent infringement in the 9th Circuit',
    icon: Search,
    category: 'IP Law',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    heading: 'GDPR compliance requirements',
    message: 'What are the key GDPR compliance requirements for data processing?',
    icon: Shield,
    category: 'Privacy Law',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    heading: 'Corporate merger regulations',
    message: 'Explain the regulatory requirements for a corporate merger in Delaware',
    icon: Users,
    category: 'Corporate Law',
    color: 'text-amber-600 dark:text-amber-400'
  },
  {
    heading: 'Criminal procedure analysis',
    message: 'Analyze the Fourth Amendment implications of digital searches',
    icon: Gavel,
    category: 'Criminal Law',
    color: 'text-red-600 dark:text-red-400'
  },
  {
    heading: 'Legal research methodology',
    message: 'How to conduct comprehensive legal research on environmental regulations',
    icon: BookOpen,
    category: 'Research',
    color: 'text-teal-600 dark:text-teal-400'
  }
]

export function LegalMentorEmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  const brandConfig = useBrandConfig()

  return (
    <div className={`mx-auto w-full transition-all duration-500 ${className}`}>
      <FadeIn delay={0}>
        <div className="bg-gradient-to-br from-blue-50/80 to-white/80 dark:from-blue-950/50 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 p-6 shadow-lg">
          {/* 法律專業標題區域 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Scale className="size-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Legal Research Examples
              </h2>
            </div>
            <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
              Click on any example below to start your legal research
            </p>
          </div>

          {/* 法律專業示例按鈕網格 */}
          <StaggerChildren staggerDelay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {legalExampleMessages.map((message, index) => {
                const IconComponent = message.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto p-4 text-left justify-start hover:bg-blue-50/50 dark:hover:bg-blue-950/50 hover:scale-[1.02] transition-all duration-200 border border-blue-200/30 dark:border-blue-800/30 hover:border-blue-300/50 dark:hover:border-blue-700/50 rounded-xl group"
                    onClick={() => submitMessage(message.message)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/50 group-hover:bg-blue-200/50 dark:group-hover:bg-blue-800/50 transition-colors">
                          <IconComponent className={`size-4 ${message.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wide">
                            {message.category}
                          </span>
                          <ArrowRight className="size-3 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm font-medium text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          {message.heading}
                        </p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </StaggerChildren>

          {/* 法律專業底部提示 */}
          <div className="mt-6 pt-4 border-t border-blue-200/30 dark:border-blue-800/30">
            <div className="flex items-center justify-center space-x-2 text-xs text-blue-600/70 dark:text-blue-400/70 mb-2">
              <Scale className="size-3" />
              <span>Professional legal research powered by AI</span>
              <Scale className="size-3" />
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="size-3 text-green-500" />
                  <span>Confidential</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                  <FileText className="size-3 text-blue-500" />
                  <span>Cited Sources</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                  <Gavel className="size-3 text-purple-500" />
                  <span>Professional Grade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}