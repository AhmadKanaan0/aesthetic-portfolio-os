import HappyCat from '@/assets/happy-cat.gif'
import { useAchievements, ACHIEVEMENTS } from '@/components/achievement-context'
import { AnimatedSection, AnimatedItem } from '@/components/animated-section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Achievements() {
  const { unlocked } = useAchievements()
  const pct = Math.round((unlocked.size / ACHIEVEMENTS.length) * 100)

  return (
    <div className="space-y-8 max-w-4xl mx-auto pixel-text">
      <AnimatedSection variant="scale" duration={0.7} className="text-center">
        <img
          src={HappyCat}
          alt="happy cat"
          className="w-20 h-20 mx-auto mb-4 rounded-none border-2 border-[var(--cute-text)] object-cover"
        />
        <h1 className="text-3xl font-bold mb-2 pixel-title">Achievements</h1>
        <p className="mb-4 opacity-80">
          Explore the portfolio to unlock them all!
        </p>
        <Badge variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">
          {unlocked.size} / {ACHIEVEMENTS.length} unlocked — {pct}%
        </Badge>
      </AnimatedSection>

      <AnimatedSection variant="slideUp" delay={0.1}>
        <div className="w-full bg-white/10 border-2 border-[var(--cute-text)] h-4 mb-2">
          <div
            className="h-full bg-[var(--cute-highlight)] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs opacity-60 pixel-text">
          <span>0%</span>
          <span>100%</span>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.05}>
        <h2 className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">
          All Achievements
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlocked.has(a.id)
            return (
              <AnimatedItem key={a.id}>
                <Card className={`pixel-card h-full transition-all duration-300 ${!isUnlocked ? 'opacity-40 grayscale' : ''}`}>
                  <CardContent className="pt-4 flex items-center gap-3">
                    <span className="text-2xl leading-none flex-shrink-0">
                      {isUnlocked ? a.icon : '🔒'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm pixel-text leading-tight truncate">
                        {isUnlocked ? a.name : '???'}
                      </p>
                      <p className="text-xs opacity-70 truncate mt-0.5">
                        {isUnlocked ? a.description : 'Keep exploring...'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
            )
          })}
        </div>
      </AnimatedSection>
    </div>
  )
}
