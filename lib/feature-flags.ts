// 功能開關系統 - 安全地控制新 UI 組件的啟用
export const FEATURE_FLAGS = {
  // UI 增強功能開關
  ENHANCED_CHAT_PANEL: process.env.NEXT_PUBLIC_ENHANCED_CHAT_PANEL === 'true',
  ENHANCED_SIDEBAR: process.env.NEXT_PUBLIC_ENHANCED_SIDEBAR === 'true',
  ENHANCED_EMPTY_SCREEN: process.env.NEXT_PUBLIC_ENHANCED_EMPTY_SCREEN === 'true',
  
  // 動畫功能開關
  CHAT_ANIMATIONS: process.env.NEXT_PUBLIC_CHAT_ANIMATIONS === 'true',
  SEARCH_ANIMATIONS: process.env.NEXT_PUBLIC_SEARCH_ANIMATIONS === 'true',
  
  // 品牌功能開關
  LEGAL_MENTOR_BRANDING: process.env.NEXT_PUBLIC_LEGAL_MENTOR_BRANDING === 'true',
  LEGAL_FEATURES: process.env.NEXT_PUBLIC_LEGAL_FEATURES === 'true',
  
  // 實驗性功能
  EXPERIMENTAL_FEATURES: process.env.NEXT_PUBLIC_EXPERIMENTAL_FEATURES === 'true',
} as const

// 功能開關 Hook
export function useFeatureFlag(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag] || false
}

// 漸進式啟用工具
export function withFeatureFlag<T>(
  flag: keyof typeof FEATURE_FLAGS,
  enhancedComponent: T,
  fallbackComponent: T
): T {
  return FEATURE_FLAGS[flag] ? enhancedComponent : fallbackComponent
}