// 品牌配置系統 - 集中管理所有品牌相關信息
export const BRAND_CONFIG = {
  // 基本品牌信息
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Legal Mentor',
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'AI-Powered Legal Research Assistant',
  description: process.env.NEXT_PUBLIC_BRAND_DESCRIPTION || 'A fully open-source AI-powered legal research engine with intelligent analysis.',
  
  // URL 和域名
  domain: process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'legalmentor.ai',
  url: process.env.NEXT_PUBLIC_BRAND_URL || 'https://legalmentor.ai',
  
  // 社交媒體
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@legalmentor',
    github: process.env.NEXT_PUBLIC_GITHUB_REPO || 'legalmentor/legalmentor',
  },
  
  // 品牌色彩
  colors: {
    primary: process.env.NEXT_PUBLIC_BRAND_PRIMARY_COLOR || '#1e40af', // 法律藍
    secondary: process.env.NEXT_PUBLIC_BRAND_SECONDARY_COLOR || '#dc2626', // 法律紅
    accent: process.env.NEXT_PUBLIC_BRAND_ACCENT_COLOR || '#059669', // 成功綠
  },
  
  // 法律專業特色
  legal: {
    specialties: [
      'Contract Analysis',
      'Legal Research',
      'Case Law Search',
      'Regulatory Compliance',
      'Document Review'
    ],
    jurisdictions: [
      'Federal Law',
      'State Law',
      'International Law',
      'Corporate Law',
      'Intellectual Property'
    ]
  },
  
  // 功能特色
  features: {
    aiPowered: 'AI-Powered Legal Analysis',
    comprehensive: 'Comprehensive Legal Database',
    realTime: 'Real-time Legal Updates',
    secure: 'Attorney-Client Privilege Protected'
  }
} as const

// 品牌配置 Hook
export function useBrandConfig() {
  return BRAND_CONFIG
}

// 動態品牌信息獲取
export function getBrandInfo() {
  return {
    name: BRAND_CONFIG.name,
    fullName: `${BRAND_CONFIG.name} - ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.description,
    url: BRAND_CONFIG.url,
    domain: BRAND_CONFIG.domain,
    colors: BRAND_CONFIG.colors,
    social: BRAND_CONFIG.social
  }
}