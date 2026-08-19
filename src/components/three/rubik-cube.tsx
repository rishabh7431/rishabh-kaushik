"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

type Cubelet = { x: number; y: number; z: number };

const CUBELETS: Cubelet[] = [];
for (let x = -1; x <= 1; x += 1)
  for (let y = -1; y <= 1; y += 1)
    for (let z = -1; z <= 1; z += 1) {
      // Skip the invisible core.
      if (x === 0 && y === 0 && z === 0) continue;
      CUBELETS.push({ x, y, z });
    }

const FACES = [
  { key: "front", transform: "translateZ(var(--half))" },
  { key: "back", transform: "rotateY(180deg) translateZ(var(--half))" },
  { key: "right", transform: "rotateY(90deg) translateZ(var(--half))" },
  { key: "left", transform: "rotateY(-90deg) translateZ(var(--half))" },
  { key: "top", transform: "rotateX(90deg) translateZ(var(--half))" },
  { key: "bottom", transform: "rotateX(-90deg) translateZ(var(--half))" },
];

/**
 * A 27-piece cube built entirely from CSS 3D transforms — no WebGL, no runtime
 * geometry. Rotation is driven by scroll progress through the containing section,
 * with a continuous idle spin layered underneath so it never looks frozen.
 */
export function RubikCube({
  className,
  size = 128,
  gap = 2,
}: {
  className?: string;
  size?: number;
  gap?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scrollRotateY = useTransform(scrollYProgress, [0, 1], [0, 540]);
  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [-24, 26]);
  const scrollRotateZ = useTransform(scrollYProgress, [0, 1], [0, 42]);

  const cell = (size - gap * 2) / 3;

  return (
    <div
      ref={ref}
      className={cn("relative grid place-items-center", className)}
      style={{ perspective: 900, width: size * 1.9, height: size * 1.9 }}
    >
      {/* soft ground shadow */}
      <div
        aria-hidden
        className="absolute bottom-[18%] h-6 w-2/5 rounded-[50%] blur-xl"
        style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.65), transparent 70%)" }}
      />

      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          rotateX: reduced ? -24 : scrollRotateX,
          rotateY: reduced ? 32 : scrollRotateY,
          rotateZ: reduced ? 0 : scrollRotateZ,
          // @ts-expect-error custom property is valid in style
          "--half": `${cell / 2}px`,
        }}
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {CUBELETS.map(({ x, y, z }) => (
          <div
            key={`${x}${y}${z}`}
            className="absolute left-1/2 top-1/2"
            style={{
              width: cell,
              height: cell,
              marginLeft: -cell / 2,
              marginTop: -cell / 2,
              transformStyle: "preserve-3d",
              transform: `translate3d(${x * (cell + gap)}px, ${y * (cell + gap)}px, ${z * (cell + gap)}px)`,
            }}
          >
            {FACES.map((face) => (
              <span
                key={face.key}
                className="absolute inset-0 border border-black/25"
                style={{
                  transform: face.transform,
                  backfaceVisibility: "hidden",
                  background:
                    face.key === "top"
                      ? "linear-gradient(150deg,#ffffff,#dbe6f2)"
                      : face.key === "front"
                        ? "linear-gradient(160deg,#f4f7fb,#c4d3e6)"
                        : face.key === "right"
                          ? "linear-gradient(200deg,#dce7f4,#9fb4cc)"
                          : face.key === "left"
                            ? "linear-gradient(200deg,#c9d7e8,#8ba1bb)"
                            : face.key === "bottom"
                              ? "linear-gradient(160deg,#aebfd4,#7b8ea6)"
                              : "linear-gradient(160deg,#e6eef7,#b3c4d8)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
