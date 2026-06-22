import { useContext } from "react"
import HappyCat from "@/assets/happy-cat.gif"
import { useAchievements, ACHIEVEMENTS } from "@/components/achievement-context"
import { ScrollContainerContext } from "@/components/animated-section"
import AnimatedContent from "@/components/AnimatedContent"

export default function Achievements() {
  const scrollContainerRef = useContext(ScrollContainerContext)
  const { unlocked } = useAchievements()
  const total = ACHIEVEMENTS.length
  const count = unlocked.size
  const pct = Math.round((count / total) * 100)

  return (
    <div className="pixel-achievement-screen min-h-full p-4 space-y-5">

      <AnimatedContent
        scale={0.82}
        ease="back.out(1.7)"
        className="relative p-5 text-center"
        style={{ border: "4px solid var(--cute-text)", boxShadow: "7px 7px 0 var(--cute-text)", background: "var(--card-bg)" }}
      >
        <div className="absolute pointer-events-none" style={{ inset: 5, border: "1px solid var(--cute-text)", opacity: 0.3 }} />
        <p className="text-[9px] tracking-[0.45em] uppercase font-bold opacity-40 mb-3">— PORTFOLIO OS v1.0 —</p>
        <div className="flex justify-center mb-3">
          <div style={{ border: "3px solid var(--cute-text)", boxShadow: "4px 4px 0 var(--cute-text)", lineHeight: 0, display: "inline-block" }}>
            <img src={HappyCat} alt="happy cat" className="w-16 h-16 block" style={{ imageRendering: "pixelated" }} />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-widest mb-1">★ ACHIEVEMENTS ★</h1>
        <p className="text-[11px] tracking-wider opacity-55 mb-4">EXPLORE THE PORTFOLIO TO UNLOCK THEM ALL</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <div className="px-3 py-1 text-xs font-bold tracking-wider"
            style={{ border: "2px solid var(--cute-text)", background: "var(--cute-text)", color: "var(--cute-on-text)", boxShadow: "2px 2px 0 rgba(0,0,0,0.2)" }}>
            SCORE: {count} / {total}
          </div>
          <div className="px-3 py-1 text-xs font-bold tracking-wider"
            style={{ border: "2px solid var(--cute-text)", background: "var(--cute-highlight)", color: "var(--cute-text)", boxShadow: "2px 2px 0 rgba(0,0,0,0.1)" }}>
            {pct}% COMPLETE
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={55} ease="back.out(1.4)">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-bold tracking-widest" style={{ color: "var(--cute-text)" }}>▸ EXP POINTS</span>
          <span className="text-[11px] font-bold opacity-50">{count} / {total}</span>
        </div>
        <div className="flex gap-0.5 p-0.5"
          style={{ border: "2px solid var(--cute-text)", boxShadow: "3px 3px 0 var(--cute-text)", background: "var(--card-bg)" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="h-4 flex-1"
              style={{ background: i < count ? "var(--cute-text)" : "var(--cute-highlight)", transition: `background-color 0.35s ease ${i * 35}ms` }} />
          ))}
        </div>
      </AnimatedContent>

      <div className="space-y-3">
        <AnimatedContent
          distance={55}
          ease="back.out(1.4)"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-widest"
          style={{ border: "2px solid var(--cute-text)", background: "var(--cute-text)", color: "var(--cute-on-text)", boxShadow: "3px 3px 0 rgba(0,0,0,0.25)" }}
        >
          <span>🏆</span>
          <span>TROPHY CASE</span>
          <span className="ml-auto opacity-60">▾</span>
        </AnimatedContent>

        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a, index) => {
            const isUnlocked = unlocked.has(a.id)
            return (
              <AnimatedContent
                key={a.id}
                delay={index * 0.05}
                distance={18}
                scale={0.78}
                ease="back.out(1.7)"
                className="pixel-achievement-card relative h-full"
                style={{
                  border: "3px solid var(--cute-text)",
                  background: isUnlocked ? "var(--cute-highlight)" : "var(--card-bg)",
                  boxShadow: isUnlocked ? "4px 4px 0 var(--cute-text)" : "3px 3px 0 rgba(0,0,0,0.15)",
                  opacity: isUnlocked ? 1 : 0.55,
                }}
              >
                {!isUnlocked && <div className="pixel-hatch-locked absolute inset-0 pointer-events-none" />}
                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-[10px] font-bold z-10"
                    style={{ background: "var(--cute-text)", color: "var(--cute-on-text)", border: "2px solid var(--card-bg)" }}>
                    ★
                  </div>
                )}
                <div className="p-2.5 flex items-center gap-2.5">
                  <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
                    style={{ border: "2px solid var(--cute-text)", background: isUnlocked ? "var(--card-bg)" : "var(--cute-bg)", boxShadow: "inset -1px -1px 0 rgba(0,0,0,0.08), inset 2px 2px 0 rgba(255,255,255,0.15)" }}>
                    {isUnlocked ? a.icon : "🔒"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] leading-tight tracking-wide truncate">
                      {isUnlocked ? a.name.toUpperCase() : "??? ??? ???"}
                    </p>
                    <p className="text-[10px] opacity-60 mt-0.5 leading-tight line-clamp-2">
                      {isUnlocked ? a.description : "Keep exploring..."}
                    </p>
                  </div>
                </div>
              </AnimatedContent>
            )
          })}
        </div>
      </div>

      <AnimatedContent
        distance={0}
        className="text-center py-2 text-[9px] tracking-[0.35em] uppercase opacity-35"
        style={{ borderTop: "2px solid var(--cute-text)" }}
      >
        © AHMAD KANAAN — ALL RIGHTS RESERVED
      </AnimatedContent>
    </div>
  )
}
