# Legal Mentor - GitHub Pages

這個資料夾包含了 Legal Mentor 項目的 GitHub Pages 網站文件。

## 文件結構

```
docs/github-pages/
├── index.html              # 主頁面
├── _config.yml             # Jekyll 配置
├── README.md               # 說明文件
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署工作流程
└── assets/
    └── images/             # 圖片資源
```

## 功能特色

- 🎨 **現代化設計** - 使用 Tailwind CSS 構建的響應式設計
- ⚖️ **法律專業主題** - 專為法律研究工具設計的界面
- 🚀 **自動部署** - 通過 GitHub Actions 自動部署到 GitHub Pages
- 📱 **移動端優化** - 完全響應式設計，支持所有設備
- 🔍 **SEO 優化** - 包含完整的 meta 標籤和 Open Graph 支持

## 部署說明

### 自動部署

1. 將此資料夾的內容複製到你的 GitHub 倉庫根目錄
2. 在 GitHub 倉庫設置中啟用 GitHub Pages
3. 選擇 "GitHub Actions" 作為部署源
4. 推送代碼到 main 分支，GitHub Actions 會自動部署

### 手動部署

如果你想手動部署到 GitHub Pages：

1. 將 `docs/github-pages/` 的內容複製到倉庫根目錄
2. 在 GitHub 倉庫設置中啟用 GitHub Pages
3. 選擇 "Deploy from a branch" 並選擇 main 分支

## 自定義

### 修改內容

- 編輯 `index.html` 來修改頁面內容
- 修改 `_config.yml` 來更新網站配置
- 在 `assets/images/` 中添加圖片資源

### 樣式自定義

頁面使用 Tailwind CSS，你可以：
- 修改 HTML 中的 CSS 類來調整樣式
- 在 `<style>` 標籤中添加自定義 CSS
- 使用 Tailwind 的配置來自定義主題

## 網站功能

### 主要區塊

1. **導航欄** - 包含 Logo 和主要導航連結
2. **Hero 區塊** - 主要標題和 CTA 按鈕
3. **功能介紹** - 六個主要功能的詳細說明
4. **演示區塊** - 引導用戶體驗產品
5. **頁腳** - 包含連結和版權信息

### 互動功能

- 平滑滾動導航
- 懸停動畫效果
- 響應式設計
- 外部連結支持

## 技術規格

- **框架**: 純 HTML/CSS/JavaScript
- **樣式**: Tailwind CSS (CDN)
- **字體**: Google Fonts (Inter)
- **圖標**: 內嵌 SVG
- **部署**: GitHub Pages + GitHub Actions

## 瀏覽器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 貢獻

如果你想改進這個 GitHub Pages 網站：

1. Fork 這個倉庫
2. 創建功能分支
3. 提交你的更改
4. 創建 Pull Request

## 許可證

這個項目使用與主項目相同的開源許可證。