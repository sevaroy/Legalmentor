import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // 目前僅支持繁體中文
  const locale = 'zh-TW'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
