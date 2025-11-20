import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ModeToggle } from "./mode-toggle"
import { SoundSettings } from "./sound-settings"
import HalloGif from "../assets/hallo.gif";

export default function MenuBar() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-4 z-50 text-lg font-medium transition-none"
      style={{
        background: "var(--cute-header)",
        color: "var(--cute-text)",
        borderBottom: "2px solid var(--cute-text)",
        boxShadow: "0 4px 0 rgba(0,0,0,0.1)"
      }}
    >
      <div className="flex items-center gap-4">
        <div className="font-bold flex items-center">
          <img src={HalloGif} alt="Logo" className="h-7 w-8 mr-2" />
          <p>Ahmad kanaan</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SoundSettings />
        <ModeToggle />
        <span>{format(currentTime, "EEE d MMM h:mm a")}</span>
      </div>
    </div>
  )
}