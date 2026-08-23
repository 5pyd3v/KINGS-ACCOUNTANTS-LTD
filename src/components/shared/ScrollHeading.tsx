"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollHeadingProps {
  lines: string[];
  className?: string;
  as?: "h2" | "h3";
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Word-by-word masked reveal, triggered when the heading scrolls into view. */
export function ScrollHeading({ lines, className, as = "h2" }: ScrollHeadingProps) {
  const MotionTag = as === "h3" ? motion.h3 : motion.h2;

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
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
