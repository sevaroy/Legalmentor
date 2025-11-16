import { Button } from '@/components/ui/button'
import { useBrandConfig } from '@/lib/branding/config'
import { ArrowRight, BookOpen, FileText, Gavel, Scale, Search, Shield, Users } from 'lucide-react'
import { FadeIn, StaggerChildren } from './animations'

const legalExampleMessages = [
  {
    heading: '車禍受傷可以請求什麼賠償？',
    message: '我在車禍中受傷了，可以向對方請求哪些賠償？需要準備什麼證據？',
    icon: Gavel,
    category: '民事損害賠償',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    heading: '租屋糾紛怎麼處理？',
    message: '房東不退還押金，我該怎麼辦？有什麼法律途徑可以解決？',
    icon: FileText,
    category: '租賃糾紛',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    heading: '勞資糾紛如何維權？',
    message: '公司無預警資遣我，沒有給資遣費，我可以主張什麼權利？',
    icon: Users,
    category: '勞動法',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    heading: '消費糾紛退款問題',
    message: '網購商品有瑕疵，賣家不處理，我可以要求退款嗎？',
    icon: Shield,
    category: '消費者保護',
    color: 'text-amber-600 dark:text-amber-400'
  },
  {
    heading: '遺產繼承順序與比例',
    message: '父親過世沒有留遺囑，遺產要怎麼分配？繼承順序是什麼？',
    icon: Scale,
    category: '繼承法',
    color: 'text-red-600 dark:text-red-400'
  },
  {
    heading: '查詢相關判決案例',
    message: '我想查詢類似的判決案例，看看法院通常怎麼判？',
    icon: Search,
    category: '判決書查詢',
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
                常見法律問題
              </h2>
            </div>
            <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
              點擊下方問題開始諮詢，或直接輸入您的問題
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
              <span>AI 驅動的智能法律助理 · 整合司法院判決書系統</span>
              <Scale className="size-3" />
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="size-3 text-green-500" />
                  <span>隱私保護</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                  <FileText className="size-3 text-blue-500" />
                  <span>引用來源</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                  <Gavel className="size-3 text-purple-500" />
                  <span>判決案例</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}