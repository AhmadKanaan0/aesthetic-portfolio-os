import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
  renderTime: number
}

export function PerformanceMonitor({ enabled = false }: { enabled?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage: (performance as any).memory?.usedJSHeapSize 
            ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
            : 0,
          loadTime: Math.round(performance.now()),
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }

    measureFPS()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [enabled])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible])

  if (!enabled) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 z-[9999] bg-black/80 text-white p-4 rounded-lg font-mono text-sm backdrop-blur-sm"
        >
          <div className="space-y-1">
            <div className="text-green-400 font-bold">Performance Monitor</div>
            <div>FPS: <span className={metrics.fps < 30 ? 'text-red-400' : 'text-green-400'}>{metrics.fps}</span></div>
            <div>Memory: <span className="text-blue-400">{metrics.memoryUsage}MB</span></div>
            <div>Load Time: <span className="text-yellow-400">{metrics.loadTime}ms</span></div>
            <div className="text-xs text-gray-400 mt-2">Ctrl+Shift+P to toggle</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}