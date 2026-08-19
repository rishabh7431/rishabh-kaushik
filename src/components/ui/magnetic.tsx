"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Pulls its children toward the pointer while hovered, then springs back.
 * `strength` is the fraction of the pointer offset that is applied.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  radiusPadding = 24,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radiusPadding?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const disabled = isTouch || reduced;

  function onMove(e: React.PointerEvent) {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = Math.max(rect.width, rect.height) / 2 + radiusPadding;
    const dist = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - dist / (max * 2));
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
