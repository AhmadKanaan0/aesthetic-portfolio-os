import { useEffect, useState, useRef } from "react"

interface CursorImages {
  default: string
  pointer?: string
  text?: string
  resize?: string
  move?: string
  wait?: string
}

interface CustomCursorProps {
  cursorImages: CursorImages
  size?: number
}

export default function CustomCursor({ cursorImages, size = 40 }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [cursorType, setCursorType] = useState<string>("default")
  const lastElementRef = useRef<Element | null>(null)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const element = document.elementFromPoint(e.clientX, e.clientY)

      if (element !== lastElementRef.current) {
        lastElementRef.current = element

        if (element) {
          const computedStyle = window.getComputedStyle(element)
          const cursorStyle = computedStyle.cursor

          if (cursorStyle.includes("pointer")) {
            setCursorType("pointer")
          } else if (cursorStyle.includes("text")) {
            setCursorType("text")
          } else if (cursorStyle.includes("resize")) {
            setCursorType("resize")
          } else if (cursorStyle.includes("move")) {
            setCursorType("move")
          } else if (cursorStyle.includes("wait")) {
            setCursorType("wait")
          } else {
            setCursorType("default")
          }
        }
      }
    }

    const onMouseDown = () => {
      setClicked(true)
    }

    const onMouseUp = () => {
      setClicked(false)
    }

    const onMouseLeave = () => {
      setHidden(true)
    }

    const onMouseEnter = () => {
      setHidden(false)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  const currentCursorImage = cursorImages[cursorType as keyof CursorImages] || cursorImages.default

  return (
      <div
        style={{
          position: "fixed",
          left: position.x,
          top: position.y - 7,
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 9999,
          pointerEvents: "none",
          opacity: hidden ? 0 : 1,
          transform: clicked ? "scale(0.9)" : "scale(1)",
          transition: "transform 0.1s ease",
        }}
      >
        <img
          src={currentCursorImage || "/placeholder.svg"}
          alt="Custom Cursor"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
  )
}
