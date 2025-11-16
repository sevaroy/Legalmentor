'use client'

import { Building2,Calendar, ExternalLink, Scale } from 'lucide-react'

/**
 * 判決書卡片組件
 * 用於展示司法院判決書的摘要資訊
 */

interface JudgmentCardProps {
  jid: string // 判決書 ID
  title: string // 判決書標題
  court: string // 法院名稱
  judgeDate: string // 判決日期
  caseType: string // 案件類型
  caseNumber: string // 案號
  summary?: string // 摘要
  url: string // 判決書連結
}

export function JudgmentCard({
  jid,
  title,
  court,
  judgeDate,
  caseType,
  caseNumber,
  summary,
  url
}: JudgmentCardProps) {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      {/* 案件類型標籤 */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {caseType}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          查看原文
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* 判決書標題 */}
      <h3 className="mb-3 line-clamp-2 text-base font-semibold leading-tight text-foreground">
        {title}
      </h3>

      {/* 法院和日期資訊 */}
      <div className="mb-3 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span>{court}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>判決日期：{judgeDate}</span>
        </div>
        <div className="text-xs">
          <span className="font-mono">{caseNumber}</span>
        </div>
      </div>

      {/* 摘要（如果有） */}
      {summary && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {summary}
          </p>
        </div>
      )}

      {/* 判決書 ID（用於技術追蹤） */}
      <div className="mt-2 text-xs text-muted-foreground/60">
        <span className="font-mono">JID: {jid}</span>
      </div>
    </div>
  )
}

/**
 * 判決書列表組件
 */
interface JudgmentListProps {
  judgments: JudgmentCardProps[]
  query?: string
}

export function JudgmentList({ judgments, query }: JudgmentListProps) {
  if (judgments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
        <Scale className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          {query
            ? `沒有找到與「${query}」相關的判決書`
            : '沒有找到相關的判決書'}
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">
          建議：
          <br />
          • 使用不同的關鍵字重新搜尋
          <br />
          • 前往{' '}
          <a
            href="https://judgment.judicial.gov.tw/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            司法院判決書查詢系統
          </a>{' '}
          進行進階搜尋
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 搜尋結果數量 */}
      {query && (
        <div className="mb-4 text-sm text-muted-foreground">
          找到 <span className="font-semibold text-foreground">{judgments.length}</span> 筆與「
          <span className="font-semibold text-foreground">{query}</span>」相關的判決書
        </div>
      )}

      {/* 判決書卡片列表 */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {judgments.map(judgment => (
          <JudgmentCard key={judgment.jid} {...judgment} />
        ))}
      </div>
    </div>
  )
}

/**
 * 判決書詳細內容組件
 */
interface JudgmentDetailProps extends JudgmentCardProps {
  content: string // 完整判決書內容
}

export function JudgmentDetail({
  jid,
  title,
  court,
  judgeDate,
  caseType,
  caseNumber,
  content,
  url
}: JudgmentDetailProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* 頭部資訊 */}
      <div className="mb-6 border-b border-border pb-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {caseType}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            在司法院系統中查看
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{court}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{judgeDate}</span>
          </div>
          <div className="col-span-2 text-xs text-muted-foreground">
            案號：<span className="font-mono">{caseNumber}</span>
          </div>
        </div>
      </div>

      {/* 判決書內容 */}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div className="whitespace-pre-wrap rounded-md bg-muted/30 p-4 text-sm leading-relaxed">
          {content}
        </div>
      </div>

      {/* 底部資訊 */}
      <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
        判決書編號：<span className="font-mono">{jid}</span>
      </div>
    </div>
  )
}
