#!/usr/bin/env python3
"""
測試 RAGFlow FastAPI 服務
"""

import requests
import json
import time

def test_fastapi_service():
    """測試 FastAPI 服務"""
    base_url = "http://localhost:8001"
    
    print("🔍 測試 RAGFlow FastAPI 服務...")
    print(f"服務地址: {base_url}")
    
    # 1. 測試健康檢查
    print("\n1. 測試健康檢查...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            result = response.json()
            print("✅ 健康檢查成功")
            print(f"   服務: {result.get('service')}")
            print(f"   狀態: {result.get('status')}")
            print(f"   版本: {result.get('version')}")
        else:
            print(f"❌ 健康檢查失敗: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 健康檢查異常: {e}")
        return False
    
    # 2. 測試數據集列表
    print("\n2. 測試數據集列表...")
    try:
        response = requests.get(f"{base_url}/datasets")
        if response.status_code == 200:
            datasets = response.json()
            print(f"✅ 成功獲取 {len(datasets)} 個數據集:")
            for i, dataset in enumerate(datasets, 1):
                print(f"   {i}. {dataset['name']} (ID: {dataset['id']})")
                print(f"      文檔數量: {dataset['document_count']}")
        else:
            print(f"❌ 獲取數據集失敗: {response.status_code}")
            print(f"   錯誤: {response.text}")
            return False
    except Exception as e:
        print(f"❌ 數據集請求異常: {e}")
        return False
    
    # 3. 測試聊天功能
    if datasets:
        print("\n3. 測試聊天功能...")
        test_dataset = datasets[0]  # 使用第一個數據集
        
        chat_request = {
            "question": "這個知識庫包含什麼內容？",
            "dataset_id": test_dataset['id'],
            "quote": True,
            "stream": False
        }
        
        try:
            print(f"   使用數據集: {test_dataset['name']}")
            print(f"   問題: {chat_request['question']}")
            print("   🔍 發送聊天請求...")
            
            response = requests.post(f"{base_url}/chat", json=chat_request)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ 聊天請求成功")
                print(f"   會話ID: {result.get('session_id')}")
                print(f"   聊天ID: {result.get('chat_id')}")
                print(f"   回答: {result.get('answer', '')[:200]}...")
                print(f"   來源數量: {len(result.get('sources', []))}")
                
                # 顯示來源
                sources = result.get('sources', [])
                if sources:
                    print("   📖 參考來源:")
                    for i, source in enumerate(sources[:2], 1):
                        if isinstance(source, dict):
                            doc_name = source.get('doc_name', 'Unknown')
                            print(f"      {i}. {doc_name}")
                
            else:
                print(f"❌ 聊天請求失敗: {response.status_code}")
                print(f"   錯誤: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ 聊天請求異常: {e}")
            return False
    
    # 4. 測試會話列表
    print("\n4. 測試會話列表...")
    try:
        response = requests.get(f"{base_url}/sessions")
        if response.status_code == 200:
            sessions = response.json()
            print(f"✅ 找到 {len(sessions)} 個活躍會話")
            for session in sessions:
                print(f"   會話: {session['session_id'][:8]}... ({session['dataset_name']})")
        else:
            print(f"❌ 獲取會話失敗: {response.status_code}")
    except Exception as e:
        print(f"❌ 會話請求異常: {e}")
    
    return True

if __name__ == "__main__":
    print("請先啟動 FastAPI 服務:")
    print("python3 fastapi_server.py")
    print("\n等待 5 秒後開始測試...")
    time.sleep(5)
    
    success = test_fastapi_service()
    if success:
        print("\n✅ RAGFlow FastAPI 服務測試成功！")
        print("🌐 API 文檔: http://localhost:8001/docs")
    else:
        print("\n❌ RAGFlow FastAPI 服務測試失敗！")