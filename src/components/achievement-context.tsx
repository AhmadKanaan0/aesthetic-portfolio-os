import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

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

const STORAGE_KEY = 'portfolio-achievements'

type AchievementContextType = {
  achievements: Achievement[]
  unlocked: Set<AchievementId>
  unlock: (id: AchievementId) => void
  toastQueue: Achievement[]
  dismissToast: () => void
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

  const [toastQueue, setToastQueue] = useState<Achievement[]>([])
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
    if (newlyUnlocked.length > 0) {
      const newAchievements = newlyUnlocked
        .map(id => ACHIEVEMENTS.find(a => a.id === id))
        .filter((a): a is Achievement => !!a)
      setToastQueue(q => [...q, ...newAchievements])
    }
    prevUnlockedRef.current = new Set(unlocked)
  }, [unlocked])

  const dismissToast = useCallback(() => {
    setToastQueue(q => q.slice(1))
  }, [])

  return (
    <AchievementContext.Provider value={{ achievements: ACHIEVEMENTS, unlocked, unlock, toastQueue, dismissToast }}>
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementContext)
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider')
  return ctx
}
