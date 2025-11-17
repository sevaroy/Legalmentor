/**
 * 通用過渡效果工具類
 * Utility classes for common transitions and animations
 */

// 標準過渡效果
export const transitions = {
  // 基礎過渡
  base: 'transition-all duration-200 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',

  // 顏色過渡
  colors: 'transition-colors duration-200 ease-in-out',

  // 變換過渡
  transform: 'transition-transform duration-200 ease-in-out',

  // 不透明度過渡
  opacity: 'transition-opacity duration-200 ease-in-out',

  // 組合過渡
  all: 'transition-all duration-200 ease-out',

  // 彈跳效果
  bounce: 'transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',

  // 平滑效果
  smooth: 'transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]',
} as const

// 懸停效果
export const hoverEffects = {
  // 提升效果
  lift: 'hover:transform hover:-translate-y-1 hover:shadow-md',
  liftSubtle: 'hover:transform hover:-translate-y-0.5 hover:shadow-sm',

  // 縮放效果
  scale: 'hover:scale-105 active:scale-95',
  scaleSubtle: 'hover:scale-102 active:scale-98',

  // 亮度效果
  brighten: 'hover:brightness-110',
  dim: 'hover:brightness-90',

  // 不透明度效果
  fadeIn: 'hover:opacity-100 opacity-80',
  fadeOut: 'hover:opacity-80 opacity-100',

  // 陰影效果
  shadowGrow: 'hover:shadow-lg shadow-md',
  shadowSubtle: 'hover:shadow-md shadow-sm',

  // 邊框效果
  borderGlow: 'hover:border-primary/50 hover:ring-1 hover:ring-primary/20',
} as const

// 焦點效果
export const focusEffects = {
  // 標準焦點環
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

  // 主色焦點環
  primary: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',

  // 無偏移焦點環
  ringNoOffset: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',

  // 內部焦點環
  ringInset: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
} as const

// 激活狀態效果
export const activeEffects = {
  // 按下效果
  press: 'active:scale-[0.98]',
  pressSubtle: 'active:scale-[0.99]',

  // 陰影效果
  shadowReduce: 'active:shadow-sm',
  shadowNone: 'active:shadow-none',
} as const

// 載入狀態效果
export const loadingEffects = {
  pulse: 'animate-pulse',
  pulseSubtle: 'animate-pulse-subtle',
  spin: 'animate-spin',
  shimmer: 'animate-shimmer',
} as const

// 進入/退出動畫
export const enterExitAnimations = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  scaleIn: 'animate-scale-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideInRight: 'animate-slide-in-right',
  slideOutRight: 'animate-slide-out-right',
} as const

// 組合工具函數
export function combineTransitions(...effects: string[]): string {
  return effects.filter(Boolean).join(' ')
}

// 預設組合
export const commonCombinations = {
  // 互動按鈕
  interactiveButton: combineTransitions(
    transitions.base,
    hoverEffects.scale,
    focusEffects.ring,
    activeEffects.press
  ),

  // 卡片懸停
  interactiveCard: combineTransitions(
    transitions.slow,
    hoverEffects.liftSubtle,
    hoverEffects.shadowGrow
  ),

  // 連結懸停
  interactiveLink: combineTransitions(
    transitions.colors,
    hoverEffects.fadeIn,
    focusEffects.ring
  ),

  // 輸入框焦點
  interactiveInput: combineTransitions(
    transitions.colors,
    focusEffects.primary,
    hoverEffects.borderGlow
  ),

  // 圖片載入
  imageLoading: combineTransitions(
    transitions.opacity,
    loadingEffects.shimmer
  ),
} as const

// 移動端觸控反饋
export const touchFeedback = {
  // 標準觸控反饋
  standard: 'active:bg-accent/50 active:scale-[0.98] transition-all duration-100',

  // 精細觸控反饋
  subtle: 'active:bg-accent/30 active:scale-[0.99] transition-all duration-100',

  // 無縮放觸控反饋
  noScale: 'active:bg-accent/50 transition-colors duration-100',
} as const

// 無障礙輔助
export const a11y = {
  // 減少動畫（尊重用戶偏好）
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',

  // 高對比度模式
  highContrast: 'contrast-more:border-2 contrast-more:border-current',

  // 跳過內容連結
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground',
} as const
