import { withFeatureFlag } from '@/lib/feature-flags'
import AppSidebar from './app-sidebar'
import EnhancedAppSidebar from './enhanced-app-sidebar'

// 漸進式側邊欄
export const ProgressiveAppSidebar = withFeatureFlag(
  'ENHANCED_SIDEBAR',
  EnhancedAppSidebar,
  AppSidebar
)

export default ProgressiveAppSidebar