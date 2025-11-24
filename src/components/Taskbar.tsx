"use client"

import type React from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppSound } from "./sound-context"

interface TaskbarProps {
  apps: {
    id: string
    label: string
    icon: string
  }[]
  openWindows: {
    name: string
    minimized: boolean
    component?: React.ReactNode
  }[]
  onAppClick: (label: string) => void
  className?: string
}

export function Taskbar({ apps, openWindows, onAppClick, className = "" }: TaskbarProps) {
  const { playClickSound, playHoverSound } = useAppSound()
  const taskbarRef = useRef<HTMLDivElement>(null)

  const handleAppClick = (label: string) => {
    playClickSound()
    onAppClick(label)
  }

  const handleMouseEnter = () => {
    playHoverSound()
  }

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (taskbarRef.current && !prefersReducedMotion) {
      gsap.fromTo(taskbarRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.8,
          ease: "back.out(1.7)"
        }
      );
    }
  }, []);

  return (
    <div
      ref={taskbarRef}
      className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-[60] ${className}`}
      style={{
        width: "auto",
      }}
    >
      <div className="liquidGlass-wrapper">
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>
        <div className="liquidGlass-content">
          <div className="dock">
            <TooltipProvider>
              {apps.map((app) => {
                const win = openWindows.find((w) => w.name === app.label)
                const isRunning = !!win
                const isMinimized = win?.minimized

                return (
                  <Tooltip key={app.id}>
                    <TooltipTrigger asChild>
                      <button
                        className="dock-icon group relative"
                        onClick={() => handleAppClick(app.label)}
                        onMouseEnter={handleMouseEnter}
                      >
                        <img
                          src={app.icon || "/placeholder.svg"}
                          alt={app.label}
                          className="drop-shadow-lg"
                        />
                        {isRunning && (
                          <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm ${isMinimized ? 'opacity-50' : 'opacity-100'}`} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-white/80 backdrop-blur-sm text-black border-none shadow-lg rounded-lg">
                      <p>{app.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}