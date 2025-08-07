// 性能監控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 測量組件渲染時間
  measureRender(componentName: string, renderFn: () => void): void {
    const startTime = performance.now()
    renderFn()
    const endTime = performance.now()
    
    this.recordMetric(`${componentName}_render`, endTime - startTime)
  }

  // 測量動畫性能
  measureAnimation(animationName: string, duration: number): void {
    const startTime = performance.now()
    
    const checkFrame = () => {
      const currentTime = performance.now()
      if (currentTime - startTime < duration) {
        requestAnimationFrame(checkFrame)
      } else {
        this.recordMetric(`${animationName}_animation`, currentTime - startTime)
      }
    }
    
    requestAnimationFrame(checkFrame)
  }

  // 記錄指標
  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  // 獲取性能報告
  getReport(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const report: Record<string, { avg: number; min: number; max: number; count: number }> = {}
    
    this.metrics.forEach((values, name) => {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)
      
      report[name] = { avg, min, max, count: values.length }
    })
    
    return report
  }

  // 檢查是否符合性能目標
  checkPerformanceTargets(): { passed: boolean; issues: string[] } {
    const report = this.getReport()
    const issues: string[] = []
    
    // 檢查渲染時間目標 (< 100ms)
    Object.entries(report).forEach(([name, metrics]) => {
      if (name.includes('_render') && metrics.avg > 100) {
        issues.push(`${name}: 平均渲染時間 ${metrics.avg.toFixed(2)}ms 超過 100ms 目標`)
      }
      
      if (name.includes('_animation') && metrics.avg > 16.67) {
        issues.push(`${name}: 平均動畫幀時間 ${metrics.avg.toFixed(2)}ms 超過 16.67ms (60fps) 目標`)
      }
    })
    
    return {
      passed: issues.length === 0,
      issues
    }
  }

  // 清除指標
  clear(): void {
    this.metrics.clear()
  }
}

// 性能監控 Hook
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance()
  
  return {
    measureRender: monitor.measureRender.bind(monitor),
    measureAnimation: monitor.measureAnimation.bind(monitor),
    getReport: monitor.getReport.bind(monitor),
    checkTargets: monitor.checkPerformanceTargets.bind(monitor),
    clear: monitor.clear.bind(monitor)
  }
}