'use client'

// Temporarily disabled for deployment
export default function UIDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Morphic UI 監控儀表板</h1>
          <p className="text-muted-foreground">功能暫時停用以解決部署問題</p>
        </div>
      </div>
    </div>
  )
}

/*
// Original imports - temporarily commented out
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { usePerformanceMonitor } from '@/lib/performance/monitor'
import { useEffect, useState } from 'react'

export default function UIDashboard() {
*/