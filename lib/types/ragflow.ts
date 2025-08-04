/**
 * RAGFlow 相關類型定義
 */

export interface RAGFlowDataset {
  id: string
  name: string
  description?: string
  document_count: number
  create_time?: number
  chunk_count?: number
  token_num?: number
  status?: string
}

export interface RAGFlowChatRequest {
  question: string
  dataset_id: string
  session_id?: string
  user_id?: string
  quote?: boolean
  stream?: boolean
}

export interface RAGFlowSource {
  doc_name?: string
  content?: string
  chunk_id?: string
  similarity?: number
  [key: string]: any
}

export interface RAGFlowChatResponse {
  success: boolean
  answer: string
  sources: RAGFlowSource[]
  session_id: string
  chat_id: string
  message: string
  timestamp: string
}

export interface RAGFlowSession {
  session_id: string
  chat_id: string
  dataset_id: string
  dataset_name: string
  user_id?: string
  created_at: string
  last_used: string
}

export interface RAGFlowError {
  success: false
  error: string
  timestamp: string
}

export type ChatMode = 'web' | 'knowledge' | 'hybrid'
export type SearchStrategy = 'single' | 'intelligent' | 'multi'

export interface ChatOptions {
  mode: ChatMode
  datasetId?: string
  sessionId?: string
  userId?: string
  quote?: boolean
  stream?: boolean
  searchStrategy?: SearchStrategy
}

export interface KnowledgeSearchResult {
  answer: string
  sources: RAGFlowSource[]
  session_id: string
  dataset_name: string
  confidence?: number
}

export interface HybridSearchResult {
  web_results?: any[]
  knowledge_results?: KnowledgeSearchResult
  combined_answer?: string
  sources: Array<RAGFlowSource | any>
  mode_used: ChatMode[]
}