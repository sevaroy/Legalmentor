// 動畫配置常數
export const ANIMATION_CONFIG = {
  // 基本動畫時長
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800
  },
  
  // 緩動函數
  easings: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // 延遲設定
  delays: {
    none: 0,
    short: 100,
    medium: 200,
    long: 400
  },
  
  // React Spring 配置
  spring: {
    gentle: { tension: 280, friction: 60 },
    wobbly: { tension: 180, friction: 12 },
    stiff: { tension: 210, friction: 20 },
    slow: { tension: 280, friction: 120 },
    molasses: { tension: 280, friction: 200 }
  }
}

// 響應式動畫設定
export const RESPONSIVE_ANIMATIONS = {
  // 在移動設備上減少動畫
  mobile: {
    reducedMotion: true,
    simplifiedAnimations: true,
    shorterDurations: true
  },
  
  // 桌面設備完整動畫
  desktop: {
    reducedMotion: false,
    simplifiedAnimations: false,
    shorterDurations: false
  }
}

// 用戶偏好檢測
export const checkReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 設備檢測
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}