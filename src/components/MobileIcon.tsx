import { useMediaQuery } from "@/hooks/use-media-query";
import { useDraggable } from "@dnd-kit/core";
import { motion, useReducedMotion } from "motion/react";

export function MobileIcon({
  id,
  label,
  icon,
  onClick,
}: {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 650px)");
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isMobile,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: prefersReducedMotion
      ? {}
      : { scale: 1.1, transition: { duration: 0.2 } },
    tap: prefersReducedMotion
      ? {}
      : { scale: 0.9, transition: { duration: 0.1 } },
  };

  const textVariants = {
    hover: prefersReducedMotion
      ? {}
      : {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          transition: { duration: 0.2 },
        },
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      className="desktop-icon flex flex-col items-center justify-center w-14 sm:w-18 md:w-20 cursor-pointer select-none transition-transform hover:scale-105"
    >
      <motion.div
        className="w-10 h-10 flex items-center justify-center"
        variants={iconVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
          delay: Math.random() * 0.2,
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
      <motion.span
        className="desktop-icon-text text-xs md:text-sm"
        variants={textVariants}
        whileHover="hover"
      >
        {label}
      </motion.span>
    </div>
  );
}
