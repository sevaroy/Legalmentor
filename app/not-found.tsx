import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - 頁面未找到',
  description: '您訪問的頁面不存在'
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">頁面未找到</h2>
        </div>

        <p className="text-muted-foreground">
          抱歉，您訪問的頁面不存在或已被移除。
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  )
}
