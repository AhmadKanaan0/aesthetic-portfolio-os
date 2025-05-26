import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ModeToggle } from "./mode-toggle"

export default function MenuBar() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-7 bg-white/20 dark:bg-gray-900/40 backdrop-blur-xs flex items-center justify-between px-4 text-white z-50 text-sm">
      <div className="flex items-center gap-4">
        <div className="font-bold flex items-center">
          <span className="mr-1">🌸</span> Portfolio
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <span>{format(currentTime, "EEE d MMM h:mm a")}</span>
      </div>
    </div>
  )
}
