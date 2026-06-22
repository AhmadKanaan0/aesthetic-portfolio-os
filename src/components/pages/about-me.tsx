import { useRef, useContext, useState, useEffect } from "react"
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
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateTextReveal, animateBlurText } from "@/lib/animations"
import AnimatedContent from "@/components/AnimatedContent"

export default function AboutMe({ windowWidth }: { windowWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)
  const [testimonialApi, setTestimonialApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    if (!testimonialApi) return
    const onSelect = () => {
      const idx = testimonialApi.selectedScrollSnap()
      const slide = testimonialApi.slideNodes()[idx]
      if (slide) {
        gsap.fromTo(slide, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out", overwrite: true })
      }
    }
    testimonialApi.on("select", onSelect)
    return () => { testimonialApi.off("select", onSelect) }
  }, [testimonialApi])

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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechCorp",
      content: "One of the most talented developers I've worked with. Their attention to detail and problem-solving skills are exceptional.",
      avatar: "/avatars/avatar-1.jpg",
    },
    {
      name: "Michael Chen",
      role: "CTO at StartupX",
      content: "Delivered our project ahead of schedule with outstanding quality. A true professional who goes above and beyond.",
      avatar: "/avatars/avatar-2.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Designer at CreativeStudio",
      content: "A developer who truly understands design. Our collaboration was seamless and the implementation was perfect.",
      avatar: "/avatars/avatar-3.jpg",
    },
    {
      name: "Alex Thompson",
      role: "Senior Engineer at Innovate Inc.",
      content: "A highly skilled and collaborative team member. Their contributions have been invaluable to our project's success.",
      avatar: "/avatars/avatar-4.jpg",
    },
    {
      name: "Jessica Lee",
      role: "Product Owner at Agile Solutions",
      content: "Their ability to translate complex requirements into elegant solutions is impressive. I would highly recommend them.",
      avatar: "/avatars/avatar-5.jpg",
    },
  ]

  const hobbies = [
    { name: "Coding",       icon: "💻", description: "Building side projects and learning new technologies" },
    { name: "Photography",  icon: "📷", description: "Capturing urban landscapes and nature" },
    { name: "Gaming",       icon: "🎮", description: "Strategy and indie games" },
    { name: "Reading",      icon: "📚", description: "Tech books and science fiction" },
  ]

  const badges = ["Web Development", "Web Design", "React", "Node.js", "UI/UX"]

  return (
    <div ref={containerRef} className="space-y-8 max-w-4xl mx-auto pixel-text">
      <div className="text-center">
        <AnimatedContent scale={0.82} ease="back.out(1.7)" className="inline-block">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-[var(--cute-text)] rounded-none">
            <AvatarImage src="/profile-photo.jpg" alt="Profile" />
            <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">AK</AvatarFallback>
          </Avatar>
        </AnimatedContent>
        <h1 data-anim="text" className="text-3xl font-bold mb-2 pixel-title">Ahmad Kanaan</h1>
        <p data-anim="fade" className="mb-4 opacity-80">Full-Stack Developer with 4 years of experience</p>
        <div className="flex flex-wrap justify-center gap-2">
          {badges.map((tag, i) => (
            <AnimatedContent key={tag} delay={i * 0.07} distance={18} scale={0.78} ease="back.out(1.7)">
              <Badge variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">{tag}</Badge>
            </AnimatedContent>
          ))}
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">About Me</h2>
        <p data-anim="fade" className="mb-4 leading-relaxed">
          I'm a passionate full-stack developer with 4 years of experience building modern web applications. I specialize
          in creating responsive, user-friendly interfaces with React and building robust backend systems with Node.js. My
          approach combines technical expertise with creative problem-solving to deliver exceptional digital experiences.
        </p>
        <p data-anim="fade" className="leading-relaxed">
          When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or
          sharing my knowledge through blog posts and community events.
        </p>
      </div>

      <div>
        <h2 data-anim="text" className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Testimonials</h2>
        <AnimatedContent scale={0.82} ease="back.out(1.7)">
          <Carousel
            setApi={setTestimonialApi}
            plugins={[Autoplay({ delay: 2000 })]}
            opts={{ align: "start", loop: true }}
          >
            <div className="flex items-center gap-2">
              {windowWidth && windowWidth >= 700 && (
                <div className="flex items-center justify-center shrink-0">
                  <CarouselPrevious className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
                </div>
              )}
              <CarouselContent className="items-stretch flex-1">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className={
                      !windowWidth ? "basis-full"
                        : windowWidth < 640 ? "basis-full"
                        : windowWidth < 1024 ? "basis-1/2"
                        : "basis-1/3"
                    }
                  >
                    <div className="p-1 h-full">
                      <Card className="h-full pixel-card">
                        <CardContent className="pt-6 flex-grow flex flex-col">
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar className="shrink-0 border-2 border-[var(--cute-text)] rounded-none w-10 h-10">
                              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                              <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                                {testimonial.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium pixel-text truncate">{testimonial.name}</p>
                              <p className="text-sm opacity-70 truncate">{testimonial.role}</p>
                            </div>
                          </div>
                          <p className="italic flex-grow opacity-90">"{testimonial.content}"</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {windowWidth && windowWidth >= 700 && (
                <div className="flex items-center justify-center shrink-0">
                  <CarouselNext className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
                </div>
              )}
            </div>
            {(!windowWidth || windowWidth < 700) && (
              <div className="flex justify-center gap-4 mt-4">
                <CarouselPrevious className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
                <CarouselNext className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
              </div>
            )}
          </Carousel>
        </AnimatedContent>
      </div>

      <div>
        <h2 data-anim="text" className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">
          Hobbies & Interests
        </h2>
        <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {hobbies.map((hobby, index) => (
            <AnimatedContent key={index} delay={index * 0.07} distance={18} scale={0.78} ease="back.out(1.7)">
              <Card className="h-full pixel-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-2">{hobby.icon}</div>
                  <h3 className="font-bold mb-1 pixel-text">{hobby.name}</h3>
                  <p className="text-sm opacity-70">{hobby.description}</p>
                </CardContent>
              </Card>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </div>
  )
}
