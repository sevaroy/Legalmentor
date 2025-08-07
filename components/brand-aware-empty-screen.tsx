// 品牌感知的空白屏幕 - 根據環境變數在構建時選擇組件
import { EmptyScreen } from './empty-screen'
import { EnhancedEmptyScreen } from './enhanced-empty-screen'
import { LegalMentorEmptyScreen } from './legal-mentor-empty-screen'

// 在構建時根據環境變數選擇組件
const isLegalMentorBranding = process.env.NEXT_PUBLIC_LEGAL_MENTOR_BRANDING === 'true'
const isEnhancedEmptyScreen = process.env.NEXT_PUBLIC_ENHANCED_EMPTY_SCREEN === 'true'

let BrandAwareEmptyScreen: typeof EmptyScreen

if (isLegalMentorBranding) {
  BrandAwareEmptyScreen = LegalMentorEmptyScreen
} else if (isEnhancedEmptyScreen) {
  BrandAwareEmptyScreen = EnhancedEmptyScreen
} else {
  BrandAwareEmptyScreen = EmptyScreen
}

export default BrandAwareEmptyScreen