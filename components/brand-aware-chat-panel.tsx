// 品牌感知的聊天面板 - 根據環境變數在構建時選擇組件
import { ChatPanel } from './chat-panel'
import { EnhancedChatPanel } from './enhanced-chat-panel'
import { LegalMentorChatPanel } from './legal-mentor-chat-panel'

// 在構建時根據環境變數選擇組件
const isLegalMentorBranding = process.env.NEXT_PUBLIC_LEGAL_MENTOR_BRANDING === 'true'
const isEnhancedChatPanel = process.env.NEXT_PUBLIC_ENHANCED_CHAT_PANEL === 'true'

let BrandAwareChatPanel: typeof ChatPanel

if (isLegalMentorBranding) {
  BrandAwareChatPanel = LegalMentorChatPanel
} else if (isEnhancedChatPanel) {
  BrandAwareChatPanel = EnhancedChatPanel
} else {
  BrandAwareChatPanel = ChatPanel
}

export default BrandAwareChatPanel