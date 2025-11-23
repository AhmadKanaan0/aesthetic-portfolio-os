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
    <>
      <svg style={{ display: 'none' }}>
        <filter
          id="glass-distortion"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            seed="5"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>

          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

          <feSpecularLighting
            in="softMap"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="100"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>

          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="150"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div
        ref={taskbarRef}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${className}`}
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
    </>
  )
}