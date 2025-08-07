# Legal Mentor GitHub Pages 部署指南

## 🚀 快速部署

### 方法一：自動部署（推薦）

1. **複製文件到倉庫根目錄**
   ```bash
   # 在你的 Legal Mentor 倉庫根目錄執行
   cp -r docs/github-pages/* .
   cp -r docs/github-pages/.github .
   ```

2. **提交並推送**
   ```bash
   git add .
   git commit -m "feat: 添加 GitHub Pages 網站"
   git push origin main
   ```

3. **啟用 GitHub Pages**
   - 前往 GitHub 倉庫設置
   - 點擊 "Pages" 選項
   - 在 "Source" 下選擇 "GitHub Actions"
   - 保存設置

4. **等待部署完成**
   - GitHub Actions 會自動運行
   - 部署完成後，網站將在 `https://你的用戶名.github.io/Legalmentor/` 可用

### 方法二：手動部署

1. **創建 gh-pages 分支**
   ```bash
   git checkout -b gh-pages
   ```

2. **複製文件**
   ```bash
   cp docs/github-pages/index.html .
   cp docs/github-pages/robots.txt .
   cp docs/github-pages/sitemap.xml .
   ```

3. **提交並推送**
   ```bash
   git add .
   git commit -m "feat: GitHub Pages 網站"
   git push origin gh-pages
   ```

4. **設置 GitHub Pages**
   - 前往 GitHub 倉庫設置
   - 點擊 "Pages" 選項
   - 選擇 "Deploy from a branch"
   - 選擇 "gh-pages" 分支
   - 保存設置

## 📁 文件說明

### 核心文件

- `index.html` - 主頁面，包含完整的網站內容
- `_config.yml` - Jekyll 配置文件
- `robots.txt` - 搜索引擎爬蟲指令
- `sitemap.xml` - 網站地圖

### 部署文件

- `.github/workflows/deploy.yml` - GitHub Actions 自動部署工作流程

## 🎨 自定義網站

### 修改內容

1. **更新標題和描述**
   ```html
   <!-- 在 index.html 中修改 -->
   <title>你的標題</title>
   <meta name="description" content="你的描述">
   ```

2. **修改 Logo 和品牌**
   - 替換 SVG 圖標
   - 更新品牌名稱
   - 修改色彩主題

3. **更新連結**
   ```html
   <!-- 更新 GitHub 連結 -->
   <a href="https://github.com/你的用戶名/你的倉庫">GitHub</a>
   
   <!-- 更新 Demo 連結 -->
   <a href="https://你的域名.vercel.app">立即使用</a>
   ```

### 樣式自定義

1. **修改顏色主題**
   ```css
   /* 在 <style> 標籤中修改 */
   .gradient-bg {
       background: linear-gradient(135deg, #你的顏色 0%, #你的顏色 100%);
   }
   ```

2. **調整佈局**
   - 使用 Tailwind CSS 類
   - 修改 grid 佈局
   - 調整間距和大小

## 🔧 進階配置

### 自定義域名

1. **添加 CNAME 文件**
   ```bash
   echo "你的域名.com" > CNAME
   ```

2. **在 GitHub 設置中配置自定義域名**

### SEO 優化

1. **更新 meta 標籤**
   ```html
   <meta property="og:title" content="你的標題">
   <meta property="og:description" content="你的描述">
   <meta property="og:image" content="你的圖片URL">
   ```

2. **添加 Google Analytics**
   ```html
   <!-- 在 </head> 前添加 -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

### 性能優化

1. **圖片優化**
   - 使用 WebP 格式
   - 添加 lazy loading
   - 壓縮圖片大小

2. **CSS 優化**
   - 使用 Tailwind CSS 的 purge 功能
   - 內聯關鍵 CSS
   - 壓縮 CSS

## 🐛 故障排除

### 常見問題

1. **頁面顯示 404**
   - 檢查 GitHub Pages 是否已啟用
   - 確認分支設置正確
   - 等待幾分鐘讓部署完成

2. **樣式沒有加載**
   - 檢查 Tailwind CSS CDN 連結
   - 確認網絡連接正常
   - 清除瀏覽器緩存

3. **GitHub Actions 失敗**
   - 檢查 workflow 文件語法
   - 確認權限設置正確
   - 查看 Actions 日誌

### 調試技巧

1. **本地測試**
   ```bash
   # 使用 Python 簡單服務器
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   ```

2. **檢查控制台錯誤**
   - 打開瀏覽器開發者工具
   - 查看 Console 和 Network 標籤
   - 修復任何錯誤

## 📊 監控和分析

### 添加分析工具

1. **Google Analytics**
2. **Google Search Console**
3. **GitHub Pages 內建分析**

### 性能監控

1. **PageSpeed Insights**
2. **GTmetrix**
3. **WebPageTest**

## 🔄 更新和維護

### 定期更新

1. **內容更新**
   - 定期檢查連結
   - 更新功能描述
   - 添加新功能介紹

2. **技術更新**
   - 更新 Tailwind CSS 版本
   - 檢查瀏覽器兼容性
   - 優化性能

### 備份

1. **定期備份**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **版本控制**
   - 使用語義化版本
   - 記錄更改日誌
   - 保持分支整潔

## 📞 支持

如果遇到問題：

1. 檢查 [GitHub Pages 文檔](https://docs.github.com/en/pages)
2. 查看 [Jekyll 文檔](https://jekyllrb.com/docs/)
3. 在項目中創建 Issue

---

**祝你部署順利！** 🎉