#!/usr/bin/env node

/**
 * 快速策略測試腳本
 * 執行預定義的測試案例來驗證策略選擇
 */

const fetch = globalThis.fetch;

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

// 預定義測試案例
const testCases = [
  {
    category: '🏛️ 知識庫優先',
    expected: 'knowledge-first',
    tests: [
      '民法第184條關於侵權行為的規定是什麼？',
      '憲法第7條平等權的內容為何？',
      '什麼是侵權行為的構成要件？',
      '契約自由原則的內容和限制？',
      '如何判斷是否構成過失侵權？'
    ]
  },
  {
    category: '🌐 網路優先',
    expected: 'web-first',
    tests: [
      '2024年最新的AI法規政策有哪些？',
      '今年台灣通過了哪些重要法律修正案？',
      '最近關於AI著作權的重要判決？',
      '目前政府推動的數位治理政策？',
      '最新的個資法違法裁罰案例？'
    ]
  },
  {
    category: '⚡ 混合搜索',
    expected: 'hybrid',
    tests: [
      '人工智能在法律服務中的應用前景如何？',
      '區塊鏈技術對智慧財產權的影響？',
      '醫療AI的法律責任歸屬問題？',
      '法律科技如何改變傳統法律實務？',
      'AI法律顧問的發展現況和法律挑戰？'
    ]
  }
];

// 執行單個測試
async function runSingleTest(prompt, expectedStrategy, testIndex, totalTests) {
  try {
    log('blue', `\n[${testIndex}/${totalTests}] 🧪 測試: ${prompt.substring(0, 50)}...`);
    
    const startTime = Date.now();
    const response = await fetch('http://localhost:3000/api/chat/hybrid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        searchMode: 'intelligent',
        webSearchDepth: 'advanced',
        combineResults: true
      })
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (!response.ok) {
      log('red', `   ❌ HTTP 錯誤: ${response.status}`);
      return { success: false, strategyMatch: false, responseTime };
    }
    
    const data = await response.json();
    
    if (!data.success) {
      log('red', `   ❌ API 錯誤: ${data.error}`);
      return { success: false, strategyMatch: false, responseTime };
    }
    
    // 分析結果 - 使用 modes_used 來判斷實際策略
    const modesUsed = data.modes_used || [];
    let actualStrategy = 'unknown';
    
    // 根據使用的模式判斷策略類型
    if (modesUsed.includes('web') && modesUsed.includes('knowledge')) {
      actualStrategy = 'hybrid';
    } else if (modesUsed.includes('knowledge')) {
      actualStrategy = 'knowledge-first';
    } else if (modesUsed.includes('web')) {
      actualStrategy = 'web-first';
    }
    
    const strategyMatch = actualStrategy === expectedStrategy;
    const confidence = data.confidence ? Math.round(data.confidence * 100) : 0;
    const sourcesCount = data.sources ? data.sources.length : 0;
    
    // 顯示結果
    if (strategyMatch) {
      log('green', `   ✅ 策略正確: ${actualStrategy}`);
    } else {
      log('yellow', `   ⚠️  策略差異: 預期 ${expectedStrategy}, 實際 ${actualStrategy}`);
    }
    
    log('cyan', `   ⏱️  響應時間: ${responseTime}ms`);
    log('cyan', `   📊 置信度: ${confidence}%`);
    log('cyan', `   📚 來源數: ${sourcesCount}`);
    
    // 顯示使用的模式
    if (data.modes_used && data.modes_used.length > 0) {
      log('cyan', `   🔧 搜索模式: ${data.modes_used.join(' + ')}`);
    }
    
    return { 
      success: true, 
      strategyMatch, 
      responseTime, 
      confidence, 
      sourcesCount,
      actualStrategy,
      modesUsed: data.modes_used || []
    };
    
  } catch (error) {
    log('red', `   ❌ 測試失敗: ${error.message}`);
    return { success: false, strategyMatch: false, responseTime: 0 };
  }
}

// 執行類別測試
async function runCategoryTest(category, expectedStrategy, tests) {
  log('magenta', `\n${category} 測試開始...`);
  log('blue', '='.repeat(60));
  
  const results = [];
  let correctStrategies = 0;
  let totalResponseTime = 0;
  let totalConfidence = 0;
  let totalSources = 0;
  
  for (let i = 0; i < tests.length; i++) {
    const result = await runSingleTest(tests[i], expectedStrategy, i + 1, tests.length);
    results.push(result);
    
    if (result.success) {
      if (result.strategyMatch) correctStrategies++;
      totalResponseTime += result.responseTime;
      totalConfidence += result.confidence || 0;
      totalSources += result.sourcesCount || 0;
    }
    
    // 避免請求過於頻繁
    if (i < tests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // 計算統計數據
  const successfulTests = results.filter(r => r.success).length;
  const strategyAccuracy = successfulTests > 0 ? (correctStrategies / successfulTests * 100).toFixed(1) : 0;
  const avgResponseTime = successfulTests > 0 ? Math.round(totalResponseTime / successfulTests) : 0;
  const avgConfidence = successfulTests > 0 ? Math.round(totalConfidence / successfulTests) : 0;
  const avgSources = successfulTests > 0 ? Math.round(totalSources / successfulTests) : 0;
  
  // 顯示類別總結
  log('blue', '\n📊 類別測試總結:');
  log('cyan', `   成功測試: ${successfulTests}/${tests.length}`);
  log('cyan', `   策略準確率: ${strategyAccuracy}%`);
  log('cyan', `   平均響應時間: ${avgResponseTime}ms`);
  log('cyan', `   平均置信度: ${avgConfidence}%`);
  log('cyan', `   平均來源數: ${avgSources}`);
  
  return {
    category,
    totalTests: tests.length,
    successfulTests,
    correctStrategies,
    strategyAccuracy: parseFloat(strategyAccuracy),
    avgResponseTime,
    avgConfidence,
    avgSources,
    results
  };
}

// 主測試函數
async function runAllTests() {
  log('magenta', '🚀 開始執行快速策略測試...');
  log('blue', '='.repeat(60));
  
  const allResults = [];
  let totalTests = 0;
  let totalSuccessful = 0;
  let totalCorrectStrategies = 0;
  
  // 執行每個類別的測試
  for (const testCase of testCases) {
    const categoryResult = await runCategoryTest(
      testCase.category,
      testCase.expected,
      testCase.tests
    );
    
    allResults.push(categoryResult);
    totalTests += categoryResult.totalTests;
    totalSuccessful += categoryResult.successfulTests;
    totalCorrectStrategies += categoryResult.correctStrategies;
    
    log('blue', '='.repeat(60));
  }
  
  // 顯示總體結果
  log('magenta', '\n🎯 總體測試結果:');
  log('blue', '='.repeat(60));
  
  const overallAccuracy = totalSuccessful > 0 ? (totalCorrectStrategies / totalSuccessful * 100).toFixed(1) : 0;
  
  log('green', `📊 測試統計:`);
  log('cyan', `   總測試數: ${totalTests}`);
  log('cyan', `   成功測試: ${totalSuccessful}`);
  log('cyan', `   策略正確: ${totalCorrectStrategies}`);
  log('cyan', `   整體準確率: ${overallAccuracy}%`);
  
  // 顯示各類別表現
  log('green', '\n📈 各類別表現:');
  allResults.forEach(result => {
    const status = result.strategyAccuracy >= 80 ? '✅' : 
                   result.strategyAccuracy >= 60 ? '⚠️' : '❌';
    log('cyan', `   ${status} ${result.category}: ${result.strategyAccuracy}% (${result.correctStrategies}/${result.successfulTests})`);
  });
  
  // 性能統計
  const avgResponseTimes = allResults.map(r => r.avgResponseTime).filter(t => t > 0);
  const avgConfidences = allResults.map(r => r.avgConfidence).filter(c => c > 0);
  
  if (avgResponseTimes.length > 0) {
    const overallAvgTime = Math.round(avgResponseTimes.reduce((a, b) => a + b, 0) / avgResponseTimes.length);
    log('green', `\n⚡ 性能統計:`);
    log('cyan', `   平均響應時間: ${overallAvgTime}ms`);
  }
  
  if (avgConfidences.length > 0) {
    const overallAvgConfidence = Math.round(avgConfidences.reduce((a, b) => a + b, 0) / avgConfidences.length);
    log('cyan', `   平均置信度: ${overallAvgConfidence}%`);
  }
  
  // 建議
  log('green', '\n💡 建議:');
  if (parseFloat(overallAccuracy) >= 80) {
    log('green', '   🎉 策略選擇表現優秀！系統運行良好');
  } else if (parseFloat(overallAccuracy) >= 60) {
    log('yellow', '   ⚠️  策略選擇表現一般，可考慮調整關鍵詞匹配規則');
  } else {
    log('red', '   ❌ 策略選擇需要改進，建議檢查智能選擇邏輯');
  }
  
  log('blue', '\n📖 詳細測試可使用:');
  log('cyan', '   node scripts/interactive-test.js  # 互動式測試');
  log('cyan', '   http://localhost:3000/strategy-demo  # 網頁演示');
  
  log('green', '\n🎉 測試完成！');
}

// 健康檢查
async function healthCheck() {
  try {
    log('blue', '🏥 執行健康檢查...');
    
    const response = await fetch('http://localhost:3000/api/chat/hybrid');
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.health) {
        log('green', `✅ 服務健康狀態: Tavily ${data.health.tavily ? '✅' : '❌'} | RAGFlow ${data.health.ragflow ? '✅' : '❌'}`);
        return true;
      }
    }
    
    log('red', '❌ 健康檢查失敗');
    return false;
  } catch (error) {
    log('red', `❌ 健康檢查錯誤: ${error.message}`);
    return false;
  }
}

// 主程式
async function main() {
  // 健康檢查
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    log('red', '❌ 服務不健康，請確認服務是否正常運行');
    log('yellow', '💡 請先執行: ./start-local.sh');
    process.exit(1);
  }
  
  // 執行測試
  await runAllTests();
}

// 錯誤處理
process.on('SIGINT', () => {
  log('yellow', '\n👋 測試被中斷');
  process.exit(0);
});

// 執行
if (require.main === module) {
  main().catch(error => {
    log('red', `💥 測試執行失敗: ${error.message}`);
    process.exit(1);
  });
}