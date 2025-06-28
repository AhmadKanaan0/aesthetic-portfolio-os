import { createContext, useContext, useState, useEffect } from 'react'
import { useSound } from '@/hooks/use-sound'

interface SoundContextType {
  playClickSound: () => void
  playHoverSound: () => void
  playWindowOpenSound: () => void
  playWindowCloseSound: () => void
  playMinimizeSound: () => void
  playMaximizeSound: () => void
  playErrorSound: () => void
  playSuccessSound: () => void
  isSoundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  volume: number
  setVolume: (volume: number) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Sound URLs - using web-based sound effects
const SOUNDS = {
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  windowOpen: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  windowClose: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  minimize: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  maximize: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('portfolio-sound-enabled')
    return saved !== null ? JSON.parse(saved) : true
  })
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('portfolio-sound-volume')
    return saved !== null ? JSON.parse(saved) : 0.3
  })

  // Create sound hooks
  const { play: playClick } = useSound(SOUNDS.click, { volume: volume * 0.8 })
  const { play: playHover } = useSound(SOUNDS.hover, { volume: volume * 0.4 })
  const { play: playWindowOpen } = useSound(SOUNDS.windowOpen, { volume: volume * 0.6 })
  const { play: playWindowClose } = useSound(SOUNDS.windowClose, { volume: volume * 0.6 })
  const { play: playMinimize } = useSound(SOUNDS.minimize, { volume: volume * 0.5 })
  const { play: playMaximize } = useSound(SOUNDS.maximize, { volume: volume * 0.5 })
  const { play: playError } = useSound(SOUNDS.error, { volume: volume * 0.7 })
  const { play: playSuccess } = useSound(SOUNDS.success, { volume: volume * 0.6 })

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-sound-enabled', JSON.stringify(isSoundEnabled))
  }, [isSoundEnabled])

  useEffect(() => {
    localStorage.setItem('portfolio-sound-volume', JSON.stringify(volume))
  }, [volume])

  // Wrapped sound functions that check if sound is enabled
  const playClickSound = () => isSoundEnabled && playClick()
  const playHoverSound = () => isSoundEnabled && playHover()
  const playWindowOpenSound = () => isSoundEnabled && playWindowOpen()
  const playWindowCloseSound = () => isSoundEnabled && playWindowClose()
  const playMinimizeSound = () => isSoundEnabled && playMinimize()
  const playMaximizeSound = () => isSoundEnabled && playMaximize()
  const playErrorSound = () => isSoundEnabled && playError()
  const playSuccessSound = () => isSoundEnabled && playSuccess()

  return (
    <SoundContext.Provider
      value={{
        playClickSound,
        playHoverSound,
        playWindowOpenSound,
        playWindowCloseSound,
        playMinimizeSound,
        playMaximizeSound,
        playErrorSound,
        playSuccessSound,
        isSoundEnabled,
        setSoundEnabled,
        volume,
        setVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useAppSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useAppSound must be used within a SoundProvider')
  }
  return context
}