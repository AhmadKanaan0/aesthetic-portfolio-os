import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useAchievements } from './achievement-context'
import { useAppSound } from './sound-context'
import HappyCat from '@/assets/happy-cat.gif'

export default function AchievementToast() {
  const { toastQueue, dismissToast } = useAchievements()
  const { playSuccessSound } = useAppSound()
  const toastRef = useRef<HTMLDivElement>(null)
  const current = toastQueue[0]
  const currentId = current?.id

  useEffect(() => {
    if (!current || !toastRef.current) return

    playSuccessSound()
    const el = toastRef.current

    gsap.killTweensOf(el)
    gsap.fromTo(el,
      { x: 120, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )

    const timer = setTimeout(() => {
      if (toastRef.current) {
        gsap.to(el, {
          x: 120,
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
          ease: 'back.in(1.7)',
          onComplete: dismissToast,
        })
      }
    }, 3500)

    return () => clearTimeout(timer)
  }, [currentId])

  if (!current) return null

  return (
    <div
      ref={toastRef}
      className="fixed top-16 right-4 z-[200] w-72 pointer-events-none"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="liquidGlass-wrapper rounded-2xl overflow-hidden shadow-2xl">
        <div className="liquidGlass-effect" />
        <div className="liquidGlass-tint" />
        <div className="liquidGlass-shine" />
        <div className="liquidGlass-content p-3 flex items-center gap-3">
          <img
            src={HappyCat}
            alt="happy cat"
            className="w-12 h-12 rounded-xl flex-shrink-0 object-cover"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#74defc] uppercase tracking-widest mb-0.5">
              ✨ Achievement Unlocked!
            </p>
            <p className="font-bold text-sm text-white leading-tight">{current.name}</p>
            <p className="text-xs text-white/70 leading-snug line-clamp-2">{current.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
