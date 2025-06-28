import { useState } from 'react'
import { Volume2, VolumeX, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { motion, AnimatePresence } from 'motion/react'
import { useAppSound } from './sound-context'

export function SoundSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    isSoundEnabled, 
    setSoundEnabled, 
    volume, 
    setVolume,
    playClickSound 
  } = useAppSound()

  const handleToggleSound = () => {
    setSoundEnabled(!isSoundEnabled)
    if (!isSoundEnabled) {
      // Play a test sound when enabling
      setTimeout(() => playClickSound(), 100)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    playClickSound() // Test sound when adjusting volume
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen(!isOpen)
          playClickSound()
        }}
        className="relative flex items-center p-1 rounded-md cursor-pointer hover:text-black hover:bg-white/10 hover:dark:bg-gray-900/60 hover:dark:text-white"
      >
        {isSoundEnabled ? (
          <Volume2 className="h-[1rem] w-[1rem]" />
        ) : (
          <VolumeX className="h-[1rem] w-[1rem]" />
        )}
        <span className="sr-only">Sound settings</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-800/50 rounded-xl shadow-lg z-50"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sound Effects</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleSound}
                  className="h-8"
                >
                  {isSoundEnabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              {isSoundEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[volume]}
                    max={1}
                    min={0}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Adds click sounds and audio feedback to interactions
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}