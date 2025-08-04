#!/usr/bin/env node

/**
 * 測試知識庫 API 的腳本
 */

async function testKnowledgeAPI() {
  console.log('🧪 開始測試知識庫 API...\n')

  // 測試 1: 檢查 FastAPI 服務器狀態
  console.log('1. 檢查 FastAPI 服務器狀態...')
  try {
    const response = await fetch('http://localhost:8001/')
    const data = await response.json()
    console.log('✅ FastAPI 服務器正常:', data)
  } catch (error) {
    console.log('❌ FastAPI 服務器連接失敗:', error.message)
    return
  }

  // 測試 2: 獲取數據集列表
  console.log('\n2. 獲取數據集列表...')
  try {
    const response = await fetch('http://localhost:8001/datasets')
    const datasets = await response.json()
    console.log('✅ 數據集列表:', datasets.map(d => ({ id: d.id, name: d.name })))
    
    if (datasets.length === 0) {
      console.log('❌ 沒有可用的數據集')
      return
    }
  } catch (error) {
    console.log('❌ 獲取數據集失敗:', error.message)
    return
  }

  // 測試 3: 測試前端 API 路由
  console.log('\n3. 測試前端 API 路由...')
  try {
    const requestBody = {
      messages: [{ role: 'user', content: '什麼是憲法？' }],
      datasetId: '826403366ee311f0bca2c60b36fb4045',
      searchMode: 'intelligent'
    }

    console.log('發送請求:', JSON.stringify(requestBody, null, 2))

    const response = await fetch('http://localhost:3000/api/chat/ragflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ 前端 API 成功:', {
        success: data.success,
        answer: data.answer?.substring(0, 100) + '...',
        dataset_name: data.dataset_name,
        sources_count: data.sources?.length || 0
      })
    } else {
      console.log('❌ 前端 API 失敗:', {
        status: response.status,
        error: data.error || data
      })
    }
  } catch (error) {
    console.log('❌ 前端 API 請求失敗:', error.message)
  }

  // 測試 4: 直接測試 FastAPI 聊天端點
  console.log('\n4. 直接測試 FastAPI 聊天端點...')
  try {
    const requestBody = {
      question: '什麼是憲法？',
      dataset_id: '826403366ee311f0bca2c60b36fb4045',
      quote: true,
      stream: false
    }

    console.log('發送請求:', JSON.stringify(requestBody, null, 2))

    const response = await fetch('http://localhost:8001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ FastAPI 聊天成功:', {
        success: data.success,
        answer: data.answer?.substring(0, 100) + '...',
        session_id: data.session_id,
        sources_count: data.sources?.length || 0
      })
    } else {
      console.log('❌ FastAPI 聊天失敗:', {
        status: response.status,
        error: data
      })
    }
  } catch (error) {
    console.log('❌ FastAPI 聊天請求失敗:', error.message)
  }

  console.log('\n🏁 測試完成')
}

// 運行測試
testKnowledgeAPI().catch(console.error)