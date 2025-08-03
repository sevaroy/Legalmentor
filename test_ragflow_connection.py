#!/usr/bin/env python3
"""
測試 RAGFlow 連線和知識庫列表
"""

import requests
import json
from config import RAGFLOW_API_URL, RAGFLOW_API_KEY

def test_ragflow_connection():
    """測試 RAGFlow 連線"""
    print("🔍 測試 RAGFlow 連線...")
    print(f"API URL: {RAGFLOW_API_URL}")
    print(f"API Key: {RAGFLOW_API_KEY[:20]}...")
    
    headers = {
        'Authorization': f'Bearer {RAGFLOW_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        # 測試健康檢查
        print("\n1. 測試健康檢查...")
        health_url = f"{RAGFLOW_API_URL}/api/v1/health"
        response = requests.get(health_url, headers=headers, timeout=10)
        print(f"健康檢查狀態: {response.status_code}")
        if response.status_code == 200:
            print("✅ RAGFlow 服務正常運行")
        else:
            print(f"❌ 健康檢查失敗: {response.text}")
            
    except Exception as e:
        print(f"❌ 健康檢查異常: {e}")
    
    try:
        # 測試數據集列表
        print("\n2. 測試數據集列表...")
        datasets_url = f"{RAGFLOW_API_URL}/api/v1/datasets"
        response = requests.get(datasets_url, headers=headers, timeout=10)
        print(f"數據集請求狀態: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 成功獲取數據集列表")
            print(f"回應格式: {json.dumps(result, indent=2, ensure_ascii=False)}")
            
            if 'data' in result:
                datasets = result['data']
                print(f"\n📚 找到 {len(datasets)} 個數據集:")
                for i, dataset in enumerate(datasets, 1):
                    print(f"  {i}. {dataset.get('name', 'N/A')} (ID: {dataset.get('id', 'N/A')})")
                    print(f"     描述: {dataset.get('description', 'N/A')}")
                    print(f"     文檔數量: {dataset.get('document_count', 'N/A')}")
                    print()
            else:
                print("⚠️  回應中沒有 'data' 欄位")
                
        else:
            print(f"❌ 獲取數據集失敗: {response.status_code}")
            print(f"錯誤內容: {response.text}")
            
    except Exception as e:
        print(f"❌ 數據集請求異常: {e}")

if __name__ == "__main__":
    test_ragflow_connection()