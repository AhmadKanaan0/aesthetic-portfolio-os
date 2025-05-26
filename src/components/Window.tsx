import type React from "react";

import { Rnd } from "react-rnd";
import { useEffect, useState, useRef } from "react";
import { Maximize, Minus, X, Square } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useResizeObserver } from "@/hooks/use-resize-observer";

let globalZ = 100;

const getOptimalWindowSize = (title: string) => {
  switch (title) {
    case "About me":
      return { width: 800, height: 600 };
    case "Resume":
      return { width: 850, height: 600 };
    case "Projects":
      return { width: 900, height: 600 };
    case "Blog":
      return { width: 850, height: 600 };
    case "Links":
      return { width: 750, height: 600 };
    case "Contact me":
      return { width: 800, height: 600 };
    default:
      return { width: 800, height: 600 };
  }
};

export function AppWindow({
  title,
  children,
  onClose,
  onMinimize,
  isMobile = false,
  isMinimized = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  isMobile?: boolean;
  isMinimized?: boolean;
}) {
  const [zIndex, setZIndex] = useState(globalZ++);
  const [isMaximized, setIsMaximized] = useState(isMobile ? true : false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(getOptimalWindowSize(title));
  const [isVisible, setIsVisible] = useState(false);
  const [prevSize, setPrevSize] = useState(size);
  const [prevPosition, setPrevPosition] = useState(position);
  const rndRef = useRef<Rnd>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const centerX = window.innerWidth / 2 - size.width / 2;
    const centerY = window.innerHeight / 2 - size.height / 2;
    setPosition({
      x: Math.max(10, Math.min(centerX, window.innerWidth - size.width - 10)),
      y: Math.max(10, Math.min(centerY, window.innerHeight - size.height - 10)),
    });

    setTimeout(() => setIsVisible(true), 50);
  }, [size.width, size.height]);

  useEffect(() => {
    if (isMobile) {
      setIsMaximized(true);
    }
  }, [isMobile]);

  const bringToFront = () => setZIndex(++globalZ);

  const toggleMaximize = () => {
    if (isMobile) return;

    if (!isMaximized) {
      setPrevSize(size);
      setPrevPosition(position);

      setIsMaximized(true);
    } else {
      setSize(prevSize);
      setPosition(prevPosition);
      setIsMaximized(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (isMaximized && !isMobile) {
        if (rndRef.current) {
          rndRef.current.updateSize({
            width: window.innerWidth,
            height: window.innerHeight - 10,
          });
          rndRef.current.updatePosition({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized, isMobile]);

  useEffect(() => {
    if (isMaximized && !isMobile && rndRef.current) {
      rndRef.current.updateSize({
        width: window.innerWidth,
        height: window.innerHeight - 10,
      });
      rndRef.current.updatePosition({ x: 0, y: 0 });
    }
  }, [isMaximized, isMobile]);

  const contentRef = useRef<HTMLDivElement>(null);
  const { width: contentWidth } = useResizeObserver(contentRef);

  const mobileWindowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const desktopWindowVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : isMobile
      ? mobileWindowVariants
      : desktopWindowVariants;

  if (isMobile) {
    return (
      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="fixed inset-0 z-50 flex flex-col window-mobile"
            style={{
              zIndex,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="window-header-mobile">
              <span className="font-semibold text-sm truncate">{title}</span>
              <div className="flex gap-1 shrink-0">
                <motion.button
                  onClick={onMinimize}
                  className="window-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={14} />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="window-button window-button-close"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>
            <div
              ref={contentRef}
              className="window-content-mobile"
              data-width={contentWidth}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isMinimized && (
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          exit="exit"
          variants={variants}
          className="absolute"
          style={{
            zIndex,
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            color: "var(--text-primary)",
          }}
        >
          <Rnd
            ref={rndRef}
            size={
              isMaximized
                ? { width: window.innerWidth, height: window.innerHeight - 10 }
                : size
            }
            position={isMaximized ? { x: 0, y: 0 } : position}
            onDragStop={(e, d) => {
              if (!isMaximized) {
                setPosition({ x: d.x, y: d.y });
              }
            }}
            onResizeStop={(e, direction, ref, delta, pos) => {
              if (!isMaximized) {
                setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                setPosition(pos);
              }
            }}
            enableResizing={!isMaximized}
            disableDragging={isMaximized}
            dragHandleClassName="window-drag-handle"
            onDragStart={bringToFront}
            onResizeStart={bringToFront}
            onClick={bringToFront}
            bounds="window"
            className={`window-container bg-white/90 dark:bg-gray-900/90 backdrop-blur-md ${isMaximized ? "maximized-window" : ""}`}
            minWidth={350}
            minHeight={300}
            default={{
              x: position.x,
              y: position.y,
              width: size.width,
              height: size.height,
            }}
          >
            <div className="window-drag-handle">
              <span className="font-semibold text-sm truncate">{title}</span>
              <div className="flex gap-1 shrink-0">
                <motion.button
                  onClick={onMinimize}
                  className="window-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={14} />
                </motion.button>
                <motion.button
                  onClick={toggleMaximize}
                  className="window-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMaximized ? <Square size={14} /> : <Maximize size={14} />}
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="window-button window-button-close"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>
            <div
              ref={contentRef}
              className="window-content"
              data-width={contentWidth}
            >
              {children}
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
