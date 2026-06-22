import { useRef, useContext } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, FileText, Bookmark } from "lucide-react"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateTextReveal, animateBlurText } from "@/lib/animations"
import AnimatedContent from "@/components/AnimatedContent"

export default function Links() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)

  useGSAP(() => {
    if (!containerRef.current) return
    const c = containerRef.current
    const root = scrollContainerRef?.current ?? null
    const ios = [
      ...animateBlurText(gsap.utils.toArray('p[data-anim="fade"]', c), root),
      ...animateTextReveal(gsap.utils.toArray('[data-anim="text"]', c), root),
    ]
    return () => ios.forEach(io => io.disconnect())
  }, { scope: containerRef, dependencies: [] })

  const socialLinks = [
    { name: "GitHub",    url: "https://github.com/username",          icon: <Github    className="h-5 w-5" />, color: "bg-gray-900 hover:bg-gray-800"  },
    { name: "LinkedIn",  url: "https://linkedin.com/in/username",     icon: <Linkedin  className="h-5 w-5" />, color: "bg-blue-600 hover:bg-blue-700"  },
    { name: "Twitter",   url: "https://twitter.com/username",         icon: <Twitter   className="h-5 w-5" />, color: "bg-sky-500 hover:bg-sky-600"    },
    { name: "Instagram", url: "https://instagram.com/username",       icon: <Instagram className="h-5 w-5" />, color: "bg-pink-600 hover:bg-pink-700"  },
  ]

  const projectLinks = [
    { name: "Personal Blog",    url: "https://blog.example.com",         icon: <FileText  className="h-5 w-5" />, description: "Articles about web development and design"  },
    { name: "Portfolio",        url: "https://portfolio.example.com",    icon: <Globe     className="h-5 w-5" />, description: "Showcase of my best work and projects"       },
    { name: "YouTube Channel",  url: "https://youtube.com/c/username",   icon: <Youtube   className="h-5 w-5" />, description: "Tutorials and coding livestreams"            },
    { name: "Bookmarks",        url: "https://links.example.com",        icon: <Bookmark  className="h-5 w-5" />, description: "Curated resources for developers"            },
  ]

  return (
    <div ref={containerRef} className="space-y-8 max-w-3xl mx-auto pixel-text">
      <div className="text-center">
        <h1 data-anim="text" className="text-3xl font-bold mb-2 pixel-title">Connect With Me</h1>
        <p data-anim="fade" className="opacity-80">Find me across the web and get in touch</p>
      </div>

      <div>
        <h2 data-anim="text" className="text-xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">
          Social Media
        </h2>
        <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {socialLinks.map((link, index) => (
            <AnimatedContent key={index} delay={index * 0.07} distance={18} scale={0.78} ease="back.out(1.7)">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" className={`w-full ${link.color} text-white rounded-none border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] transition-all`}>
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </Button>
              </a>
            </AnimatedContent>
          ))}
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="text-xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">
          Projects & Resources
        </h2>
        <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {projectLinks.map((link, index) => (
            <AnimatedContent key={index} delay={index * 0.07} distance={18} scale={0.78} ease="back.out(1.7)">
              <Card className="h-full hover:shadow-md transition-shadow pixel-card border-0">
                <CardContent className="p-4">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3">
                    <div className="bg-[var(--cute-highlight)] p-2 rounded-none shrink-0 border-2 border-[var(--cute-text)] text-[var(--cute-text)]">{link.icon}</div>
                    <div>
                      <h3 className="font-medium pixel-text">{link.name}</h3>
                      <p className="text-sm opacity-70">{link.description}</p>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </AnimatedContent>
          ))}
        </div>
      </div>

      <AnimatedContent distance={0} className="text-center">
        <Card className="bg-[var(--cute-bg)] border-2 border-dashed border-[var(--cute-text)] rounded-none shadow-none">
          <CardContent className="p-6">
            <Mail className="h-8 w-8 mx-auto mb-2 text-[var(--cute-text)]" />
            <h2 className="text-xl font-bold mb-1 pixel-title">Get in Touch</h2>
            <p className="opacity-80 mb-4">Have a project in mind or just want to say hello?</p>
            <Button variant="default" className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--cute-text)] text-white hover:bg-[var(--cute-text)]/90">
              <Mail className="mr-2 h-4 w-4" /> Contact Me
            </Button>
          </CardContent>
        </Card>
      </AnimatedContent>
    </div>
  )
}
