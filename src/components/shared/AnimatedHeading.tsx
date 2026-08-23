"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  lines: string[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
}

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { staggerChildren: 0.09, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AnimatedHeading({
  lines,
  className,
  delay = 0,
  as = "h1",
}: AnimatedHeadingProps) {
  const MotionTag = as === "h2" ? motion.h2 : motion.h1;

  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      variants={container}
      custom={delay}
      className={cn(className)}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-hidden pb-1">
          {line.split(" ").map((wordText, wordIndex) => (
            <motion.span
              key={wordIndex}
              variants={word}
              className="mr-[0.28em] inline-block will-change-transform"
            >
              {wordText}
            </motion.span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}
