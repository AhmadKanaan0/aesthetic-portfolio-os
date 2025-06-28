import { createContext, useContext, useState, useEffect } from 'react'

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

// Audio context for generating sounds
let audioContext: AudioContext | null = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Sound generation functions
const generateTone = (frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = 'sine') => {
  try {
    const ctx = getAudioContext()
    
    // Resume context if suspended (required for user interaction)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

const generateClickSound = (volume: number) => {
  generateTone(800, 0.1, volume * 0.3, 'square')
}

const generateHoverSound = (volume: number) => {
  generateTone(600, 0.05, volume * 0.2, 'sine')
}

const generateWindowOpenSound = (volume: number) => {
  // Ascending tone
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

const generateWindowCloseSound = (volume: number) => {
  // Descending tone
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.2)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

const generateMinimizeSound = (volume: number) => {
  generateTone(500, 0.15, volume * 0.3, 'triangle')
}

const generateMaximizeSound = (volume: number) => {
  generateTone(700, 0.15, volume * 0.3, 'triangle')
}

const generateErrorSound = (volume: number) => {
  // Double beep for error
  generateTone(300, 0.1, volume * 0.4, 'square')
  setTimeout(() => generateTone(300, 0.1, volume * 0.4, 'square'), 150)
}

const generateSuccessSound = (volume: number) => {
  // Pleasant ascending chime
  generateTone(523, 0.1, volume * 0.3, 'sine') // C5
  setTimeout(() => generateTone(659, 0.1, volume * 0.3, 'sine'), 100) // E5
  setTimeout(() => generateTone(784, 0.15, volume * 0.3, 'sine'), 200) // G5
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('portfolio-sound-enabled')
    return saved !== null ? JSON.parse(saved) : true
  })
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('portfolio-sound-volume')
    return saved !== null ? JSON.parse(saved) : 0.5
  })

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      getAudioContext()
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
    }
    
    document.addEventListener('click', initAudio)
    document.addEventListener('keydown', initAudio)
    
    return () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-sound-enabled', JSON.stringify(isSoundEnabled))
  }, [isSoundEnabled])

  useEffect(() => {
    localStorage.setItem('portfolio-sound-volume', JSON.stringify(volume))
  }, [volume])

  // Sound functions that check if sound is enabled
  const playClickSound = () => isSoundEnabled && generateClickSound(volume)
  const playHoverSound = () => isSoundEnabled && generateHoverSound(volume)
  const playWindowOpenSound = () => isSoundEnabled && generateWindowOpenSound(volume)
  const playWindowCloseSound = () => isSoundEnabled && generateWindowCloseSound(volume)
  const playMinimizeSound = () => isSoundEnabled && generateMinimizeSound(volume)
  const playMaximizeSound = () => isSoundEnabled && generateMaximizeSound(volume)
  const playErrorSound = () => isSoundEnabled && generateErrorSound(volume)
  const playSuccessSound = () => isSoundEnabled && generateSuccessSound(volume)

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