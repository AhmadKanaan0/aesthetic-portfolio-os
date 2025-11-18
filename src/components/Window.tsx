import React from "react";

import { Rnd } from "react-rnd";
import { useEffect, useState, useRef } from "react";
import { Maximize, Minus, X, Square } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useAppSound } from "./sound-context";
import { CuteSuspenseFallback } from "./suspense-fallback";

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
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(globalZ++);
  const [isMaximized, setIsMaximized] = useState(isMobile ? true : false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(getOptimalWindowSize(title));
  const [isVisible, setIsVisible] = useState(false);
  const [prevSize, setPrevSize] = useState(size);
  const [prevPosition, setPrevPosition] = useState(position);
  const rndRef = useRef<Rnd>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const {
    playWindowOpenSound,
    playWindowCloseSound,
    playMinimizeSound,
    playMaximizeSound,
    playClickSound,
  } = useAppSound();

  useEffect(() => {
    const centerX = window.innerWidth / 2 - size.width / 2;
    const centerY = window.innerHeight / 2 - size.height / 2;
    setPosition({
      x: Math.max(10, Math.min(centerX, window.innerWidth - size.width - 10)),
      y: Math.max(10, Math.min(centerY, window.innerHeight - size.height - 10)),
    });

    setIsVisible(true);
    playWindowOpenSound();
  }, [size.width, size.height, playWindowOpenSound]);

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
      playMaximizeSound();
    } else {
      setSize(prevSize);
      setPosition(prevPosition);
      setIsMaximized(false);
      playMaximizeSound();
    }
  };

  const handleClose = () => {
    playWindowCloseSound();

    // Exit animation
    if (windowRef.current) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.to(windowRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => onClose?.(),
        });
      } else {
        gsap.to(windowRef.current, {
          opacity: 0,
          scale: 0.9,
          y: isMobile ? 20 : 0,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => onClose?.(),
        });
      }
    } else {
      onClose?.();
    }
  };

  const handleMinimize = () => {
    playMinimizeSound();
    onMinimize?.();
  };

  const handleButtonClick = (action: () => void) => {
    playClickSound();
    action();
  };

  useEffect(() => {
    const handleResize = () => {
      if (isMaximized && !isMobile) {
        if (rndRef.current) {
          rndRef.current.updateSize({
            width: window.innerWidth,
            height: window.innerHeight,
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
        height: window.innerHeight,
      });
      rndRef.current.updatePosition({ x: 0, y: 0 });
    }
  }, [isMaximized, isMobile]);

  const contentRef = useRef<HTMLDivElement>(null);
  const { width: contentWidth } = useResizeObserver(contentRef);

  // GSAP entrance animation
  useGSAP(() => {
    if (!isVisible || !windowRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.fromTo(
        windowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    } else {
      if (isMobile) {
        gsap.fromTo(
          windowRef.current,
          { opacity: 0, y: 20, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      } else {
        gsap.fromTo(
          windowRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            ease: "power2.out",
          }
        );
      }
    }
  }, [isVisible, isMobile]);

  // Helper function for button animations
  const handleButtonAnimation = (
    e: React.MouseEvent<HTMLButtonElement>,
    phase: "enter" | "leave" | "down" | "up"
  ) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const target = e.currentTarget;

    switch (phase) {
      case "enter":
        gsap.to(target, { scale: 1.1, duration: 0.1 });
        break;
      case "leave":
        gsap.to(target, { scale: 1, duration: 0.1 });
        break;
      case "down":
        gsap.to(target, { scale: 0.9, duration: 0.1 });
        break;
      case "up":
        gsap.to(target, { scale: 1.1, duration: 0.1 });
        break;
    }
  };

  if (isMobile) {
    return (
      <>
        {!isMinimized && (
          <div
            ref={windowRef}
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
                <button
                  onClick={() => handleButtonClick(handleMinimize)}
                  className="window-button"
                  onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                  onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                  onMouseDown={(e) => handleButtonAnimation(e, "down")}
                  onMouseUp={(e) => handleButtonAnimation(e, "up")}
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => handleButtonClick(handleClose)}
                  className="window-button window-button-close"
                  onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                  onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                  onMouseDown={(e) => handleButtonAnimation(e, "down")}
                  onMouseUp={(e) => handleButtonAnimation(e, "up")}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div
              ref={contentRef}
              className="window-content-mobile"
              data-width={contentWidth}
            >
              <React.Suspense fallback={<CuteSuspenseFallback />}>
                {isDragging
                  ? null
                  : React.Children.map(children, (child) =>
                      React.isValidElement(child)
                        ? React.cloneElement(child, {
                            windowWidth: contentWidth,
                          } as { windowWidth: number })
                        : child
                    )}
              </React.Suspense>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {!isMinimized && (
        <div
          ref={windowRef}
          className="absolute"
          style={{
            zIndex,
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            color: "var(--text-primary)",
          }}
        >
          {isMaximized ? (
            <div
              className="window-container maximized-window bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
              onClick={bringToFront}
            >
              <div className="window-drag-handle">
                <span className="font-semibold text-sm truncate">{title}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleButtonClick(handleMinimize)}
                    className="window-button"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => handleButtonClick(toggleMaximize)}
                    className="window-button"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    {isMaximized ? (
                      <Square size={14} />
                    ) : (
                      <Maximize size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => handleButtonClick(handleClose)}
                    className="window-button window-button-close"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div
                ref={contentRef}
                className="window-content"
                data-width={contentWidth}
              >
                <React.Suspense fallback={<CuteSuspenseFallback />}>
                  {React.Children.map(children, (child) =>
                    React.isValidElement(child)
                      ? React.cloneElement(child, {
                          windowWidth: contentWidth,
                        } as { windowWidth: number })
                      : child
                  )}
                </React.Suspense>
              </div>
            </div>
          ) : (
            <Rnd
              ref={rndRef}
              size={size}
              position={position}
              onDragStart={() => {
                bringToFront();
                setIsDragging(true);
              }}
              onDragStop={(e, d) => {
                setPosition({ x: d.x, y: d.y });
                setIsDragging(false);
              }}
              onResizeStart={() => {
                bringToFront();
                setIsDragging(true);
              }}
              onResizeStop={(e, direction, ref, delta, pos) => {
                setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                setPosition(pos);
                setIsDragging(false);
              }}
              dragHandleClassName="window-drag-handle"
              onClick={bringToFront}
              bounds="window"
              minWidth={350}
              minHeight={300}
              default={{
                x: position.x,
                y: position.y,
                width: size.width,
                height: size.height,
              }}
              className="window-container bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
            >
              <div className="window-drag-handle">
                <span className="font-semibold text-sm truncate">{title}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleButtonClick(handleMinimize)}
                    className="window-button"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => handleButtonClick(toggleMaximize)}
                    className="window-button"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    {isMaximized ? <Square size={14} /> : <Maximize size={14} />}
                  </button>
                  <button
                    onClick={() => handleButtonClick(handleClose)}
                    className="window-button window-button-close"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div
                ref={contentRef}
                className="window-content"
                data-width={contentWidth}
              >
                <React.Suspense fallback={<CuteSuspenseFallback />}>
                  {isDragging
                    ? null
                    : React.Children.map(children, (child) =>
                        React.isValidElement(child)
                          ? React.cloneElement(child, {
                              windowWidth: contentWidth,
                            } as { windowWidth: number })
                          : child
                      )}
                </React.Suspense>
              </div>
            </Rnd>
          )}
        </div>
      )}
    </>
  );
}
