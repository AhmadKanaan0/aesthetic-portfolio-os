import { useRef, useContext } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateFade, animateSlideUp, animatePop, animateTextReveal } from "@/lib/animations"

export default function Resume() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)

  useGSAP(() => {
    if (!containerRef.current) return
    const c = containerRef.current
    const root = scrollContainerRef?.current ?? null

    const ios = [
      ...animateSlideUp(gsap.utils.toArray('[data-anim="slide"]', c), root, 0.09),
      ...animatePop(gsap.utils.toArray('[data-anim="pop"]', c), root, 0.07),
      ...animateFade(gsap.utils.toArray('[data-anim="fade"]', c), root),
      ...animateTextReveal(gsap.utils.toArray('[data-anim="text"]', c), root),
    ]

    return () => ios.forEach(io => io.disconnect())
  }, { scope: containerRef, dependencies: [] })

  const education = [
    {
      degree: "Bachelor in Computer science",
      institution: "Lebanese University Tripoli, Lebanon",
      year: "",
      description: "",
    },
  ]

  const experience = [
    {
      role: "Full Stack Developer",
      company: "Sword group",
      period: "Aug 2025 - Present",
      achievements: [
        "Contributed to multiple Spring Boot and React projects using PostgreSQL, delivering scalable and maintainable enterprise applications.",
        "Integrated OpenAI to automate backend class generation, reducing manual development time by 20%.",
        "Enhanced report generation performance by 35% within an Islamic institute management system.",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Anchor holdings",
      period: "Jun 2021 - Aug 2025",
      achievements: [
        "Developed and implemented innovative backend and frontend solutions for multiple projects, resulting in a 30% increase in website traffic and a 20% decrease in page loading time.",
        "Led cross-functional teams of 5-7 developers and designers to deliver 3 high-profile projects on time and within budget, achieving 95%+ client satisfaction.",
        "Developed and implemented coding patterns to accelerate development, reducing project timelines by an average of 15% per project.",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Afaq",
      period: "Jan 2021 - Jun 2021",
      achievements: [
        "Rebuilt company website with React and Node.js, improving load time by 60% and reducing bounce rate by 25%.",
        "Developed real-time task management dashboard using WebSocket, increasing user satisfaction by 50% and reducing support tickets by 30%.",
        "Collaborated with cross-functional teams to integrate new design elements into the website, resulting in a visually appealing interface that contributed to a 20% increase in conversion rates.",
      ],
    },
  ]

  const leadership = [
    {
      role: "Mentor",
      company: "Anchor venture holdings",
      period: "Jun 2021 - Aug 2025",
      achievements: [
        "Mentored 10+ junior developers on React, Spring Boot, and company workflows, reducing onboarding time by 30% and increasing team productivity by 20%.",
        "Led technical planning for 4 major projects, managing sprints and architecture decisions, achieving 95% client satisfaction and 15% increase in profitability.",
        "Created training curriculum for Spring Boot and React, delivering workshops to 15+ employees with 90% proficiency rate.",
      ],
    },
  ]

  const skillCategories = [
    { name: "DevOps / Cloud",       skills: ["Docker", "Azure", "Google Cloud", "Aws", "Kubernetes"],                        icon: "☁️" },
    { name: "Backend Development",  skills: ["Spring Boot", "Node.js", "Express", "NestJs", "Laravel", "Django"],            icon: "⚙️" },
    { name: "Frontend Development", skills: ["React", "Next.js", "TypeScript"],                                               icon: "🎨" },
    { name: "Databases",            skills: ["MongoDB", "PostgreSQL", "Redis"],                                               icon: "🗄️" },
    { name: "Data Science / ML",    skills: ["pandas", "scikit-learn", "NumPy", "Matplotlib", "data visualization"],         icon: "📊" },
  ]

  const interests = ["Reading mangas", "UI/UX Design", "Technical Blogging (hashnode)", "3D Modeling", "Chess", "Data science"]

  return (
    <div ref={containerRef} className="space-y-8 max-w-4xl mx-auto pixel-text">
      <div className="flex justify-between items-center">
        <h1 data-anim="text" className="text-3xl font-bold pixel-title">Resume</h1>
        <div data-anim="fade">
          <Button variant="outline" size="sm" className="border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Education</h2>
        <div className="space-y-4 mt-4">
          {education.map((edu, index) => (
            <Card key={index} data-anim="slide" className="pixel-card border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-lg pixel-text">{edu.degree}</h3>
                    <p className="opacity-70">{edu.institution}</p>
                  </div>
                  <Badge variant="outline" className="mt-1 sm:mt-0 pixel-badge">{edu.year}</Badge>
                </div>
                <p className="text-sm opacity-70">{edu.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Work Experience</h2>
        <div className="space-y-4 mt-4">
          {experience.map((exp, index) => (
            <Card key={index} data-anim="slide" className="pixel-card border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-lg pixel-text">{exp.role}</h3>
                    <p className="opacity-70">{exp.company}</p>
                  </div>
                  <Badge variant="outline" className="mt-1 sm:mt-0 pixel-badge">{exp.period}</Badge>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {exp.achievements.map((a, i) => <li key={i} className="text-sm opacity-70">{a}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Leadership Experience</h2>
        <div className="space-y-4 mt-4">
          {leadership.map((lead, index) => (
            <Card key={index} data-anim="slide" className="pixel-card border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-lg pixel-text">{lead.role}</h3>
                    <p className="opacity-70">{lead.company}</p>
                  </div>
                  <Badge variant="outline" className="mt-1 sm:mt-0 pixel-badge">{lead.period}</Badge>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {lead.achievements.map((a, i) => <li key={i} className="text-sm opacity-70">{a}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Skills</h2>
        <div className="grid gap-6 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {skillCategories.map((cat, index) => (
            <Card key={index} data-anim="pop" className="h-full pixel-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl">{cat.icon}</div>
                  <h3 className="text-xl font-bold pixel-text">{cat.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1 pixel-badge hover:bg-[var(--cute-highlight)]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div data-anim="slide">
        <h2 className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Interests</h2>
        <Card className="pixel-card border-0">
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {interests.map((interest, index) => (
                <li key={index} className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-none bg-[var(--cute-text)]" />
                  <span className="pixel-text">{interest}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
