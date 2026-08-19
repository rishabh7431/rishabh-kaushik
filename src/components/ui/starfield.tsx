"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  base: number;
  twinkle: number;
  phase: number;
};

/**
 * Canvas starfield with three parallax depth planes. Stars drift slowly, twinkle on
 * independent sine phases, and the whole field offsets against pointer position and
 * scroll — which is what gives the hero its sense of depth.
 */
export function StarField({
  className,
  density = 0.00016,
  parallax = 26,
  color = "255,255,255",
}: {
  className?: string;
  density?: number;
  parallax?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let t = 0;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let scrollOffset = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = dpr();
      canvas!.width = Math.floor(width * ratio);
      canvas!.height = Math.floor(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.round(width * height * density);
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.35 + z * 1.15,
          base: 0.14 + z * 0.5,
          twinkle: 0.25 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
        };
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      eased.x += (pointer.x - eased.x) * 0.045;
      eased.y += (pointer.y - eased.y) * 0.045;

      for (const s of stars) {
        const depth = 0.35 + s.z;
        const ox = eased.x * parallax * depth;
        const oy = eased.y * parallax * depth - scrollOffset * depth * 0.06;

        let x = (s.x + ox + t * (0.06 + s.z * 0.1)) % width;
        if (x < 0) x += width;
        let y = (s.y + oy) % height;
        if (y < 0) y += height;

        const alpha = s.base + Math.sin(t * 0.02 * s.twinkle + s.phase) * 0.22;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${color},${Math.max(0.03, alpha)})`;
        ctx!.arc(x, y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      t += 1;
      raf = requestAnimationFrame(draw);
    }

    function onPointer(e: PointerEvent) {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    }

    function onScroll() {
      scrollOffset = window.scrollY;
    }

    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    build();

    if (reduced) {
      // Draw a single static frame.
      for (const s of stars) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${s.base})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      raf = requestAnimationFrame(draw);
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [density, parallax, color, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
