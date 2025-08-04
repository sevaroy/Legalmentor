/**
 * RAGFlow 知識庫聊天頁面
 * 專門用於測試和使用 RAGFlow 知識庫功能
 */

import { RAGFlowChatInterface } from '@/components/ragflow-chat-interface'

export default function KnowledgePage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">RAGFlow 知識庫助手</h1>
        <p className="text-muted-foreground">
          基於 RAGFlow 的專業知識庫問答系統，支援法律、學術等專業領域查詢
        </p>
      </div>
      
      <RAGFlowChatInterface className="h-[calc(100vh-200px)]" />
    </div>
  )
}

export const metadata = {
  title: 'RAGFlow 知識庫 - 專業問答助手',
  description: '使用 RAGFlow 知識庫進行專業領域問答和知識檢索'
}