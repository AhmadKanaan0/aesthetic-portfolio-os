import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection, AnimatedItem } from "@/components/animated-section"
import { OptimizedImage } from "@/components/optimized-image"
import { SEOHead } from "@/components/seo-head"
import { memo, useEffect, useRef } from "react"
import { motion } from "motion/react"

const TestimonialCard = memo(({ testimonial, index }: { testimonial: any, index: number }) => (
  <div className="flex-shrink-0 w-80 mx-4">
    <Card className="h-full border-0 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gray-800/30 transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="shrink-0 ring-2 ring-blue-200/50 dark:ring-blue-400/30">
            <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium dark:text-white truncate text-gray-800">{testimonial.name}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 truncate font-medium">{testimonial.role}</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">"{testimonial.content}"</p>
        <div className="flex mt-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-sm">⭐</span>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
))

const HobbyCard = memo(({ hobby, index }: { hobby: any, index: number }) => (
  <AnimatedItem>
    <motion.div
      className="group relative"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="h-full border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-md hover:shadow-xl transition-all duration-500 overflow-hidden relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <CardContent className="pt-8 pb-6 text-center relative z-10">
          <motion.div 
            className="text-6xl mb-4 filter drop-shadow-lg"
            whileHover={{ 
              scale: 1.2, 
              rotate: [0, -10, 10, 0],
              filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))"
            }}
            transition={{ duration: 0.5 }}
          >
            {hobby.icon}
          </motion.div>
          
          <h3 className="font-bold mb-3 dark:text-white text-gray-800 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {hobby.name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {hobby.description}
          </p>

          {/* Skill level indicator */}
          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              {[...Array(hobby.level || 4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </CardContent>

        {/* Hover border effect */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/30 transition-colors duration-300" />
      </Card>
    </motion.div>
  </AnimatedItem>
))

const InfiniteSlider = ({ children, speed = 50, direction = "left" }: { 
  children: React.ReactNode, 
  speed?: number, 
  direction?: "left" | "right" 
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const scrollWidth = slider.scrollWidth
    const clientWidth = slider.clientWidth
    
    if (scrollWidth <= clientWidth) return

    let animationId: number
    let currentPosition = direction === "left" ? 0 : scrollWidth - clientWidth

    const animate = () => {
      if (direction === "left") {
        currentPosition += speed / 60 // 60fps
        if (currentPosition >= scrollWidth - clientWidth) {
          currentPosition = 0
        }
      } else {
        currentPosition -= speed / 60
        if (currentPosition <= 0) {
          currentPosition = scrollWidth - clientWidth
        }
      }
      
      slider.scrollLeft = currentPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [speed, direction])

  return (
    <div 
      ref={sliderRef}
      className="flex overflow-hidden scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {children}
    </div>
  )
}

export default memo(function AboutMe() {
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
      name: "David Kim",
      role: "Senior Developer at InnovateLab",
      content: "Ahmad's code quality is outstanding. Clean, maintainable, and well-documented. A pleasure to work with.",
      avatar: "/avatars/avatar-4.jpg",
    },
    {
      name: "Lisa Wang",
      role: "Product Owner at DigitalFlow",
      content: "Exceptional communication skills and technical expertise. Always delivers exactly what's needed, when it's needed.",
      avatar: "/avatars/avatar-5.jpg",
    },
    {
      name: "James Wilson",
      role: "Tech Lead at FutureTech",
      content: "Ahmad brings innovative solutions to complex problems. His full-stack expertise is truly impressive.",
      avatar: "/avatars/avatar-6.jpg",
    },
  ]

  const hobbies = [
    { 
      name: "Coding", 
      icon: "💻", 
      description: "Building side projects and learning new technologies like AI and blockchain",
      level: 5
    },
    { 
      name: "Photography", 
      icon: "📷", 
      description: "Capturing urban landscapes, nature, and street photography with vintage film cameras",
      level: 4
    },
    { 
      name: "Gaming", 
      icon: "🎮", 
      description: "Strategy games, indie titles, and retro arcade classics from the 80s and 90s",
      level: 4
    },
    { 
      name: "Reading", 
      icon: "📚", 
      description: "Tech books, science fiction novels, and philosophy. Currently reading about quantum computing",
      level: 5
    },
    { 
      name: "Music", 
      icon: "🎵", 
      description: "Playing guitar, producing electronic music, and collecting vinyl records",
      level: 3
    },
    { 
      name: "Travel", 
      icon: "✈️", 
      description: "Exploring new cultures, trying local cuisines, and documenting adventures through photography",
      level: 4
    },
  ]

  // Create multiple rows of testimonials for infinite scroll
  const testimonialRows = [
    testimonials.slice(0, 2),
    testimonials.slice(2, 4),
    testimonials.slice(4, 6),
  ]

  return (
    <>
      <SEOHead 
        title="About Me - Ahmad Kanaan"
        description="Learn more about Ahmad Kanaan, a passionate full-stack developer with 4 years of experience in React, Node.js, and modern web technologies."
        type="profile"
        keywords={['about', 'ahmad kanaan', 'full-stack developer', 'react developer', 'web developer']}
      />
      <div className="space-y-12 max-w-6xl mx-auto">
        <AnimatedSection variant="scale" duration={0.7} className="text-center">
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-blue-200/50 dark:ring-blue-400/30 shadow-2xl">
              <AvatarImage src="/profile-photo.jpg" alt="Ahmad Kanaan Profile" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                AK
              </AvatarFallback>
            </Avatar>
            
            {/* Floating elements around avatar */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-blue-400/40 rounded-full"
                style={{
                  left: `${50 + Math.cos((i * Math.PI * 2) / 6) * 80}%`,
                  top: `${50 + Math.sin((i * Math.PI * 2) / 6) * 80}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ahmad Kanaan
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-700 dark:text-gray-300 mb-6 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Full-Stack Developer with 4 years of experience
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {["Web Development", "Web Design", "React", "Node.js", "UI/UX"].map((skill, index) => (
              <motion.div
                key={skill}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-300/50 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 font-medium px-4 py-2"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection variant="slideUp" delay={0.1}>
          <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg">
                I'm a passionate full-stack developer with 4 years of experience building modern web applications. I
                specialize in creating responsive, user-friendly interfaces with React and building robust backend systems
                with Node.js. My approach combines technical expertise with creative problem-solving to deliver exceptional
                digital experiences.
              </p>
              <p className="text-lg">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or
                sharing my knowledge through blog posts and community events. I believe in continuous learning and staying
                up-to-date with the latest industry trends and best practices.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1}>
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What People Say
          </h2>
          
          <div className="space-y-6">
            {testimonialRows.map((row, rowIndex) => (
              <motion.div
                key={rowIndex}
                initial={{ opacity: 0, x: rowIndex % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.2, duration: 0.8 }}
              >
                <InfiniteSlider 
                  speed={30 + rowIndex * 10} 
                  direction={rowIndex % 2 === 0 ? "left" : "right"}
                >
                  {/* Duplicate testimonials for seamless loop */}
                  {[...row, ...row, ...row].map((testimonial, index) => (
                    <TestimonialCard 
                      key={`${rowIndex}-${index}`} 
                      testimonial={testimonial} 
                      index={index} 
                    />
                  ))}
                </InfiniteSlider>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection variant="stagger" delay={0.3} staggerChildren={0.1}>
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hobbies & Interests
          </h2>
          
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {hobbies.map((hobby, index) => (
              <HobbyCard key={index} hobby={hobby} index={index} />
            ))}
          </div>
        </AnimatedSection>

        {/* Fun stats section */}
        <AnimatedSection variant="slideUp" delay={0.4}>
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-blue-200/30 dark:border-blue-400/20">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Fun Facts About Me
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Projects Built", value: "50+", icon: "🚀" },
                { label: "Coffee Cups", value: "∞", icon: "☕" },
                { label: "Years Coding", value: "4+", icon: "💻" },
                { label: "Happy Clients", value: "25+", icon: "😊" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  )
})