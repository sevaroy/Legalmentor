# Vercel 部署指南 - Legal Mentor

## 問題診斷
如果部署到 Vercel 後 UI 沒有變化，這是因為環境變數沒有正確設置。

## 解決方案

### 1. 在 Vercel 控制台設置環境變數

登入 [Vercel Dashboard](https://vercel.com/dashboard)，找到你的項目，然後：

1. 點擊項目名稱
2. 進入 **Settings** 標籤
3. 點擊左側的 **Environment Variables**
4. 添加以下環境變數：

```bash
# 啟用 Legal Mentor 品牌
NEXT_PUBLIC_LEGAL_MENTOR_BRANDING=true

# 品牌信息
NEXT_PUBLIC_BRAND_NAME=Legal Mentor
NEXT_PUBLIC_BRAND_TAGLINE=AI-Powered Legal Research Assistant
NEXT_PUBLIC_BRAND_DESCRIPTION=A fully open-source AI-powered legal research engine with intelligent analysis.
NEXT_PUBLIC_BRAND_DOMAIN=legalmentor.ai
NEXT_PUBLIC_BRAND_URL=https://legalmentor.ai
NEXT_PUBLIC_TWITTER_HANDLE=@legalmentor

# UI 功能開關
NEXT_PUBLIC_ENHANCED_CHAT_PANEL=false
NEXT_PUBLIC_ENHANCED_SIDEBAR=false
NEXT_PUBLIC_ENHANCED_EMPTY_SCREEN=false
NEXT_PUBLIC_CHAT_ANIMATIONS=true
NEXT_PUBLIC_SEARCH_ANIMATIONS=true

# API Keys (必須設置)
OPENAI_API_KEY=你的_OpenAI_API_Key
TAVILY_API_KEY=你的_Tavily_API_Key
```

### 2. 重新部署

設置完環境變數後：
1. 回到 **Deployments** 標籤
2. 點擊最新部署旁的三個點
3. 選擇 **Redeploy**
4. 確保選擇 **Use existing Build Cache** 為 false

### 3. 驗證部署

部署完成後，訪問你的網站應該會看到：
- 法律助手的藍色主題
- Legal Mentor 品牌標識
- 法律專業的輸入提示
- 垂直居中的佈局

## 快速檢查

如果還是沒有變化，可以：

1. **檢查瀏覽器控制台** - 看是否有 JavaScript 錯誤
2. **清除瀏覽器緩存** - 強制刷新 (Ctrl+Shift+R 或 Cmd+Shift+R)
3. **檢查網絡標籤** - 確保所有資源都正確加載
4. **訪問測試頁面** - 直接訪問 `/test-legal-mentor` 查看組件是否正常

## 故障排除

### 如果環境變數沒有生效：
```bash
# 檢查構建日誌中是否包含正確的環境變數
# 在 Vercel 的 Functions 標籤中查看構建日誌
```

### 如果樣式沒有應用：
```bash
# 確保 Tailwind CSS 正確編譯
# 檢查 tailwind.config.ts 是否包含所有必要的路徑
```

### 如果組件沒有加載：
```bash
# 檢查 components/brand-aware-chat-panel.tsx
# 確保條件邏輯正確執行
```

## 聯繫支持

如果問題仍然存在，請提供：
1. Vercel 部署 URL
2. 瀏覽器控制台錯誤截圖
3. 環境變數設置截圖