"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin top progress bar tied to document scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.0008 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[150] h-[2px] origin-left bg-gradient-to-r from-accent via-white to-accent"
    />
  );
}
