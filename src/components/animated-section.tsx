import { type ReactNode, useRef, useEffect, useState } from "react"
import { motion, useInView, type Variant, useReducedMotion, type Variants } from "motion/react"

type AnimationVariant =
  | "fadeIn"
  | "slideUp"
  | "slideRight"
  | "slideLeft"
  | "scale"
  | "stagger"
  | "rotate"
  | "flip"
  | "bounce"
  | "elastic"
  | "pulse"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  staggerChildren?: number
  priority?: boolean
}

export function AnimatedSection({
  children,
  className = "",
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  once = true,
  staggerChildren = 0.1,
  priority = false,
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: threshold, once })
  const prefersReducedMotion = useReducedMotion()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  // Throttle animations on scroll for better performance
  useEffect(() => {
    if (isInView && !shouldAnimate) {
      // Use requestAnimationFrame for smoother animation triggering
      requestAnimationFrame(() => {
        setShouldAnimate(true)
      })
    }
  }, [isInView, shouldAnimate])

  // Skip animations for users who prefer reduced motion
  const skipAnimation = prefersReducedMotion || (priority === false && window?.innerWidth < 768)

  const getVariants = () => {
    // If user prefers reduced motion, use minimal animation
    if (skipAnimation) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    }

    const variants: Record<string, Record<string, Variant>> = {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration, delay } },
      },
      slideUp: {
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            type: "spring",
            damping: 15,
          },
        },
      },
      slideRight: {
        hidden: { opacity: 0, x: -50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration,
            delay,
            type: "spring",
            damping: 15,
          },
        },
      },
      slideLeft: {
        hidden: { opacity: 0, x: 50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration,
            delay,
            type: "spring",
            damping: 15,
          },
        },
      },
      scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration,
            delay,
            type: "spring",
            damping: 12,
          },
        },
      },
      stagger: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      },
      rotate: {
        hidden: { opacity: 0, rotate: -10, scale: 0.95 },
        visible: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          transition: {
            duration,
            delay,
            type: "spring",
            damping: 12,
          },
        },
      },
      flip: {
        hidden: { opacity: 0, rotateY: 90 },
        visible: {
          opacity: 1,
          rotateY: 0,
          transition: {
            duration,
            delay,
            type: "spring",
            damping: 12,
          },
        },
      },
      bounce: {
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            type: "spring",
            stiffness: 300,
            damping: 10,
          },
        },
      },
      elastic: {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration,
            delay,
            type: "spring",
            stiffness: 300,
            damping: 8,
          },
        },
      },
      pulse: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: [0.95, 1.05, 1],
          transition: {
            duration: duration * 1.5,
            delay,
            times: [0, 0.7, 1],
          },
        },
      },
    }

    return variants[variant]
  }

  const getChildVariants = (): Variants => {
    if (skipAnimation) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    }
  
    if (variant === "stagger") {
      return {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            type: "spring",
            damping: 15,
          },
        },
      }
    }
    
    // Return a default variants object when not in stagger mode
    return {
      hidden: { opacity: 1 }, // Default to visible state
      visible: { opacity: 1 },
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate || isInView ? "visible" : "hidden"}
      variants={getVariants()}
      className={className}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      {variant === "stagger" ? (
        <motion.div
          variants={getChildVariants()}
          style={{
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
          }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className = "",
  variant = "default",
}: {
  children: ReactNode
  className?: string
  variant?: "default" | "pop" | "slide" | "fade" | "bounce"
}) {
  const prefersReducedMotion = useReducedMotion()

  const getVariants = () => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    }

    const variants = {
      default: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 15,
          },
        },
      },
      pop: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            damping: 12,
          },
        },
      },
      slide: {
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            damping: 15,
          },
        },
      },
      fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
      bounce: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
          },
        },
      },
    }

    return variants[variant]
  }

  return (
    <motion.div
      variants={getVariants()}
      className={className}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  )
}
