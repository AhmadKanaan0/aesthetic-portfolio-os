"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useReducedMotion } from "motion/react"

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
  const prefersReducedMotion = useReducedMotion()

  const taskbarVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.9 + i * 0.05,
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    }),
    hover: prefersReducedMotion
      ? {}
      : {
          scale: 1.1,
          transition: { duration: 0.2 },
        },
    tap: prefersReducedMotion
      ? {}
      : {
          scale: 0.95,
          transition: { duration: 0.1 },
        },
  }

  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  return (
    <motion.div
      variants={taskbarVariants}
      initial="hidden"
      animate="visible"
      className={`taskbar ${className}`}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      <TooltipProvider>
        {apps.map((app, index) => {
          const win = openWindows.find((w) => w.name === app.label)
          const isRunning = !!win

          return (
            <Tooltip key={app.id}>
              <TooltipTrigger asChild>
                <motion.div
                  className="relative flex flex-col items-center cursor-pointer group p-1"
                  onClick={() => onAppClick(app.label)}
                  variants={iconVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img
                      src={app.icon || "/placeholder.svg"}
                      alt={app.label}
                      className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110 drop-shadow-md"
                    />
                  </div>
                  {isRunning && (
                    <motion.div
                      className="taskbar-indicator"
                      variants={dotVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{app.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </motion.div>
  )
}
