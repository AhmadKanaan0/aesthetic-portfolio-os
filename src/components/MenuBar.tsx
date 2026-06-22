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
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="liquidGlass-wrapper menubar flex items-center justify-between text-lg font-medium">
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>
        <div className="liquidGlass-content w-full flex items-center justify-between" style={{ color: "var(--cute-text)" }}>
          <div className="flex items-center gap-4">
            <div className="font-bold flex items-center">
              <img src={HalloGif} alt="Logo" className="h-7 w-8 mr-2" />
              <p className="text-slate-200">Ahmad kanaan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SoundSettings />
            <ModeToggle />
            <span className="text-slate-200">{format(currentTime, "EEE d MMM h:mm a")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}