import { useState } from 'react'
import { Volume2, VolumeX, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useAppSound } from './sound-context'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import SliderIcon from "../assets/SliderIcon.png"

interface SoundContentProps {
  isSoundEnabled: boolean
  volume: number
  onToggle: () => void
  onVolumeChange: (value: number[]) => void
  onVolumeCommit: () => void
  onTest: () => void
}

function SoundContent({ isSoundEnabled, volume, onToggle, onVolumeChange, onVolumeCommit, onTest }: SoundContentProps) {
  return (
    <div className="liquidGlass-wrapper dropdown">
      <div className="liquidGlass-effect" />
      <div className="liquidGlass-tint" />
      <div className="liquidGlass-shine" />
      <div className="liquidGlass-content p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-900">8-Bit Sound Effects</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-900">Retro Audio</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="h-8 text-slate-900 border-white/20 bg-sky-500/20 hover:bg-sky-500/30 hover:text-slate-900"
            >
              {isSoundEnabled ? 'On' : 'Off'}
            </Button>
          </div>

          {isSoundEnabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-900">Volume</span>
                  <span className="text-xs text-slate-700">{Math.round(volume * 100)}%</span>
                </div>
                <Slider
                  value={[volume]}
                  max={1}
                  min={0}
                  step={0.01}
                  className="cursor-pointer w-full"
                  onValueChange={onVolumeChange}
                  onValueCommit={onVolumeCommit}
                  trackClassName="bg-[#ccf2fc]"
                  rangeClassName="bg-[#74defc]"
                  thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                  thumb={
                    <img src={SliderIcon} className="w-full h-full object-cover rounded-full" alt="sliderIcon" />
                  }
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onTest}
                className="w-full text-xs text-slate-900 border-white/20 bg-sky-500/20 hover:bg-sky-500/30 hover:text-slate-900"
              >
                🎮 Test Retro Sounds
              </Button>
            </>
          )}

          <div className="text-xs text-slate-700">
            Classic 8-bit arcade sounds with square waves and chiptune effects
          </div>
        </div>
      </div>
    </div>
  )
}

export function SoundSettings() {
  const { isSoundEnabled, setSoundEnabled, volume, setVolume, playClickSound, playPowerUpSound, playMenuSound } = useAppSound()
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleToggle = () => {
    setSoundEnabled(!isSoundEnabled)
    if (!isSoundEnabled) setTimeout(() => playPowerUpSound(), 100)
  }

  const handleVolumeChange = (value: number[]) => setVolume(value[0])
  const handleVolumeCommit = () => playClickSound()

  const handleTest = () => {
    playMenuSound()
    setTimeout(() => playClickSound(), 200)
    setTimeout(() => playPowerUpSound(), 400)
  }

  const TriggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-200 transition-colors"
    >
      {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      <span className="sr-only">Retro sound settings</span>
    </Button>
  )

  const contentProps = {
    isSoundEnabled,
    volume,
    onToggle: handleToggle,
    onVolumeChange: handleVolumeChange,
    onVolumeCommit: handleVolumeCommit,
    onTest: handleTest,
  }

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{TriggerButton}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 p-0 bg-transparent border-none shadow-none z-50">
          <SoundContent {...contentProps} />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent className="bg-transparent border-none shadow-none">
        <div className="mx-auto w-full max-w-sm p-4">
          <SoundContent {...contentProps} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
