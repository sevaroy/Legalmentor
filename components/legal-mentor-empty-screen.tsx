import { FileText, Gavel, Shield, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

const legalExampleMessages = [
  {
    heading: '車禍受傷可以請求什麼賠償？',
    message: '我在車禍中受傷了，可以向對方請求哪些賠償？需要準備什麼證據？',
    icon: Gavel
  },
  {
    heading: '租屋糾紛怎麼處理？',
    message: '房東不退還押金，我該怎麼辦？有什麼法律途徑可以解決？',
    icon: FileText
  },
  {
    heading: '勞資糾紛如何維權？',
    message: '公司無預警資遣我，沒有給資遣費，我可以主張什麼權利？',
    icon: Users
  },
  {
    heading: '消費糾紛退款問題',
    message: '網購商品有瑕疵，賣家不處理，我可以要求退款嗎？',
    icon: Shield
  }
]

export function LegalMentorEmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="mt-8">
        {/* 示例問題網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legalExampleMessages.map((message, index) => {
            const IconComponent = message.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-5 text-left justify-start hover:bg-accent/50 hover:border-primary/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl group"
                onClick={() => submitMessage(message.message)}
              >
                <div className="flex items-start space-x-4 w-full">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
                      <IconComponent className="size-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {message.heading}
                    </p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}