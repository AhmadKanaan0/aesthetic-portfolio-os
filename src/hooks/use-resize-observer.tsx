import { useEffect, useRef, useState } from "react";

export function useResizeObserver(element: HTMLElement | null) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!element) return;

    // Read initial size immediately so layout is correct before any resize event fires
    setSize({ width: element.clientWidth, height: element.clientHeight });

    const observer = new ResizeObserver((entries) => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = window.requestAnimationFrame(() => {
        if (entries.length > 0 && entries[0]) {
          const { width, height } = entries[0].contentRect;
          setSize({ width, height });
        }
      });
    });

    observer.observe(element);

    return () => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      observer.disconnect();
    };
  }, [element]);

  return size;
}
