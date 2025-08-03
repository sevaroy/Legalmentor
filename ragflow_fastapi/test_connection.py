#!/usr/bin/env python3
"""
測試 RAGFlow 連線和知識庫列表
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ragflow_chatbot import RAGFlowOfficialClient
import json

def test_ragflow_connection():
    """測試 RAGFlow 連線和知識庫列表"""
    print("🔍 測試 RAGFlow 連線...")
    
    # 創建客戶端
    client = RAGFlowOfficialClient()
    print(f"API URL: {client.api_url}")
    print(f"API Key: {client.api_key[:20]}...")
    
    # 測試數據集列表
    print("\n📚 正在獲取數據集列表...")
    result = client.list_datasets()
    
    if result['success']:
        datasets = result['data']
        print(f"✅ 成功連接 RAGFlow！找到 {len(datasets)} 個數據集:")
        
        if datasets:
            for i, dataset in enumerate(datasets, 1):
                print(f"\n  {i}. 📖 {dataset.get('name', 'N/A')}")
                print(f"     ID: {dataset.get('id', 'N/A')}")
                print(f"     描述: {dataset.get('description', 'N/A')}")
                print(f"     文檔數量: {dataset.get('document_count', 'N/A')}")
                print(f"     創建時間: {dataset.get('create_time', 'N/A')}")
        else:
            print("⚠️  沒有找到任何數據集")
            
        print(f"\n🔧 完整回應數據:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
    else:
        print(f"❌ 連接失敗: {result['message']}")
        return False
    
    return True

if __name__ == "__main__":
    success = test_ragflow_connection()
    if success:
        print("\n✅ RAGFlow 連線測試成功！")
    else:
        print("\n❌ RAGFlow 連線測試失敗！")