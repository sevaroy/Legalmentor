import { cookies } from 'next/headers'

import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { createManualToolStreamResponse } from '@/lib/streaming/create-manual-tool-stream'
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { Model } from '@/lib/types/models'
import { isProviderEnabled } from '@/lib/utils/registry'

export const maxDuration = 30

const DEFAULT_MODEL: Model = {
  id: 'gpt-4o-mini',
  name: 'GPT-4o mini',
  provider: 'OpenAI',
  providerId: 'openai',
  enabled: true,
  toolCallType: 'native'
}

export async function POST(req: Request) {
  try {
    const { messages, id: chatId, mode, datasetId, searchMode } = await req.json()
    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')
    const userId = await getCurrentUserId()

    // 如果是知識庫模式，重定向到 RAGFlow API
    if (mode === 'knowledge' && !isSharePage) {
      try {
        const ragflowResponse = await fetch(`${req.url.replace('/api/chat', '/api/chat/ragflow')}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'referer': referer || ''
          },
          body: JSON.stringify({
            messages,
            datasetId,
            searchMode: searchMode || 'intelligent'
          })
        })

        const ragflowResult = await ragflowResponse.json()
        return new Response(JSON.stringify(ragflowResult), {
          status: ragflowResponse.status,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error('RAGFlow API call failed:', error)
        return new Response(JSON.stringify({
          success: false,
          error: 'RAGFlow 服務暫時不可用，請稍後再試'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    }

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const modelJson = cookieStore.get('selectedModel')?.value
    const cookieSearchMode = cookieStore.get('search-mode')?.value === 'true'

    let selectedModel = DEFAULT_MODEL

    if (modelJson) {
      try {
        selectedModel = JSON.parse(modelJson) as Model
      } catch (e) {
        console.error('Failed to parse selected model:', e)
      }
    }

    if (
      !isProviderEnabled(selectedModel.providerId) ||
      selectedModel.enabled === false
    ) {
      return new Response(
        `Selected provider is not enabled ${selectedModel.providerId}`,
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    }

    const supportsToolCalling = selectedModel.toolCallType === 'native'

    return supportsToolCalling
      ? createToolCallingStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode: cookieSearchMode,
          userId
        })
      : createManualToolStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode: cookieSearchMode,
          userId
        })
  } catch (error) {
    console.error('API route error:', error)
    return new Response('Error processing your request', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
