#!/usr/bin/env node

/**
 * 環境變數檢查腳本
 * 用於驗證 Legal Mentor 部署所需的環境變數
 */

// 加載 .env.local 文件
const fs = require('fs')
const path = require('path')

function loadEnvFile(filePath) {
  try {
    const envContent = fs.readFileSync(filePath, 'utf8')
    const lines = envContent.split('\n')
    
    lines.forEach(line => {
      line = line.trim()
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=')
          process.env[key] = value
        }
      }
    })
  } catch (error) {
    console.log(`⚠️  無法加載 ${filePath}: ${error.message}`)
  }
}

// 加載環境變數文件
loadEnvFile(path.join(process.cwd(), '.env.local'))

console.log('🔍 檢查 Legal Mentor 環境變數...\n')

const requiredEnvVars = [
  'NEXT_PUBLIC_LEGAL_MENTOR_BRANDING',
  'NEXT_PUBLIC_BRAND_NAME',
  'NEXT_PUBLIC_BRAND_TAGLINE',
  'OPENAI_API_KEY',
  'TAVILY_API_KEY'
]

const optionalEnvVars = [
  'NEXT_PUBLIC_BRAND_DESCRIPTION',
  'NEXT_PUBLIC_BRAND_DOMAIN',
  'NEXT_PUBLIC_BRAND_URL',
  'NEXT_PUBLIC_TWITTER_HANDLE',
  'NEXT_PUBLIC_ENHANCED_CHAT_PANEL',
  'NEXT_PUBLIC_CHAT_ANIMATIONS'
]

let hasErrors = false

console.log('📋 必需的環境變數:')
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  if (value) {
    console.log(`✅ ${envVar}: ${envVar.includes('API_KEY') ? '***' : value}`)
  } else {
    console.log(`❌ ${envVar}: 未設置`)
    hasErrors = true
  }
})

console.log('\n📋 可選的環境變數:')
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  if (value) {
    console.log(`✅ ${envVar}: ${value}`)
  } else {
    console.log(`⚠️  ${envVar}: 未設置 (使用默認值)`)
  }
})

console.log('\n🎯 品牌配置檢查:')
const isLegalMentorEnabled = process.env.NEXT_PUBLIC_LEGAL_MENTOR_BRANDING === 'true'
console.log(`Legal Mentor 品牌: ${isLegalMentorEnabled ? '✅ 啟用' : '❌ 未啟用'}`)

if (isLegalMentorEnabled) {
  console.log('🎨 將使用 Legal Mentor 界面組件')
} else {
  console.log('🎨 將使用默認界面組件')
}

console.log('\n📊 總結:')
if (hasErrors) {
  console.log('❌ 發現缺失的必需環境變數，請設置後重新部署')
  process.exit(1)
} else {
  console.log('✅ 所有必需的環境變數都已設置')
  console.log('🚀 可以進行部署')
}