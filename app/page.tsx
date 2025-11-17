import { generateId } from 'ai'

import { getModels } from '@/lib/config/models'

import { Chat } from '@/components/chat'

// Force dynamic rendering due to headers() usage
export const dynamic = 'force-dynamic'

export default async function Page() {
  const id = generateId()
  const models = await getModels()
  return <Chat id={id} models={models} />
}
