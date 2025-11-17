import { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/animated-section"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import facilify from "@/assets/Facilify.png";
import awqafRashaya from "@/assets/AwqadRashaya.png";

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const projects = [
    {
      id: 1,
      title: "Facilify",
      description:
        "A full-featured facilities management platform, it provides owners, general contractors, and specialty contractors with the tools they need to get the job done.",
      image: facilify,
      tags: ["React", "Spring boot", "Postgres"],
      demoUrl: "https://www.facilify.com.au/",
      githubUrl: "https://github.com/hussamkhaled/nufm-web-deploy",
    },
    {
      id: 2,
      title: "Awqaf Rashaya",
      description:
        "The Awqaf Management System is a platform for managing mosques, cemeteries, religious schools, and imams, with built-in reporting tools to ensure efficient administration and transparency.",
      image: awqafRashaya,
      tags: ["React", "Spring boot", "Postgres", "OpenAi"],
      demoUrl: "https://awqaf-qa.onrender.com",
      githubUrl: {
        frontend: "https://github.com/username/task-management-frontend",
        backend: "https://github.com/username/task-management-backend",
      },
    },
  ]

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length)
  }

  useGSAP(() => {
    if (carouselRef.current) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
      if (prefersReducedMotion) {
        gsap.set(carouselRef.current, {
          x: -activeProject * 100 + "%"
        });
      } else {
        gsap.to(carouselRef.current, {
          x: -activeProject * 100 + "%",
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }
  }, [activeProject]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <AnimatedSection variant="fadeIn" duration={0.6} className="text-center">
        <h1 className="text-3xl font-bold mb-2">My Projects</h1>
        <p className="text-gray-700 dark:text-gray-300">A showcase of my best work and side projects</p>
      </AnimatedSection>

      <AnimatedSection variant="scale" delay={0.1} duration={0.7} className="relative" threshold={0.3}>
        <div className="overflow-hidden">
          <div
            ref={carouselRef}
            className="flex"
          >
            {projects.map((project) => (
              <div key={project.id} className="min-w-full">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="grid gap-2 px-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))" }}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image || `/placeholder.svg?height=300&width=500`}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-6 flex flex-col">
                      <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-3">
                        <Button asChild className="flex-grow sm:flex-grow-0">
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                          </a>
                        </Button>
                        {typeof project.githubUrl === "string" ? (
                          <Button variant="outline" asChild className="flex-grow sm:flex-grow-0">
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" /> GitHub
                            </a>
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="flex-grow sm:flex-grow-0">
                                <Github className="mr-2 h-4 w-4" /> Code
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="z-[9999] border border-[#373737] bg-[#212121]">
                              <DropdownMenuItem asChild>
                                <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">
                                  Frontend
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">
                                  Backend
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={prevProject}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={nextProject}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex justify-center mt-4 gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeProject ? "bg-primary" : "bg-muted"}`}
              onClick={() => setActiveProject(index)}
            />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} threshold={0.1}>
        <div className="grid gap-6 mt-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {projects.map((project) => (
            <AnimatedItem key={project.id}>
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image || `/placeholder.svg?height=200&width=400`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="pt-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    {typeof project.githubUrl === "string" ? (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" /> Code
                        </a>
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Github className="mr-2 h-4 w-4" /> Code
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="z-[9999]">
                          <DropdownMenuItem asChild>
                            <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">
                              Frontend
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">
                              Backend
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button size="sm" className="flex-1" asChild>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Demo
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}