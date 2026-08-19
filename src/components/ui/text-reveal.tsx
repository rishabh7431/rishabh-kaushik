"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

/**
 * Mask-clipped rise reveal. Each unit sits inside an overflow-hidden wrapper and
 * slides up from below the mask line, which reads much cleaner than a plain fade.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  by = "word",
  delay = 0,
  stagger = 0.055,
  duration = 0.9,
  once = true,
  as: Tag = "span",
}: Props) {
  const units = by === "word" ? text.split(" ") : Array.from(text);

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          aria-hidden
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ y: "115%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once, amount: 0.5 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {unit === " " ? " " : unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Character reveal that animates on mount rather than on scroll (hero use). */
export function TextRevealOnMount({
  text,
  className,
  charClassName,
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
          aria-hidden
        >
          <motion.span
            className={cn("inline-block", charClassName)}
            initial={{ y: "120%", opacity: 0, rotate: 6 }}
            animate={{ y: "0%", opacity: 1, rotate: 0 }}
            transition={{ duration: 1.05, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
