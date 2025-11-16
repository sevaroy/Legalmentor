#!/usr/bin/env node
/**
 * LegalMentor 搜索功能測試腳本
 * 測試 Tavily + Exa 雙引擎法律搜索系統
 */

import { createSearchProvider } from './lib/tools/search/providers/index'

// 測試配色
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(80))
  log(title, colors.bright + colors.cyan)
  console.log('='.repeat(80) + '\n')
}

function logSuccess(message: string) {
  log(`✓ ${message}`, colors.green)
}

function logError(message: string) {
  log(`✗ ${message}`, colors.red)
}

function logWarning(message: string) {
  log(`⚠ ${message}`, colors.yellow)
}

function logInfo(message: string) {
  log(`ℹ ${message}`, colors.blue)
}

// 測試結果統計
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0
}

/**
 * 檢查環境變數
 */
function checkEnvironment() {
  logSection('環境變數檢查')

  const requiredEnvVars = {
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
    'TAVILY_API_KEY': process.env.TAVILY_API_KEY,
    'EXA_API_KEY': process.env.EXA_API_KEY
  }

  const optionalEnvVars = {
    'ANTHROPIC_API_KEY': process.env.ANTHROPIC_API_KEY,
    'SEARCH_API': process.env.SEARCH_API || 'tavily'
  }

  // 檢查必需的環境變數
  let allRequired = true
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    testResults.total++
    if (value && value !== '[YOUR_' + key + ']' && !value.includes('YOUR_')) {
      logSuccess(`${key}: 已設定`)
      testResults.passed++
    } else {
      logError(`${key}: 未設定或使用預設值`)
      allRequired = false
      testResults.failed++
    }
  }

  // 檢查選用的環境變數
  for (const [key, value] of Object.entries(optionalEnvVars)) {
    if (value && value !== '[YOUR_' + key + ']') {
      logInfo(`${key}: ${value}`)
    }
  }

  if (!allRequired) {
    logWarning('\n請設定所有必需的環境變數：')
    console.log('1. 複製範本：cp .env.example.legal .env.local')
    console.log('2. 編輯 .env.local 填入您的 API Keys')
    console.log('3. 重新執行測試\n')
    testResults.warnings++
    return false
  }

  return true
}

/**
 * 測試 Tavily Search
 */
async function testTavilySearch() {
  logSection('測試 Tavily Search API')
  testResults.total++

  try {
    const tavilyProvider = createSearchProvider('tavily')
    logInfo('執行搜索：「台灣 車禍賠償 判決」')

    const results = await tavilyProvider.search(
      '台灣 車禍賠償 判決',
      5,
      'basic',
      ['judicial.gov.tw', 'law.moj.gov.tw'],
      []
    )

    if (results && results.results.length > 0) {
      logSuccess(`Tavily 搜索成功：找到 ${results.results.length} 筆結果`)
      testResults.passed++

      // 顯示前 2 筆結果
      console.log('\n前 2 筆結果：')
      results.results.slice(0, 2).forEach((result, index) => {
        console.log(`\n  ${index + 1}. ${result.title}`)
        console.log(`     URL: ${result.url}`)
        console.log(`     內容: ${result.content?.substring(0, 100)}...`)
      })

      // 檢查是否包含司法院結果
      const hasJudicialResults = results.results.some(r =>
        r.url.includes('judicial.gov.tw')
      )
      if (hasJudicialResults) {
        logSuccess('✓ 結果包含司法院判決書')
      } else {
        logWarning('⚠ 結果未包含司法院判決書（可能需要調整搜索策略）')
        testResults.warnings++
      }
    } else {
      logError('Tavily 搜索失敗：無結果')
      testResults.failed++
    }
  } catch (error) {
    logError(`Tavily 搜索錯誤: ${error instanceof Error ? error.message : String(error)}`)
    testResults.failed++

    if (error instanceof Error && error.message.includes('401')) {
      logWarning('API Key 可能無效，請檢查 TAVILY_API_KEY')
    }
  }
}

/**
 * 測試 Exa Search
 */
async function testExaSearch() {
  logSection('測試 Exa Search API')
  testResults.total++

  try {
    const exaProvider = createSearchProvider('exa')
    logInfo('執行搜索：「台灣 勞資糾紛 判決」')

    const results = await exaProvider.search(
      '台灣 勞資糾紛 判決',
      5,
      'basic',
      ['judicial.gov.tw', 'law.moj.gov.tw'],
      []
    )

    if (results && results.results.length > 0) {
      logSuccess(`Exa 搜索成功：找到 ${results.results.length} 筆結果`)
      testResults.passed++

      // 顯示前 2 筆結果
      console.log('\n前 2 筆結果：')
      results.results.slice(0, 2).forEach((result, index) => {
        console.log(`\n  ${index + 1}. ${result.title}`)
        console.log(`     URL: ${result.url}`)
        console.log(`     內容: ${result.content?.substring(0, 100)}...`)
      })
    } else {
      logError('Exa 搜索失敗：無結果')
      testResults.failed++
    }
  } catch (error) {
    logError(`Exa 搜索錯誤: ${error instanceof Error ? error.message : String(error)}`)
    testResults.failed++

    if (error instanceof Error && error.message.includes('401')) {
      logWarning('API Key 可能無效，請檢查 EXA_API_KEY')
    }
  }
}

/**
 * 測試雙引擎搜索（模擬 legal_search）
 */
async function testDualEngineSearch() {
  logSection('測試雙引擎並行搜索')
  testResults.total++

  try {
    logInfo('同時使用 Tavily + Exa 搜索：「租賃糾紛 押金」')

    const tavilyProvider = createSearchProvider('tavily')
    const exaProvider = createSearchProvider('exa')

    const startTime = Date.now()

    // 並行執行
    const [tavilyResults, exaResults] = await Promise.all([
      tavilyProvider
        .search('台灣 租賃糾紛 押金', 5, 'basic', ['judicial.gov.tw'], [])
        .catch(() => null),
      exaProvider
        .search('台灣 租賃糾紛 押金', 5, 'basic', ['judicial.gov.tw'], [])
        .catch(() => null)
    ])

    const duration = Date.now() - startTime

    if (tavilyResults || exaResults) {
      logSuccess(
        `雙引擎搜索完成（${duration}ms）：Tavily ${tavilyResults?.results.length || 0} 筆 + Exa ${exaResults?.results.length || 0} 筆`
      )
      testResults.passed++

      // 合併去重
      const allResults = [
        ...(tavilyResults?.results || []),
        ...(exaResults?.results || [])
      ]
      const uniqueUrls = new Set()
      const uniqueResults = allResults.filter(r => {
        if (uniqueUrls.has(r.url)) return false
        uniqueUrls.add(r.url)
        return true
      })

      console.log(`\n去重後：${uniqueResults.length} 筆結果`)

      // 顯示前 3 筆
      console.log('\n合併結果（前 3 筆）：')
      uniqueResults.slice(0, 3).forEach((result, index) => {
        console.log(`\n  ${index + 1}. ${result.title}`)
        console.log(`     URL: ${result.url}`)
      })
    } else {
      logError('雙引擎搜索失敗：兩個引擎都無結果')
      testResults.failed++
    }
  } catch (error) {
    logError(`雙引擎搜索錯誤: ${error instanceof Error ? error.message : String(error)}`)
    testResults.failed++
  }
}

/**
 * 測試台灣法律網域優先
 */
async function testDomainPriority() {
  logSection('測試台灣法律網域優先')
  testResults.total++

  try {
    const tavilyProvider = createSearchProvider('tavily')
    logInfo('搜索「民法 184 條」並檢查域名優先級')

    const results = await tavilyProvider.search(
      '台灣 民法 184 條 侵權行為',
      10,
      'basic',
      ['law.moj.gov.tw', 'judicial.gov.tw', 'lawbank.com.tw'],
      []
    )

    if (results && results.results.length > 0) {
      const legalDomains = [
        'law.moj.gov.tw',
        'judicial.gov.tw',
        'lawbank.com.tw',
        'lawtw.com',
        '6law.idv.tw'
      ]

      const legalResults = results.results.filter(r =>
        legalDomains.some(domain => r.url.includes(domain))
      )

      const percentage = ((legalResults.length / results.results.length) * 100).toFixed(0)

      logSuccess(
        `找到 ${results.results.length} 筆結果，其中 ${legalResults.length} 筆來自台灣法律網站（${percentage}%）`
      )
      testResults.passed++

      console.log('\n台灣法律網站結果：')
      legalResults.slice(0, 3).forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.title}`)
        console.log(`     ${result.url}`)
      })
    } else {
      logWarning('無法測試域名優先：搜索無結果')
      testResults.warnings++
    }
  } catch (error) {
    logError(`域名優先測試錯誤: ${error instanceof Error ? error.message : String(error)}`)
    testResults.failed++
  }
}

/**
 * 顯示測試摘要
 */
function showSummary() {
  logSection('測試摘要')

  console.log(`總測試數：${testResults.total}`)
  logSuccess(`通過：${testResults.passed}`)
  logError(`失敗：${testResults.failed}`)
  if (testResults.warnings > 0) {
    logWarning(`警告：${testResults.warnings}`)
  }

  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(0)
  console.log(`\n成功率：${successRate}%\n`)

  if (testResults.failed === 0) {
    logSuccess('🎉 所有測試通過！法律搜索系統運作正常。')
  } else if (testResults.passed > testResults.failed) {
    logWarning('⚠️  部分測試失敗，但系統基本可用。')
  } else {
    logError('❌ 多數測試失敗，請檢查配置。')
  }

  console.log('\n建議：')
  console.log('1. 查看詳細設定指南：LEGAL_SEARCH_SETUP.md')
  console.log('2. 確認 API Keys 正確無誤')
  console.log('3. 啟動開發伺服器測試完整功能：bun dev')
  console.log()
}

/**
 * 主測試流程
 */
async function main() {
  log('\n🧪 LegalMentor 搜索功能測試\n', colors.bright + colors.cyan)
  log('測試 Tavily + Exa 雙引擎法律專用深度搜索系統\n')

  // 檢查環境變數
  const envOk = checkEnvironment()

  if (!envOk) {
    logSection('測試中止')
    logError('請先設定環境變數後再執行測試')
    process.exit(1)
  }

  // 執行所有測試
  await testTavilySearch()
  await testExaSearch()
  await testDualEngineSearch()
  await testDomainPriority()

  // 顯示摘要
  showSummary()

  // 返回結果
  process.exit(testResults.failed > 0 ? 1 : 0)
}

// 執行測試
main().catch(error => {
  logError(`\n測試執行錯誤: ${error}`)
  console.error(error)
  process.exit(1)
})
