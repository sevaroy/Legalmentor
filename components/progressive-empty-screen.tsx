import { withFeatureFlag } from '@/lib/feature-flags'
import { EmptyScreen } from './empty-screen'
import { EnhancedEmptyScreen } from './enhanced-empty-screen'

// 漸進式空白屏幕
export const ProgressiveEmptyScreen = withFeatureFlag(
  'ENHANCED_EMPTY_SCREEN',
  EnhancedEmptyScreen,
  EmptyScreen
)

export default ProgressiveEmptyScreen