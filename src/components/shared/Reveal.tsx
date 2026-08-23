"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

const variants: Variants = {
  hidden: (custom: { y: number }) => ({ opacity: 0, y: custom.y }),
  visible: (custom: { delay: number }) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom.delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      custom={{ delay, y }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
