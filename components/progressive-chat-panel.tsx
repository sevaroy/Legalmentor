'use client'

import { withFeatureFlag } from '@/lib/feature-flags'
import { ChatPanel } from './chat-panel'
import { EnhancedChatPanel } from './enhanced-chat-panel'

// 漸進式聊天面板 - 可以通過環境變量控制使用哪個版本
export const ProgressiveChatPanel = withFeatureFlag(
  'ENHANCED_CHAT_PANEL',
  EnhancedChatPanel,
  ChatPanel
)

export default ProgressiveChatPanel