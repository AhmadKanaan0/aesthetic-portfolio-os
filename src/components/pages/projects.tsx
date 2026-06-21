import { useRef, useContext, useEffect, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateFade, animateScale, animatePop, animateTextReveal } from "@/lib/animations"
import facilify from "@/assets/Facilify.png"
import awqafRashaya from "@/assets/AwqadRashaya.png"
import nebula from "@/assets/Nebula.png"
import notionCraft from "@/assets/NotionCraft-Ai.png"
import portagen from "@/assets/Portagen.png"
import Autoplay from "embla-carousel-autoplay"

export default function Projects({ windowWidth }: { windowWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)
  const [activeProject, setActiveProject] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  const isNarrow = windowWidth !== undefined && windowWidth < 700

  useGSAP(() => {
    if (!containerRef.current) return
    const c = containerRef.current
    const root = scrollContainerRef?.current ?? null

    const ios = [
      ...animateScale(gsap.utils.toArray('[data-anim="scale"]', c), root),
      ...animatePop(gsap.utils.toArray('[data-anim="pop"]', c), root, 0.07),
      ...animateFade(gsap.utils.toArray('[data-anim="fade"]', c), root),
      ...animateTextReveal(gsap.utils.toArray('[data-anim="text"]', c), root),
    ]

    return () => ios.forEach(io => io.disconnect())
  }, { scope: containerRef, dependencies: [] })

  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => {
      setActiveProject(carouselApi.selectedScrollSnap())
      const idx = carouselApi.selectedScrollSnap()
      const slide = carouselApi.slideNodes()[idx]
      if (slide) {
        const targets = slide.querySelectorAll("h2, p, img, .flex-wrap, .mt-auto")
        gsap.fromTo(targets,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power2.out", overwrite: true }
        )
      }
    }
    onSelect()
    carouselApi.on("select", onSelect)
    return () => { carouselApi.off("select", onSelect) }
  }, [carouselApi])

  const projects = [
    {
      id: 1,
      title: "Facilify",
      description: "A full-featured facilities management platform, it provides owners, general contractors, and specialty contractors with the tools they need to get the job done.",
      image: facilify,
      tags: ["React", "Spring boot", "Postgres"],
      demoUrl: "https://www.facilify.com.au/",
      githubUrl: "https://github.com/hussamkhaled/nufm-web-deploy",
    },
    {
      id: 2,
      title: "Awqaf Rashaya",
      description: "The Awqaf Management System is a platform for managing mosques, cemeteries, religious schools, and imams, with built-in reporting tools to ensure efficient administration and transparency.",
      image: awqafRashaya,
      tags: ["React", "Spring boot", "Postgres", "OpenAi"],
      demoUrl: "https://awqaf-qa.onrender.com",
      githubUrl: {
        frontend: "https://github.com/username/task-management-frontend",
        backend: "https://github.com/username/task-management-backend",
      },
    },
    {
      id: 3,
      title: "Nebula",
      description: "Nebula is a modern AI Agent Platform designed for creating, managing, and interacting with specialized AI agents.",
      image: nebula,
      tags: ["React", "Node js", "Postgres"],
      demoUrl: "https://nebula-gamma-inky.vercel.app/",
      githubUrl: "https://github.com/AhmadKanaan0/Nebula",
    },
    {
      id: 4,
      title: "NotionCraft-ai",
      description: "NotionCraft AI: A Next.js web app mimicking Notion's rich text editor with AI-powered chat and writing features.",
      image: notionCraft,
      tags: ["Next.js", "Supabase", "Vercel ai sdk"],
      demoUrl: "https://notioncraft-ai.vercel.app/",
      githubUrl: "https://github.com/AhmadKanaan0/notioncraft-ai",
    },
    {
      id: 5,
      title: "Portagen",
      description: "PortaGen is a web-based portfolio generator that allows users to create customizable desktop environments, lock screens, and interactive windows for showcasing projects and content.",
      image: portagen,
      tags: ["Next.js", "Supabase", "Google Drive integration", "Spotify integration"],
      demoUrl: "https://porta-gen.vercel.app/",
      githubUrl: "https://github.com/AhmadKanaan0/PortaGen",
    },
  ]

  return (
    <div ref={containerRef} className="space-y-8 max-w-5xl mx-auto pixel-text">
      <div className="text-center">
        <h1 data-anim="text" className="text-3xl font-bold mb-2 pixel-title">My Projects</h1>
        <p data-anim="fade" className="opacity-80">A showcase of my best work and side projects</p>
      </div>

      <div data-anim="scale" className="relative">
        <Carousel
          setApi={setCarouselApi}
          plugins={[Autoplay({ delay: 2000 })]}
          opts={{ align: "start", loop: true }}
        >
          <div className="flex items-center gap-2">
            {!isNarrow && (
              <div className="flex items-center justify-center shrink-0">
                <CarouselPrevious className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
              </div>
            )}
            <CarouselContent className="-ml-4 items-stretch flex-1">
              {projects.map((project) => (
                <CarouselItem key={project.id} className="pl-4">
                  <Card className="pixel-card border-0 shadow-lg overflow-hidden h-full flex flex-col">
                    <div
                      className="grid gap-2 px-4 flex-1"
                      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))" }}
                    >
                      <div className="aspect-video overflow-hidden w-full max-w-full mt-4 border-2 border-[var(--cute-text)]">
                        <img
                          src={project.image || `/placeholder.svg?height=300&width=500`}
                          alt={project.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col">
                        <h2 className="text-2xl font-bold mb-2 pixel-title">{project.title}</h2>
                        <p className="text-muted-foreground mb-4 opacity-80">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">{tag}</Badge>
                          ))}
                        </div>
                        <div className="mt-auto flex flex-wrap gap-3">
                          <Button asChild className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none bg-[var(--cute-text)] text-white hover:bg-[var(--cute-text)]/90">
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                            </a>
                          </Button>
                          {typeof project.githubUrl === "string" ? (
                            <Button variant="outline" asChild className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" /> GitHub
                              </a>
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                                  <Github className="mr-2 h-4 w-4" /> Code
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="z-[9999] border-2 border-[var(--cute-text)] bg-[var(--card-bg)] rounded-none">
                                <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                                  <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">Frontend</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                                  <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">Backend</a>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {!isNarrow && (
              <div className="flex items-center justify-center shrink-0">
                <CarouselNext className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
              </div>
            )}
          </div>
          {isNarrow && (
            <div className="flex justify-center gap-4 mt-4">
              <CarouselPrevious className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
              <CarouselNext className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
            </div>
          )}
        </Carousel>
        <div className="flex justify-center mt-4 gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 border border-[var(--cute-text)] ${index === activeProject ? "bg-[var(--cute-text)]" : "bg-transparent"}`}
              onClick={() => carouselApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 mt-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {projects.map((project) => (
          <Card key={project.id} data-anim="pop" className="h-full flex flex-col hover:shadow-md transition-shadow border-0 pixel-card">
            <div className="aspect-video overflow-hidden border-b-2 border-[var(--cute-text)]">
              <img
                src={project.image || `/placeholder.svg?height=200&width=400`}
                alt={project.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <CardContent className="pt-6 flex-grow">
              <h3 className="text-xl font-bold mb-2 pixel-title">{project.title}</h3>
              <p className="text-sm opacity-70 mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs pixel-badge hover:bg-[var(--cute-highlight)]">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex gap-2 w-full">
                {typeof project.githubUrl === "string" ? (
                  <Button variant="outline" size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Code
                    </a>
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                        <Github className="mr-2 h-4 w-4" /> Code
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-[9999] border-2 border-[var(--cute-text)] bg-[var(--card-bg)] rounded-none">
                      <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                        <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">Frontend</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                        <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">Backend</a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none bg-[var(--cute-text)] text-white hover:bg-[var(--cute-text)]/90" asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Demo
                  </a>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
