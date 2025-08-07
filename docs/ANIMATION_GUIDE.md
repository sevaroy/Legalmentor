# 動畫組件使用指南

本項目提供了多種動畫效果，包括基於 React Spring 的高級動畫和基於 Tailwind CSS 的簡單動畫。

## 🎨 動畫框架

### 1. React Spring
- **優勢**: 基於物理的動畫，流暢自然
- **適用**: 複雜的交互動畫、狀態轉換
- **性能**: 優秀，使用 requestAnimationFrame

### 2. Tailwind CSS 動畫
- **優勢**: 簡單易用，CSS 原生支持
- **適用**: 簡單的進入/退出動畫
- **性能**: 良好，CSS 動畫

## 📦 可用組件

### React Spring 組件

#### FadeIn - 淡入動畫
```tsx
import { FadeIn } from '@/components/animations'

<FadeIn delay={200} duration={500}>
  <div>內容</div>
</FadeIn>
```

#### SlideIn - 滑入動畫
```tsx
import { SlideIn } from '@/components/animations'

<SlideIn direction="left" delay={100}>
  <div>內容</div>
</SlideIn>
```

#### TypingAnimation - 打字機效果
```tsx
import { TypingAnimation } from '@/components/animations'

<TypingAnimation 
  text="要顯示的文字"
  speed={50}
  onComplete={() => console.log('完成')}
/>
```

#### LoadingDots - 載入點動畫
```tsx
import { LoadingDots } from '@/components/animations'

<LoadingDots size="md" color="bg-primary" />
```

#### StaggerChildren - 錯開子元素動畫
```tsx
import { StaggerChildren } from '@/components/animations'

<StaggerChildren staggerDelay={100}>
  <div>項目 1</div>
  <div>項目 2</div>
  <div>項目 3</div>
</StaggerChildren>
```

### 聊天專用動畫

#### AnimatedMessageBubble - 消息氣泡動畫
```tsx
import { AnimatedMessageBubble } from '@/components/animations'

<AnimatedMessageBubble isUser={false} delay={0}>
  <div className="message-content">消息內容</div>
</AnimatedMessageBubble>
```

#### TypingIndicator - 打字指示器
```tsx
import { TypingIndicator } from '@/components/animations'

<TypingIndicator />
```

#### AnimatedSearchResult - 搜索結果動畫
```tsx
import { AnimatedSearchResult } from '@/components/animations'

{results.map((result, index) => (
  <AnimatedSearchResult key={result.id} index={index}>
    <SearchResultCard result={result} />
  </AnimatedSearchResult>
))}
```

### Tailwind CSS 動畫

#### 基本動畫組件
```tsx
import { 
  TailwindFadeIn,
  TailwindSlideIn,
  TailwindScaleIn,
  TailwindBounce
} from '@/components/animations'

<TailwindFadeIn>
  <div>淡入內容</div>
</TailwindFadeIn>
```

#### 直接使用 CSS 類
```tsx
// 自定義動畫
<div className="animate-float">浮動效果</div>
<div className="animate-glow">發光效果</div>
<div className="animate-wiggle">搖擺效果</div>
<div className="animate-typewriter">打字機效果</div>

// 內建動畫
<div className="animate-pulse">脈衝</div>
<div className="animate-bounce">彈跳</div>
<div className="animate-spin">旋轉</div>
```

## 🎯 使用建議

### 性能優化
1. **避免過度動畫**: 不要在同一時間運行太多動畫
2. **使用 will-change**: 對於複雜動畫添加 `will-change: transform`
3. **減少重繪**: 優先使用 transform 和 opacity 屬性

### 用戶體驗
1. **尊重用戶偏好**: 檢查 `prefers-reduced-motion`
2. **適度使用**: 動畫應該增強而不是干擾用戶體驗
3. **保持一致**: 在整個應用中使用一致的動畫風格

### 響應式設計
```tsx
// 在移動設備上禁用複雜動畫
<div className="animate-bounce md:animate-none">
  內容
</div>
```

## 🔧 自定義動畫

### 添加新的 Tailwind 動畫
在 `tailwind.config.ts` 中添加：

```typescript
keyframes: {
  'custom-animation': {
    '0%': { /* 起始狀態 */ },
    '100%': { /* 結束狀態 */ }
  }
},
animation: {
  'custom': 'custom-animation 1s ease-in-out'
}
```

### 創建新的 React Spring 組件
```tsx
import { useSpring, animated } from '@react-spring/web'

export function CustomAnimation({ children }) {
  const styles = useSpring({
    // 動畫配置
  })
  
  return (
    <animated.div style={styles}>
      {children}
    </animated.div>
  )
}
```

## 📱 測試動畫

訪問 `/animation-showcase` 查看所有可用的動畫效果。

## 🐛 常見問題

### React Spring 動畫不工作
- 確保已安裝 `@react-spring/web`
- 檢查 React 版本兼容性

### Tailwind 動畫不顯示
- 確保 `tailwindcss-animate` 已安裝
- 檢查 Tailwind 配置是否正確

### 性能問題
- 使用 Chrome DevTools 檢查動畫性能
- 考慮使用 `transform` 而不是改變佈局屬性