"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Animated wiring diagram. Each source rail fires a packet that travels its own
 * path to the sink node; the stagger makes the whole thing read like traffic
 * rather than a synchronised loop.
 */
export function NodeGraph({
  sources,
  sink,
  className,
  accent = "#3b82f6",
}: {
  sources: readonly string[];
  sink: string;
  className?: string;
  accent?: string;
}) {
  const rows = sources.length;
  const height = rows * 52;
  const midY = height / 2;
  const sinkX = 260;

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <svg
        viewBox={`0 0 300 ${height}`}
        className="h-full w-full overflow-visible"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="wire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {sources.map((label, i) => {
          const y = 26 + i * 52;
          const path = `M 58 ${y} H 120 Q 150 ${y} 168 ${midY} H ${sinkX - 22}`;
          return (
            <g key={label}>
              <path d={path} fill="none" stroke="url(#wire)" strokeWidth="1" />
              <circle cx="58" cy={y} r="2.4" fill="rgba(255,255,255,0.45)" />
              <motion.circle
                r="2.8"
                fill={accent}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  delay: i * 0.65,
                  times: [0, 0.1, 0.85, 1],
                  ease: "linear",
                }}
                style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
              >
                <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${i * 0.65}s`} path={path} />
              </motion.circle>
            </g>
          );
        })}

        {/* sink */}
        <circle cx={sinkX - 18} cy={midY} r="3.4" fill={accent} />
        <circle cx={sinkX - 18} cy={midY} r="7" fill="none" stroke={accent} strokeOpacity="0.35">
          <animate attributeName="r" values="5;12;5" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* labels layered above the svg so they use real text rendering */}
      <div className="pointer-events-none absolute inset-0">
        {sources.map((label, i) => (
          <span
            key={label}
            className="absolute font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ink-faint"
            style={{ top: 26 + i * 52 - 6, left: 0 }}
          >
            {label}
          </span>
        ))}
        <span
          className="absolute font-mono text-[0.56rem] uppercase tracking-[0.16em]"
          style={{ top: midY - 6, left: sinkX - 6, color: accent }}
        >
          {sink}
        </span>
      </div>
    </div>
  );
}
