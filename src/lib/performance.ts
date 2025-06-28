// Performance utilities and monitoring
export class PerformanceTracker {
  private static instance: PerformanceTracker
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker()
    }
    return PerformanceTracker.instance
  }

  // Track component render time
  trackRender(componentName: string, renderTime: number) {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, [])
    }
    
    const times = this.metrics.get(componentName)!
    times.push(renderTime)
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift()
    }
  }

  // Get average render time for a component
  getAverageRenderTime(componentName: string): number {
    const times = this.metrics.get(componentName)
    if (!times || times.length === 0) return 0
    
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  // Get all performance metrics
  getAllMetrics() {
    const result: Record<string, { average: number; count: number }> = {}
    
    this.metrics.forEach((times, componentName) => {
      result[componentName] = {
        average: this.getAverageRenderTime(componentName),
        count: times.length
      }
    })
    
    return result
  }

  // Clear metrics
  clear() {
    this.metrics.clear()
  }
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Track Core Web Vitals
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS((metric) => {
      console.log('CLS:', metric.value)
      // Send to analytics
    })
    
    onFID((metric) => {
      console.log('FID:', metric.value)
      // Send to analytics
    })
    
    onFCP((metric) => {
      console.log('FCP:', metric.value)
      // Send to analytics
    })
    
    onLCP((metric) => {
      console.log('LCP:', metric.value)
      // Send to analytics
    })
    
    onTTFB((metric) => {
      console.log('TTFB:', metric.value)
      // Send to analytics
    })
  })
}

// Resource loading optimization
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fontLink = document.createElement('link')
  fontLink.rel = 'preload'
  fontLink.href = '/fonts/inter-var.woff2'
  fontLink.as = 'font'
  fontLink.type = 'font/woff2'
  fontLink.crossOrigin = 'anonymous'
  document.head.appendChild(fontLink)

  // Preload critical images
  const criticalImages = [
    '/assets/wallpaper.jpg',
    '/assets/greeting.gif'
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = src
    link.as = 'image'
    document.head.appendChild(link)
  })
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) return

  const memory = (performance as any).memory
  
  return {
    usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
    totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
    jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
  }
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return

  // Get all script tags
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))

  console.group('Bundle Analysis')
  console.log('Scripts:', scripts.length)
  console.log('Stylesheets:', styles.length)
  
  scripts.forEach((script: HTMLScriptElement) => {
    console.log(`Script: ${script.src}`)
  })
  
  styles.forEach((style: HTMLLinkElement) => {
    console.log(`Stylesheet: ${style.href}`)
  })
  console.groupEnd()
}