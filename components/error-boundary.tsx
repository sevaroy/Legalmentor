'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

import { AlertTriangle, RotateCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>發生錯誤</CardTitle>
              </div>
              <CardDescription>
                抱歉，應用程式遇到了一個錯誤
              </CardDescription>
            </CardHeader>
            <CardContent>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded-md bg-muted p-3 text-xs font-mono overflow-x-auto">
                  <p className="text-destructive font-semibold mb-1">
                    {this.state.error.name}
                  </p>
                  <p className="text-muted-foreground">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              {process.env.NODE_ENV === 'production' && (
                <p className="text-sm text-muted-foreground">
                  我們已記錄此錯誤並會盡快修復。請嘗試重新載入頁面。
                </p>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                重試
              </Button>
              <Button
                onClick={this.handleReload}
                className="flex-1"
              >
                重新載入頁面
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Chat-specific error boundary with custom styling
export function ChatErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold mb-2">對話出現錯誤</h3>
            <p className="text-sm text-muted-foreground mb-4">
              無法載入對話內容，請重新載入頁面
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            <RotateCw className="mr-2 h-4 w-4" />
            重新載入
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
