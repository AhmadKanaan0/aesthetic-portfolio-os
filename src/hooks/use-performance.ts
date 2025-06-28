import { useEffect, useState } from 'react'

interface PerformanceData {
  renderTime: number
  componentCount: number
  memoryUsage: number
}

export function usePerformance(componentName: string) {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0,
  })

  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      setPerformanceData(prev => ({
        ...prev,
        renderTime,
        componentCount: prev.componentCount + 1,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      }))
      
      // Log performance data in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time:`, renderTime.toFixed(2), 'ms')
      }
    }
  }, [componentName])

  return performanceData
}