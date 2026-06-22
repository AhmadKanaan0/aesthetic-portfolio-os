import { Monitor, Moon, Sun } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useTheme } from "@/components/theme-provider"
import { useMediaQuery } from "@/hooks/use-media-query"

const itemClass = "w-full cursor-pointer hover:bg-sky-400/30 focus:bg-sky-400/30 text-slate-200 focus:text-slate-200"
const iconClass = "h-4 w-4 mr-2 text-slate-200"

function ModeContent({ onSelect }: { onSelect: (theme: "light" | "dark" | "system") => void }) {
  return (
    <div className="liquidGlass-wrapper dropdown">
      <div className="liquidGlass-effect" />
      <div className="liquidGlass-tint" />
      <div className="liquidGlass-shine" />
      <div className="liquidGlass-content p-2 w-full">
        <div onClick={() => onSelect("light" as const)} className={`${itemClass} flex items-center p-2 rounded-sm`}>
          <Sun className={iconClass} /> Light
        </div>
        <div onClick={() => onSelect("dark" as const)} className={`${itemClass} flex items-center p-2 rounded-sm`}>
          <Moon className={iconClass} /> Dark
        </div>
        <div onClick={() => onSelect("system" as const)} className={`${itemClass} flex items-center p-2 rounded-sm`}>
          <Monitor className={iconClass} /> System
        </div>
      </div>
    </div>
  )
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const TriggerButton = (
    <button className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-200 transition-colors">
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Monitor
        className="absolute h-4 w-4 rotate-90 scale-0 transition-all data-[theme=system]:rotate-0 data-[theme=system]:scale-100"
        data-theme={theme}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{TriggerButton}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 p-0 bg-transparent border-none shadow-none z-50">
          <div className="liquidGlass-wrapper dropdown">
            <div className="liquidGlass-effect" />
            <div className="liquidGlass-tint" />
            <div className="liquidGlass-shine" />
            <div className="liquidGlass-content p-2 w-full">
              <DropdownMenuItem onClick={() => setTheme("light")} className={itemClass}>
                <Sun className={iconClass} /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className={itemClass}>
                <Moon className={iconClass} /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className={itemClass}>
                <Monitor className={iconClass} /> System
              </DropdownMenuItem>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent className="bg-transparent border-none shadow-none">
        <div className="mx-auto w-full max-w-sm p-4">
          <ModeContent onSelect={setTheme} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
