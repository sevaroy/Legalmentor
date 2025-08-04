#!/usr/bin/env node

/**
 * 互動式策略測試腳本
 * 讓用戶選擇測試類別並執行測試
 */

const readline = require('readline');
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

// 測試提示詞分類
const testPrompts = {
  'knowledge-first': {
    name: '🏛️ 知識庫優先策略',
    prompts: [
      '民法第184條關於侵權行為的規定是什麼？',
      '憲法第7條平等權的內容為何？',
      '什麼是侵權行為的構成要件？',
      '契約自由原則的內容和限制？',
      '如何判斷是否構成過失侵權？'
    ]
  },
  'web-first': {
    name: '🌐 網路優先策略',
    prompts: [
      '2024年最新的AI法規政策有哪些？',
      '今年台灣通過了哪些重要法律修正案？',
      '最近關於AI著作權的重要判決？',
      '目前政府推動的數位治理政策？',
      '歐盟最新的AI法案內容？'
    ]
  },
  'hybrid': {
    name: '⚡ 混合搜索策略',
    prompts: [
      '人工智能在法律服務中的應用前景如何？',
      '區塊鏈技術對智慧財產權的影響？',
      '醫療AI的法律責任歸屬問題？',
      '法律科技如何改變傳統法律實務？',
      'AI法律顧問的發展現況和法律挑戰？'
    ]
  },
  'complexity': {
    name: '🧪 複雜度測試',
    prompts: [
      '什麼是契約？',
      '契約成立的要件有哪些，以及各要件的具體內容？',
      '請分析契約自由原則在現代民法中的地位，並探討其與誠信原則、公序良俗的關係？'
    ]
  },
  'boundary': {
    name: '🎯 邊界案例測試',
    prompts: [
      '2024年新修正的民法條文有哪些變化？',
      '最新的個資法修正對AI應用有什麼影響？',
      '台灣如何因應GDPR的跨境資料傳輸要求？'
    ]
  }
};

// 創建 readline 介面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 執行搜索測試
async function executeSearch(prompt, expectedStrategy) {
  try {
    log('blue', `\n🔍 執行搜索測試...`);
    log('cyan', `問題: ${prompt}`);
    
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
      log('red', `❌ HTTP 錯誤: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      log('red', `❌ API 錯誤: ${data.error}`);
      return false;
    }
    
    // 顯示結果
    log('green', `✅ 搜索完成 (${responseTime}ms)`);
    
    // 策略分析 - 使用 modes_used 來判斷實際策略
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
    
    log('cyan', `🎯 實際策略: ${actualStrategy} (模式: ${modesUsed.join(' + ')})`);
    if (expectedStrategy) {
      if (actualStrategy === expectedStrategy) {
        log('green', `✅ 策略選擇正確 (預期: ${expectedStrategy})`);
      } else {
        log('yellow', `⚠️  策略選擇差異 (預期: ${expectedStrategy}, 實際: ${actualStrategy})`);
      }
    }
    
    // 置信度
    if (data.confidence) {
      const confidencePercent = Math.round(data.confidence * 100);
      log('cyan', `📊 置信度: ${confidencePercent}%`);
    }
    
    // 使用的模式
    if (data.modes_used && data.modes_used.length > 0) {
      log('cyan', `🔧 使用模式: ${data.modes_used.join(' + ')}`);
    }
    
    // 來源數量
    if (data.sources && data.sources.length > 0) {
      log('cyan', `📚 來源數量: ${data.sources.length}`);
      
      // 顯示來源類型分佈
      const webSources = data.sources.filter(s => s.type === 'web').length;
      const knowledgeSources = data.sources.filter(s => s.type === 'knowledge').length;
      if (webSources > 0 || knowledgeSources > 0) {
        log('cyan', `   📊 來源分佈: 網路 ${webSources} | 知識庫 ${knowledgeSources}`);
      }
    }
    
    // 答案預覽
    if (data.answer) {
      const preview = data.answer.substring(0, 150) + (data.answer.length > 150 ? '...' : '');
      log('cyan', `📝 答案預覽: ${preview}`);
    }
    
    return true;
    
  } catch (error) {
    log('red', `❌ 測試失敗: ${error.message}`);
    return false;
  }
}

// 顯示主選單
function showMainMenu() {
  log('magenta', '\n🚀 智能搜索策略互動測試');
  log('blue', '=' .repeat(50));
  
  const categories = Object.keys(testPrompts);
  categories.forEach((key, index) => {
    log('cyan', `${index + 1}. ${testPrompts[key].name}`);
  });
  
  log('cyan', `${categories.length + 1}. 🎨 自定義測試`);
  log('cyan', `${categories.length + 2}. 📊 批量測試`);
  log('cyan', `0. 🚪 退出`);
  log('blue', '=' .repeat(50));
}

// 顯示類別選單
function showCategoryMenu(category) {
  const categoryData = testPrompts[category];
  log('blue', `\n${categoryData.name} - 測試選項:`);
  
  categoryData.prompts.forEach((prompt, index) => {
    log('cyan', `${index + 1}. ${prompt}`);
  });
  
  log('cyan', `${categoryData.prompts.length + 1}. 🔄 返回主選單`);
}

// 執行批量測試
async function runBatchTest() {
  log('blue', '\n📊 執行批量測試...');
  
  const testCases = [
    { prompt: '民法第184條關於侵權行為的規定是什麼？', expected: 'knowledge-first' },
    { prompt: '2024年最新的AI法規政策有哪些？', expected: 'web-first' },
    { prompt: '人工智能在法律服務中的應用前景如何？', expected: 'hybrid' }
  ];
  
  let passed = 0;
  let total = testCases.length;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    log('yellow', `\n[${i + 1}/${total}] 測試案例:`);
    
    const success = await executeSearch(testCase.prompt, testCase.expected);
    if (success) passed++;
    
    // 等待一下避免請求過於頻繁
    if (i < testCases.length - 1) {
      log('yellow', '⏳ 等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  log('magenta', `\n📊 批量測試結果: ${passed}/${total} 通過`);
}

// 主程式邏輯
async function main() {
  log('green', '🎉 歡迎使用智能搜索策略測試工具！');
  
  while (true) {
    showMainMenu();
    
    const choice = await new Promise(resolve => {
      rl.question('\n請選擇選項: ', resolve);
    });
    
    const choiceNum = parseInt(choice);
    const categories = Object.keys(testPrompts);
    
    if (choiceNum === 0) {
      log('green', '👋 感謝使用，再見！');
      break;
    } else if (choiceNum >= 1 && choiceNum <= categories.length) {
      // 選擇測試類別
      const category = categories[choiceNum - 1];
      
      while (true) {
        showCategoryMenu(category);
        
        const subChoice = await new Promise(resolve => {
          rl.question('\n請選擇測試項目: ', resolve);
        });
        
        const subChoiceNum = parseInt(subChoice);
        const categoryData = testPrompts[category];
        
        if (subChoiceNum === categoryData.prompts.length + 1) {
          break; // 返回主選單
        } else if (subChoiceNum >= 1 && subChoiceNum <= categoryData.prompts.length) {
          const prompt = categoryData.prompts[subChoiceNum - 1];
          await executeSearch(prompt, category);
          
          // 詢問是否繼續
          const continueChoice = await new Promise(resolve => {
            rl.question('\n按 Enter 繼續，或輸入 q 返回選單: ', resolve);
          });
          
          if (continueChoice.toLowerCase() === 'q') {
            break;
          }
        } else {
          log('red', '❌ 無效選項，請重新選擇');
        }
      }
    } else if (choiceNum === categories.length + 1) {
      // 自定義測試
      const customPrompt = await new Promise(resolve => {
        rl.question('\n請輸入自定義測試問題: ', resolve);
      });
      
      if (customPrompt.trim()) {
        await executeSearch(customPrompt.trim());
      }
    } else if (choiceNum === categories.length + 2) {
      // 批量測試
      await runBatchTest();
    } else {
      log('red', '❌ 無效選項，請重新選擇');
    }
  }
  
  rl.close();
}

// 錯誤處理
process.on('SIGINT', () => {
  log('yellow', '\n\n👋 程序被中斷，再見！');
  rl.close();
  process.exit(0);
});

// 啟動程式
if (require.main === module) {
  main().catch(error => {
    log('red', `\n💥 程序執行失敗: ${error.message}`);
    rl.close();
    process.exit(1);
  });
}