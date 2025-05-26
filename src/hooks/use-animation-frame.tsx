"use client"

import { useCallback, useEffect, useRef } from "react"

// Custom hook for optimized animations using requestAnimationFrame
export function useAnimationFrame(callback: (deltaTime: number) => void, dependencies: any[] = []) {
  // Use useRef for mutable variables that won't cause rerenders
  const requestRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(0)
  const callbackRef = useRef(callback)

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callbackRef.current(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate, ...dependencies])
}
