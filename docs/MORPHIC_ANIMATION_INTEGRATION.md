# Morphic 動畫集成指南

## 🎯 快速開始

### 1. 在聊天組件中使用動畫

替換現有的 `ChatMessages` 組件：

```tsx
// 原來的組件
import { ChatMessages } from './chat-messages'

// 替換為動畫版本
import { AnimatedChatMessages } from './animated-chat-messages'

// 在 Chat 組件中使用
<AnimatedChatMessages
  sections={sections}
  data={data}
  onQuerySelect={onQuerySelect}
  isLoading={isLoading}
  chatId={id}
  addToolResult={addToolResult}
  scrollContainerRef={scrollContainerRef}
  onUpdateMessage={handleUpdateAndReloadMessage}
  reload={handleReloadFrom}
/>
```

### 2. 在搜索結果中使用動畫

替換現有的 `SearchResults` 組件：

```tsx
// 原來的組件
import { SearchResults } from './search-results'

// 替換為動畫版本
import { AnimatedSearchResults } from './animated-search-results'

// 使用方式相同
<AnimatedSearchResults 
  results={searchResults}
  displayMode="grid"
/>
```

### 3. 添加 AI 思考動畫

在 AI 回應載入時顯示：

```tsx
import { AIThinkingAnimation } from './animations'

{isLoading && (
  <AIThinkingAnimation className="my-4" />
)}
```

### 4. 搜索進度指示器

```tsx
import { SearchProgressAnimation } from './animations'

const searchSteps = [
  '搜索相關資訊',
  '分析內容質量', 
  '生成智能回答',
  '優化展示效果'
]

<SearchProgressAnimation 
  steps={searchSteps}
  currentStep={currentSearchStep}
/>
```

## 🎨 推薦的集成方案

### 階段 1: 基礎動畫 (立即可用)
1. 替換 `ChatMessages` → `AnimatedChatMessages`
2. 替換 `SearchResults` → `AnimatedSearchResults`
3. 添加 `AIThinkingAnimation` 到載入狀態

### 階段 2: 進階動畫 (1-2天)
1. 集成 `SearchProgressAnimation`
2. 添加 `ModelSwitchAnimation` 到模型選擇器
3. 使用 `SmartLoadingAnimation` 替換簡單載入

### 階段 3: 完整體驗 (3-5天)
1. 添加 `SearchSuggestionsAnimation`
2. 集成 `ResultCounterAnimation`
3. 優化響應式動畫體驗

## 🔧 性能優化建議

### 1. 條件動畫載入
```tsx
import { useAnimationPreferences } from '@/lib/animations/hooks'

function MyComponent() {
  const { shouldAnimate, reducedMotion } = useAnimationPreferences()
  
  return shouldAnimate ? (
    <AnimatedComponent />
  ) : (
    <StaticComponent />
  )
}
```

### 2. 移動設備優化
```tsx
// 在移動設備上使用簡化動畫
const animationDelay = isMobile ? 50 : 150
```

### 3. 批量動畫控制
```tsx
// 使用 CSS 變量控制全局動畫
:root {
  --animation-duration: 300ms;
  --animation-delay: 100ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --animation-duration: 0ms;
    --animation-delay: 0ms;
  }
}
```

## 📱 響應式動畫

### 桌面端 (完整動畫)
- 所有動畫效果啟用
- 正常動畫時長
- 複雜的交互動畫

### 移動端 (簡化動畫)
- 減少動畫複雜度
- 縮短動畫時長
- 優先載入性能

### 低功耗模式
- 檢測 `prefers-reduced-motion`
- 禁用非必要動畫
- 保留重要的狀態指示動畫

## 🎯 具體集成步驟

### Step 1: 更新 Chat 組件
```tsx
// components/chat.tsx
import { AnimatedChatMessages } from './animated-chat-messages'

// 替換 ChatMessages 為 AnimatedChatMessages
```

### Step 2: 更新搜索結果
```tsx
// 在使用 SearchResults 的地方
import { AnimatedSearchResults } from './animated-search-results'
```

### Step 3: 添加載入動畫
```tsx
// 在 ChatPanel 或相關組件中
import { AIThinkingAnimation, SmartLoadingAnimation } from './animations'

{isLoading && (
  <SmartLoadingAnimation 
    stage="searching" 
    progress={loadingProgress}
  />
)}
```

## 🐛 常見問題解決

### 動畫不顯示
1. 檢查 React Spring 是否正確安裝
2. 確認組件正確導入
3. 檢查 CSS 是否被覆蓋

### 性能問題
1. 使用 `useAnimationPreferences` Hook
2. 在移動設備上簡化動畫
3. 避免同時運行過多動畫

### 兼容性問題
1. 確保 React 19 兼容性
2. 檢查 TypeScript 類型定義
3. 測試不同瀏覽器支持

## 📊 效果測量

### 用戶體驗指標
- 頁面載入時間
- 動畫流暢度 (60fps)
- 用戶互動響應時間

### 性能監控
```tsx
// 使用 Performance API 監控動畫性能
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('Animation performance:', entry)
  })
})
observer.observe({ entryTypes: ['measure'] })
```

這套動畫系統將為 Morphic 帶來更加生動和專業的用戶體驗！