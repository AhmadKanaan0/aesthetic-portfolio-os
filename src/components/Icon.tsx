import { useDraggable } from "@dnd-kit/core"
import { motion, useReducedMotion } from "motion/react"

export function DesktopIcon({
  id,
  label,
  icon,
  onDoubleClick,
}: { id: string; label: string; icon: string; onDoubleClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const prefersReducedMotion = useReducedMotion()

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0 },
    hover: prefersReducedMotion ? {} : { scale: 1.1, rotate: 5, transition: { duration: 0.2 } },
    tap: prefersReducedMotion ? {} : { scale: 0.9, transition: { duration: 0.1 } },
    drag: { scale: 1.05, zIndex: 10 },
  }

  const textVariants = {
    hover: prefersReducedMotion
      ? {}
      : {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          transition: { duration: 0.2 },
        },
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onDoubleClick={onDoubleClick}
      style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
      className="desktop-icon flex flex-col items-center justify-center w-16 sm:w-18 md:w-20 cursor-pointer select-none mb-2 pointer-events-auto transition-transform"
    >
      <motion.div
        className="w-12 h-12 flex items-center justify-center"
        variants={iconVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        whileDrag="drag"
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
          delay: Math.random() * 0.3, // Randomize delay for natural feel
        }}
      >
        <img
          src={icon || "/placeholder.svg"}
          alt={label}
          className="max-w-full max-h-full object-contain drop-shadow-md"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      </motion.div>
      <motion.span className="desktop-icon-text" variants={textVariants} whileHover="hover">
        {label}
      </motion.span>
    </div>
  )
}
