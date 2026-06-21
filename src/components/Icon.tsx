import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useEffect, useRef } from "react"
import { useAppSound } from "./sound-context"

export function DesktopIcon({
  id,
  label,
  icon,
  onDoubleClick,
  isBeingDragged = false,
}: { id: string; label: string; icon: string; onDoubleClick: () => void; isBeingDragged?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const { playClickSound, playHoverSound } = useAppSound()

  const handleDoubleClick = () => {
    playClickSound()
    onDoubleClick()
  }

  const handleMouseEnter = () => {
    playHoverSound()

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        rotation: 5,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseLeave = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseDown = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  const handleMouseUp = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  useEffect(() => {
    if (isBeingDragged && iconRef.current) {
      gsap.to(iconRef.current, { scale: 1, rotation: 0, duration: 0.1 });
    }
  }, [isBeingDragged]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (iconRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(iconRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
      } else {
        gsap.fromTo(iconRef.current,
          { scale: 0.8, opacity: 0, y: 10 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: Math.random() * 0.3,
            ease: "back.out(1.7)"
          }
        );
      }
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isBeingDragged ? 0.3 : 1,
      }}
      className="liquidGlass-icon desktop-icon w-20 sm:w-24 md:w-28 h-full p-2 cursor-grab active:cursor-grabbing select-none pointer-events-auto"
    >
      <div className="liquidGlass-effect"></div>
      <div className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine"></div>
      <div className="liquidGlass-content">
        <div
          ref={iconRef}
          className="w-12 h-12 flex items-center justify-center"
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
        </div>
        <span
          ref={textRef}
          className="desktop-icon-text"
        >
          {label}
        </span>
      </div>
    </div>
  )
}