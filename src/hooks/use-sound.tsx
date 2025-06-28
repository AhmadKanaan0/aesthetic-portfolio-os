import { useCallback, useRef } from 'react'

interface SoundOptions {
  volume?: number
  playbackRate?: number
}

export function useSound(soundUrl: string, options: SoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { volume = 0.5, playbackRate = 1 } = options

  const play = useCallback(() => {
    try {
      // Create new audio instance each time for overlapping sounds
      const audio = new Audio(soundUrl)
      audio.volume = volume
      audio.playbackRate = playbackRate
      
      // Clean up previous audio reference
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      audioRef.current = audio
      
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Sound play failed:', error)
        })
      }
    } catch (error) {
      console.log('Sound creation failed:', error)
    }
  }, [soundUrl, volume, playbackRate])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  return { play, stop }
}