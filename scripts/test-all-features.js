#!/usr/bin/env node

/**
 * 全功能測試腳本
 * 測試混合搜索系統的所有功能
 */

// 使用內建的 fetch (Node.js 18+)
const fetch = globalThis.fetch;

const BASE_URL = 'http://localhost:3000';
const RAGFLOW_URL = 'http://localhost:8001';

// 測試用例
const testCases = [
  {
    name: '法律問題 - 應該選擇知識庫優先',
    question: '民法第184條關於侵權行為的規定是什麼？',
    expectedStrategy: 'knowledge-first',
    endpoint: '/api/chat/hybrid'
  },
  {
    name: '時事問題 - 應該選擇網路優先',
    question: '2024年最新的AI法規政策有哪些？',
    expectedStrategy: 'web-first',
    endpoint: '/api/chat/hybrid'
  },
  {
    name: '綜合問題 - 應該選擇混合搜索',
    question: '人工智能在法律服務中的應用前景如何？',
    expectedStrategy: 'hybrid',
    endpoint: '/api/chat/hybrid'
  },
  {
    name: 'RAGFlow 知識庫搜索',
    question: '憲法第一條的內容是什麼？',
    expectedStrategy: 'single',
    endpoint: '/api/chat/ragflow'
  }
];

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 健康檢查
async function healthCheck() {
  log('blue', '🏥 執行健康檢查...');
  
  try {
    // 檢查 Next.js 應用
    const nextResponse = await fetch(`${BASE_URL}/api/datasets`);
    if (nextResponse.ok) {
      log('green', '✅ Next.js 應用運行正常');
    } else {
      log('red', '❌ Next.js 應用連接失敗');
      return false;
    }
    
    // 檢查 RAGFlow 服務
    const ragflowResponse = await fetch(`${RAGFLOW_URL}/`);
    if (ragflowResponse.ok) {
      log('green', '✅ RAGFlow 服務運行正常');
    } else {
      log('yellow', '⚠️  RAGFlow 服務連接失敗，部分功能可能不可用');
    }
    
    // 檢查混合搜索健康狀態
    const hybridResponse = await fetch(`${BASE_URL}/api/chat/hybrid`);
    if (hybridResponse.ok) {
      const healthData = await hybridResponse.json();
      log('green', '✅ 混合搜索服務運行正常');
      log('cyan', `   Tavily: ${healthData.health?.tavily ? '✅' : '❌'}`);
      log('cyan', `   RAGFlow: ${healthData.health?.ragflow ? '✅' : '❌'}`);
    }
    
    return true;
  } catch (error) {
    log('red', `❌ 健康檢查失敗: ${error.message}`);
    return false;
  }
}

// 測試單個案例
async function testCase(testCase) {
  log('blue', `\n🧪 測試: ${testCase.name}`);
  log('cyan', `   問題: ${testCase.question}`);
  
  try {
    const requestBody = {
      messages: [{ role: 'user', content: testCase.question }],
      searchMode: 'intelligent'
    };
    
    if (testCase.endpoint === '/api/chat/hybrid') {
      requestBody.webSearchDepth = 'advanced';
      requestBody.combineResults = true;
    }
    
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${testCase.endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (!response.ok) {
      log('red', `   ❌ HTTP 錯誤: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      log('red', `   ❌ API 錯誤: ${data.error}`);
      return false;
    }
    
    log('green', `   ✅ 測試通過 (${responseTime}ms)`);
    
    // 顯示結果摘要
    if (data.answer) {
      const answerPreview = data.answer.substring(0, 100) + '...';
      log('cyan', `   📝 答案預覽: ${answerPreview}`);
    }
    
    if (data.search_mode || data.modes_used) {
      const actualStrategy = data.search_mode || data.modes_used?.join('+');
      log('cyan', `   🎯 使用策略: ${actualStrategy}`);
      
      if (testCase.expectedStrategy && actualStrategy !== testCase.expectedStrategy) {
        log('yellow', `   ⚠️  預期策略: ${testCase.expectedStrategy}`);
      }
    }
    
    if (data.confidence) {
      log('cyan', `   📊 置信度: ${Math.round(data.confidence * 100)}%`);
    }
    
    if (data.sources && data.sources.length > 0) {
      log('cyan', `   📚 來源數量: ${data.sources.length}`);
    }
    
    return true;
  } catch (error) {
    log('red', `   ❌ 測試失敗: ${error.message}`);
    return false;
  }
}

// 測試數據集 API
async function testDatasets() {
  log('blue', '\n📚 測試數據集 API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/datasets`);
    
    if (!response.ok) {
      log('red', '   ❌ 數據集 API 連接失敗');
      return false;
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      log('green', `   ✅ 成功獲取 ${data.count} 個數據集`);
      
      // 顯示數據集摘要
      data.data.slice(0, 3).forEach((dataset, index) => {
        log('cyan', `   ${index + 1}. ${dataset.name} (${dataset.document_count} 個文檔)`);
      });
      
      return true;
    } else {
      log('red', `   ❌ 數據集 API 錯誤: ${data.error}`);
      return false;
    }
  } catch (error) {
    log('red', `   ❌ 數據集測試失敗: ${error.message}`);
    return false;
  }
}

// 性能測試
async function performanceTest() {
  log('blue', '\n⚡ 執行性能測試...');
  
  const testQuestion = '簡單測試問題';
  const iterations = 3;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}/api/chat/hybrid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: testQuestion }],
          searchMode: 'intelligent',
          webMaxResults: 5
        })
      });
      
      if (response.ok) {
        await response.json();
        const endTime = Date.now();
        times.push(endTime - startTime);
      }
    } catch (error) {
      log('yellow', `   ⚠️  第 ${i + 1} 次測試失敗`);
    }
  }
  
  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    log('green', `   ✅ 性能測試完成`);
    log('cyan', `   📊 平均響應時間: ${avgTime.toFixed(0)}ms`);
    log('cyan', `   📊 最快響應時間: ${minTime}ms`);
    log('cyan', `   📊 最慢響應時間: ${maxTime}ms`);
  } else {
    log('red', '   ❌ 性能測試失敗');
  }
}

// 主測試函數
async function runAllTests() {
  log('magenta', '🚀 開始執行全功能測試...\n');
  
  // 健康檢查
  const healthOk = await healthCheck();
  if (!healthOk) {
    log('red', '\n❌ 健康檢查失敗，請確認服務是否正常運行');
    process.exit(1);
  }
  
  // 測試數據集 API
  await testDatasets();
  
  // 測試各種搜索案例
  let passedTests = 0;
  for (const testCaseData of testCases) {
    const success = await testCase(testCaseData);
    if (success) passedTests++;
  }
  
  // 性能測試
  await performanceTest();
  
  // 測試結果摘要
  log('magenta', '\n📊 測試結果摘要:');
  log('cyan', `   總測試數: ${testCases.length}`);
  log('green', `   通過測試: ${passedTests}`);
  log('red', `   失敗測試: ${testCases.length - passedTests}`);
  
  if (passedTests === testCases.length) {
    log('green', '\n🎉 所有測試通過！系統運行正常');
  } else {
    log('yellow', '\n⚠️  部分測試失敗，請檢查相關配置');
  }
  
  log('blue', '\n📖 更多測試頁面:');
  log('cyan', '   - 主頁: http://localhost:3000');
  log('cyan', '   - 混合搜索: http://localhost:3000/hybrid-search');
  log('cyan', '   - 策略演示: http://localhost:3000/strategy-demo');
}

// 執行測試
if (require.main === module) {
  runAllTests().catch(error => {
    log('red', `\n💥 測試執行失敗: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runAllTests, testCase, healthCheck };