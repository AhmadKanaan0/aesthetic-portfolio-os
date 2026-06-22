import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import HappyCat from '@/assets/happy-cat.gif'

export type AchievementId =
  | 'first_window' | 'about_me' | 'resume' | 'projects' | 'blog' | 'links' | 'contact'
  | 'all_apps' | 'multitasker' | 'music_head' | 'night_owl' | 'early_bird' | 'minimize'
  | 'terminal_open' | 'hire_me'

export type Achievement = {
  id: AchievementId
  name: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_window', name: 'Hello There!', description: 'You opened your very first app ✨', icon: '👋' },
  { id: 'about_me', name: 'Getting to Know You', description: 'You peeked at the About Me page 🌸', icon: '🙋' },
  { id: 'resume', name: 'On the Record', description: 'You checked out the resume 📋', icon: '📄' },
  { id: 'projects', name: 'Show Me More!', description: 'You browsed through the projects 🚀', icon: '🚀' },
  { id: 'blog', name: 'Bookworm', description: 'You opened the blog — a fellow reader! 📚', icon: '📖' },
  { id: 'links', name: 'Well Connected', description: 'You explored the links page 🔗', icon: '🔗' },
  { id: 'contact', name: 'Say Hi!', description: "You opened the contact page 💌", icon: '📬' },
  { id: 'all_apps', name: 'Full Stack Explorer', description: "You opened every single app! You're amazing! 🏆", icon: '🏆' },
  { id: 'multitasker', name: 'Multitasker', description: 'You had 3 windows open at once — busy bee! 🐝', icon: '🪟' },
  { id: 'music_head', name: 'Music Head', description: 'You hit play! Great taste 🎶', icon: '🎵' },
  { id: 'night_owl', name: 'Night Owl', description: 'Browsing after midnight? Same 🦉', icon: '🦉' },
  { id: 'early_bird', name: 'Early Bird', description: "Up before 7am? You're dedicated! ☀️", icon: '🐦' },
  { id: 'minimize', name: 'Neat Freak', description: 'You minimized a window — so tidy! 🧹', icon: '➖' },
  { id: 'terminal_open', name: 'Hacker Mode', description: 'You opened the terminal 💻', icon: '🖥️' },
  { id: 'hire_me', name: 'Bold Move!', description: 'You ran sudo hire-ahmad 👀 nice.', icon: '💼' },
]

function AchievementToastContent({ toastId, achievement }: { toastId: string | number, achievement: Achievement }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(el,
      { x: 140, opacity: 0, scale: 0.88 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )

    const timer = setTimeout(() => {
      if (!ref.current) { toast.dismiss(toastId); return }
      gsap.to(ref.current, {
        x: 140, opacity: 0, scale: 0.88,
        duration: 0.4, ease: 'back.in(1.7)',
        onComplete: () => { toast.dismiss(toastId) },
      })
    }, 3500)

    return () => clearTimeout(timer)
  }, [toastId])

  return (
    <div ref={ref} className="w-72" style={{ willChange: 'transform, opacity' }}>
      <div className="liquidGlass-wrapper" style={{ borderRadius: '1rem' }}>
        <div className="liquidGlass-effect" style={{ borderRadius: '1rem' }} />
        <div className="liquidGlass-tint" style={{ borderRadius: '1rem' }} />
        <div className="liquidGlass-shine" style={{ borderRadius: '1rem' }} />
        <div className="liquidGlass-content p-3 flex items-center gap-3">
          <img src={HappyCat} alt="happy cat" className="w-12 h-12 rounded-xl flex-shrink-0 object-cover" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#74defc] uppercase tracking-widest mb-0.5">
              ✨ Achievement Unlocked!
            </p>
            <p className="font-bold text-sm text-white leading-tight">{achievement.name}</p>
            <p className="text-xs text-white/70 leading-snug line-clamp-2">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const STORAGE_KEY = 'portfolio-achievements'

type AchievementContextType = {
  achievements: Achievement[]
  unlocked: Set<AchievementId>
  unlock: (id: AchievementId) => void
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined)

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set<AchievementId>(JSON.parse(saved)) : new Set<AchievementId>()
    } catch {
      return new Set<AchievementId>()
    }
  })

  const prevUnlockedRef = useRef<Set<AchievementId>>(new Set(unlocked))

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  useEffect(() => {
    const newlyUnlocked = [...unlocked].filter(id => !prevUnlockedRef.current.has(id))
    newlyUnlocked.forEach(id => {
      const a = ACHIEVEMENTS.find(x => x.id === id)
      if (!a) return
      toast.custom(toastId => (
        <AchievementToastContent toastId={toastId} achievement={a} />
      ), { duration: Infinity })
    })
    prevUnlockedRef.current = new Set(unlocked)
  }, [unlocked])

  return (
    <AchievementContext.Provider value={{ achievements: ACHIEVEMENTS, unlocked, unlock }}>
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementContext)
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider')
  return ctx
}
