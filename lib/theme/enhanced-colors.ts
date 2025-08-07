// 增強的色彩系統
export const enhancedColors = {
  // 主色調變化
  primary: {
    50: 'hsl(210, 100%, 98%)',
    100: 'hsl(210, 100%, 95%)',
    200: 'hsl(210, 100%, 90%)',
    300: 'hsl(210, 100%, 80%)',
    400: 'hsl(210, 100%, 70%)',
    500: 'hsl(210, 100%, 60%)', // 主色
    600: 'hsl(210, 100%, 50%)',
    700: 'hsl(210, 100%, 40%)',
    800: 'hsl(210, 100%, 30%)',
    900: 'hsl(210, 100%, 20%)',
  },
  
  // 語義化顏色
  semantic: {
    success: 'hsl(142, 76%, 36%)',
    warning: 'hsl(38, 92%, 50%)',
    error: 'hsl(0, 84%, 60%)',
    info: 'hsl(210, 100%, 60%)',
  },
  
  // AI 專用顏色
  ai: {
    thinking: 'hsl(280, 100%, 70%)',
    processing: 'hsl(200, 100%, 60%)',
    complete: 'hsl(142, 76%, 36%)',
    error: 'hsl(0, 84%, 60%)',
  },
  
  // 漸變色
  gradients: {
    primary: 'linear-gradient(135deg, hsl(210, 100%, 60%) 0%, hsl(210, 100%, 40%) 100%)',
    secondary: 'linear-gradient(135deg, hsl(0, 0%, 96%) 0%, hsl(0, 0%, 89%) 100%)',
    accent: 'linear-gradient(135deg, hsl(280, 100%, 70%) 0%, hsl(210, 100%, 60%) 100%)',
  }
}

// 動態主題切換
export const getThemeColors = (isDark: boolean) => ({
  background: isDark ? 'hsl(0, 0%, 3.9%)' : 'hsl(0, 0%, 100%)',
  foreground: isDark ? 'hsl(0, 0%, 98%)' : 'hsl(0, 0%, 3.9%)',
  card: isDark ? 'hsl(0, 0%, 14.9%)' : 'hsl(0, 0%, 96.1%)',
  border: isDark ? 'hsl(0, 0%, 14.9%)' : 'hsl(0, 0%, 89.8%)',
  primary: isDark ? 'hsl(210, 100%, 70%)' : 'hsl(210, 100%, 50%)',
})

// 色彩工具函數
export const colorUtils = {
  // 透明度調整
  withOpacity: (color: string, opacity: number) => 
    color.replace(')', `, ${opacity})`).replace('hsl(', 'hsla('),
  
  // 亮度調整
  adjustLightness: (hsl: string, adjustment: number) => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    if (!match) return hsl
    
    const [, h, s, l] = match
    const newL = Math.max(0, Math.min(100, parseInt(l) + adjustment))
    return `hsl(${h}, ${s}%, ${newL}%)`
  }
}