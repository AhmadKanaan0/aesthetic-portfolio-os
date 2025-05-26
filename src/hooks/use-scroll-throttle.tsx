import { useState, useEffect, useCallback } from "react"

// Custom hook to throttle scroll events for better performance
export function useScrollThrottle(delay = 100) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const handleScroll = useCallback(() => {
    setIsScrolling(true)
    setScrollPosition(window.scrollY)

    // Clear the timeout if it exists
    const timeoutId = setTimeout(() => {
      setIsScrolling(false)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [delay])

  useEffect(() => {
    // Use passive: true for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  return { scrollPosition, isScrolling }
}
