// 品牌感知的側邊欄 - 根據環境變數在構建時選擇組件
import AppSidebar from './app-sidebar'
import EnhancedAppSidebar from './enhanced-app-sidebar'
import LegalMentorSidebar from './legal-mentor-sidebar'

// 在構建時根據環境變數選擇組件
const isLegalMentorBranding = process.env.NEXT_PUBLIC_LEGAL_MENTOR_BRANDING === 'true'
const isEnhancedSidebar = process.env.NEXT_PUBLIC_ENHANCED_SIDEBAR === 'true'

let BrandAwareSidebar: typeof AppSidebar

if (isLegalMentorBranding) {
  BrandAwareSidebar = LegalMentorSidebar
} else if (isEnhancedSidebar) {
  BrandAwareSidebar = EnhancedAppSidebar
} else {
  BrandAwareSidebar = AppSidebar
}

export default BrandAwareSidebar