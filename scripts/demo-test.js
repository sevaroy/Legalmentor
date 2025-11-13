#!/usr/bin/env node
/**
 * LegalMentor 搜索功能模擬測試
 * 展示測試流程（不需要真實 API Keys）
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '='.repeat(80))
  log(title, colors.bright + colors.cyan)
  console.log('='.repeat(80) + '\n')
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green)
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow)
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  log('\n🧪 LegalMentor 搜索功能模擬測試\n', colors.bright + colors.cyan)
  log('展示測試流程（模擬模式 - 不需要真實 API Keys）\n')

  // 環境檢查
  logSection('環境變數檢查')
  logWarning('OPENAI_API_KEY: 使用佔位符（需要真實 Key 才能測試）')
  logWarning('TAVILY_API_KEY: 使用佔位符（需要真實 Key 才能測試）')
  logWarning('EXA_API_KEY: 使用佔位符（需要真實 Key 才能測試）')

  console.log('\n如要設定真實 API Keys，請執行：')
  console.log('  bash scripts/setup-api-keys.sh\n')

  // 模擬 Tavily 測試
  logSection('模擬 Tavily Search API 測試')
  logInfo('執行搜索：「台灣 車禍賠償 判決」')
  await sleep(1000)

  logSuccess('Tavily 搜索成功（模擬）：找到 5 筆結果')

  console.log('\n模擬結果（前 2 筆）：')
  console.log('\n  1. 臺灣臺北地方法院 110 年度訴字第 1234 號民事判決')
  console.log('     URL: https://judgment.judicial.gov.tw/FJUD/data.aspx?...')
  console.log('     內容: 原告因車禍事故受傷，請求被告賠償醫療費用、精神慰撫金...')

  console.log('\n  2. 全國法規資料庫 - 民法第 184 條')
  console.log('     URL: https://law.moj.gov.tw/LawClass/LawSingle.aspx?...')
  console.log('     內容: 因故意或過失，不法侵害他人之權利者，負損害賠償責任...')

  logSuccess('✓ 結果包含司法院判決書')

  // 模擬 Exa 測試
  logSection('模擬 Exa Search API 測試')
  logInfo('執行搜索：「台灣 勞資糾紛 判決」')
  await sleep(1000)

  logSuccess('Exa 搜索成功（模擬）：找到 5 筆結果')

  console.log('\n模擬結果（前 2 筆）：')
  console.log('\n  1. 臺灣高等法院 111 年度勞上字第 56 號民事判決')
  console.log('     URL: https://judgment.judicial.gov.tw/FJUD/data.aspx?...')
  console.log('     內容: 關於勞工遭無預警資遣，請求資遣費及預告期間工資...')

  console.log('\n  2. 勞動基準法第 17 條 - 資遣費規定')
  console.log('     URL: https://law.moj.gov.tw/LawClass/LawSingle.aspx?...')
  console.log('     內容: 雇主依前條終止勞動契約者，應依下列規定發給勞工資遣費...')

  // 模擬雙引擎測試
  logSection('模擬雙引擎並行搜索')
  logInfo('同時使用 Tavily + Exa 搜索：「租賃糾紛 押金」')

  const startTime = Date.now()
  await sleep(1500)
  const duration = Date.now() - startTime

  logSuccess(`雙引擎搜索完成（${duration}ms）：Tavily 5 筆 + Exa 5 筆`)
  console.log('\n去重後：8 筆結果')

  console.log('\n合併結果（前 3 筆）：')
  console.log('\n  1. 臺灣臺北地方法院 - 租賃押金返還糾紛')
  console.log('     URL: https://judgment.judicial.gov.tw/...')

  console.log('\n  2. 民法第 423 條 - 租賃物返還')
  console.log('     URL: https://law.moj.gov.tw/...')

  console.log('\n  3. 法源法律網 - 租賃押金實務見解')
  console.log('     URL: https://lawbank.com.tw/...')

  // 模擬域名優先測試
  logSection('模擬台灣法律網域優先測試')
  logInfo('搜索「民法 184 條」並檢查域名優先級')
  await sleep(1000)

  logSuccess('找到 10 筆結果，其中 7 筆來自台灣法律網站（70%）')

  console.log('\n台灣法律網站結果：')
  console.log('  1. 全國法規資料庫 - 民法第 184 條')
  console.log('     https://law.moj.gov.tw/...')
  console.log('  2. 司法院判決書 - 適用民法 184 條案例')
  console.log('     https://judgment.judicial.gov.tw/...')
  console.log('  3. 法源法律網 - 民法 184 條解析')
  console.log('     https://lawbank.com.tw/...')

  // 測試摘要
  logSection('測試摘要')

  console.log('總測試數：5')
  logSuccess('通過：5（模擬）')
  console.log('失敗：0')
  logWarning('警告：3（需要真實 API Keys）')

  console.log('\n成功率：100%（模擬模式）\n')

  log('🎉 模擬測試完成！', colors.green + colors.bright)

  console.log('\n' + '='.repeat(80))
  log('下一步：設定真實 API Keys 並執行實際測試', colors.bright)
  console.log('='.repeat(80))

  console.log('\n📝 設定步驟：\n')
  console.log('1. 註冊 API Keys：')
  console.log('   • Tavily: https://app.tavily.com/ (免費 1,000 次/月)')
  console.log('   • Exa: https://exa.ai/ (免費 1,000 次/月)')
  console.log('   • OpenAI: https://platform.openai.com/api-keys')

  console.log('\n2. 使用設定助手：')
  console.log('   bash scripts/setup-api-keys.sh')

  console.log('\n3. 或手動編輯：')
  console.log('   nano .env.local')

  console.log('\n4. 安裝測試工具：')
  console.log('   bun add -D tsx')

  console.log('\n5. 執行實際測試：')
  console.log('   bun tsx scripts/test-legal-search.ts')

  console.log('\n📚 詳細說明：')
  console.log('   • API 設定: LEGAL_SEARCH_SETUP.md')
  console.log('   • 測試指南: TEST_GUIDE.md')
  console.log('   • 專案總覽: LEGAL_AI_GUIDE.md')
  console.log()
}

main().catch(console.error)
