#!/bin/bash

# Legal Mentor GitHub Pages 優化腳本
# 使用方法: ./optimize.sh

set -e

echo "🚀 Legal Mentor GitHub Pages 優化腳本"
echo "======================================"

# 檢查是否在正確的目錄
if [ ! -f "index.html" ]; then
    echo "❌ 錯誤: 請在 docs/github-pages 目錄執行此腳本"
    exit 1
fi

echo "📊 開始優化 GitHub Pages..."

# 1. 優化 HTML 文件
echo "🔧 優化 HTML 文件..."

# 添加更多 meta 標籤到 index.html
if ! grep -q "theme-color" index.html; then
    sed -i '' '/<meta name="twitter:image"/a\
    \
    <!-- Theme Color -->\
    <meta name="theme-color" content="#1e40af">\
    <meta name="msapplication-TileColor" content="#1e40af">\
    \
    <!-- Additional SEO -->\
    <meta name="robots" content="index, follow">\
    <meta name="googlebot" content="index, follow">\
    <meta name="author" content="Legal Mentor Team">\
    <meta name="keywords" content="legal research, AI, law, legal assistant, contract analysis, case law">\
    \
    <!-- Preconnect for performance -->\
    <link rel="preconnect" href="https://fonts.googleapis.com">\
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\
    <link rel="preconnect" href="https://cdn.tailwindcss.com">\
    ' index.html
    echo "✅ 添加了額外的 meta 標籤"
fi

# 2. 創建 manifest.json
echo "📱 創建 PWA manifest..."
cat > manifest.json << 'EOF'
{
  "name": "Legal Mentor - AI-Powered Legal Research Assistant",
  "short_name": "Legal Mentor",
  "description": "A fully open-source AI-powered legal research engine with intelligent analysis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity", "business", "education"],
  "lang": "zh-TW",
  "dir": "ltr"
}
EOF

# 3. 創建 service worker
echo "⚡ 創建 Service Worker..."
cat > sw.js << 'EOF'
const CACHE_NAME = 'legal-mentor-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/presentation.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
EOF

# 4. 創建 .htaccess 文件（如果需要）
echo "🔒 創建 .htaccess 文件..."
cat > .htaccess << 'EOF'
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
EOF

# 5. 優化 sitemap.xml
echo "🗺️ 更新 sitemap.xml..."
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://sevaroy.github.io/Legalmentor/</loc>
    <lastmod>2025-01-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://sevaroy.github.io/Legalmentor/assets/legal-mentor-preview.png</image:loc>
      <image:title>Legal Mentor - AI-Powered Legal Research Assistant</image:title>
      <image:caption>Professional legal research tool powered by AI</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://sevaroy.github.io/Legalmentor/presentation.html</loc>
    <lastmod>2025-01-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sevaroy.github.io/Legalmentor/#features</loc>
    <lastmod>2025-01-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sevaroy.github.io/Legalmentor/#demo</loc>
    <lastmod>2025-01-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF

# 6. 創建結構化數據
echo "📋 創建結構化數據..."
cat > structured-data.json << 'EOF'
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Legal Mentor",
  "description": "AI-Powered Legal Research Assistant - A fully open-source AI-powered legal research engine with intelligent analysis",
  "url": "https://sevaroy.github.io/Legalmentor/",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Legal Mentor Team"
  },
  "softwareVersion": "1.0.0",
  "datePublished": "2025-01-08",
  "screenshot": "https://sevaroy.github.io/Legalmentor/assets/legal-mentor-preview.png",
  "featureList": [
    "Contract Analysis",
    "Case Law Search",
    "Compliance Check",
    "Legal Research",
    "AI Analysis",
    "Secure & Confidential"
  ]
}
EOF

# 7. 創建性能優化的 CSS
echo "🎨 創建優化的 CSS..."
cat > assets/optimized.css << 'EOF'
/* Critical CSS for above-the-fold content */
.legal-gradient{background:linear-gradient(135deg,#1e40af 0%,#3b82f6 50%,#60a5fa 100%)}
.legal-pattern{background-image:radial-gradient(circle at 25% 25%,rgba(255,255,255,0.1) 2px,transparent 2px),radial-gradient(circle at 75% 75%,rgba(255,255,255,0.1) 2px,transparent 2px);background-size:50px 50px}
.animate-float{animation:float 6s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-20px)}}
.feature-card{transition:all 0.3s ease}
.feature-card:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(30,64,175,0.2)}

/* Preload critical fonts */
@font-face{font-family:'Inter';font-style:normal;font-weight:400;font-display:swap;src:url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2') format('woff2')}
EOF

echo "✅ 優化完成！"
echo ""
echo "📊 優化項目："
echo "- ✅ 添加了額外的 SEO meta 標籤"
echo "- ✅ 創建了 PWA manifest.json"
echo "- ✅ 添加了 Service Worker 支持"
echo "- ✅ 創建了 .htaccess 性能優化"
echo "- ✅ 更新了 sitemap.xml"
echo "- ✅ 添加了結構化數據"
echo "- ✅ 創建了優化的 CSS"
echo ""
echo "🚀 建議下一步："
echo "1. 添加實際的圖標文件到 assets/ 目錄"
echo "2. 測試 PWA 功能"
echo "3. 運行 Lighthouse 性能測試"
echo "4. 提交更改到 Git"
echo ""
echo "🎉 GitHub Pages 優化完成！"