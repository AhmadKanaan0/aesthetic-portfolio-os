import type React from "react";
import { useEffect, useRef, useState } from "react";

export function useResizeObserver(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

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

    const element = ref.current;
    observer.observe(element);

    return () => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
