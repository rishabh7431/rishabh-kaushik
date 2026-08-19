"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * 3D tilt with a cursor-tracking specular highlight. Both effects share the same
 * pointer handler so there is a single layout read per move event.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
  glow = true,
  glowColor = "rgba(255,255,255,0.09)",
  scaleOnHover = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
  glowColor?: string;
  scaleOnHover?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(1);

  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const sscale = useSpring(scale, { stiffness: 200, damping: 22 });
  const sopacity = useSpring(opacity, { stiffness: 120, damping: 20 });

  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const disabled = isTouch || reduced;

  const background = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, ${glowColor}, transparent 65%)`;

  function onMove(e: React.PointerEvent) {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set(-(py - 0.5) * intensity * 2);
    mx.set(px * 100);
    my.set(py * 100);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => {
        if (disabled) return;
        opacity.set(1);
        scale.set(scaleOnHover);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        opacity.set(0);
        scale.set(1);
      }}
      style={{
        rotateX: srx,
        rotateY: sry,
        scale: sscale,
        transformStyle: "preserve-3d",
        transformPerspective: 1100,
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glow && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background, opacity: sopacity }}
        />
      )}
    </motion.div>
  );
}
