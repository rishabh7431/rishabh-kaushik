"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { StarField } from "@/components/ui/starfield";
import { TextReveal } from "@/components/ui/text-reveal";
import { Reveal } from "@/components/ui/reveal";

/**
 * Shared sub-page hero: eyebrow, split display/serif headline, description and an
 * optional slot for controls. Parallaxes on scroll like the home hero, at half the
 * amplitude so it feels related but not repetitive.
 */
export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  children,
  ghost,
  compact = false,
  width = "wide",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children?: ReactNode;
  ghost?: string;
  compact?: boolean;
  /** "prose" matches the narrow reading column used by articles and legal pages. */
  width?: "wide" | "prose";
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <section
      ref={ref}
      className={`relative flex w-full flex-col justify-end overflow-hidden bg-void px-5 sm:px-8 ${
        compact ? "min-h-[58svh] pb-16 pt-36" : "min-h-[76svh] pb-20 pt-40"
      }`}
    >
      <StarField density={0.00011} parallax={18} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 20% 0%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 60%), radial-gradient(70% 60% at 90% 100%, rgba(36,209,126,0.07) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {ghost && (
        <motion.span
          aria-hidden
          style={{
            y: ghostY,
            maskImage: "linear-gradient(to bottom, #000 0%, #000 45%, transparent 82%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 45%, transparent 82%)",
          }}
          className="pointer-events-none absolute right-[-3vw] top-[16%] hidden select-none whitespace-nowrap font-display text-[20vw] font-bold leading-none tracking-[-0.05em] text-white/[0.07] sm:block"
        >
          {ghost}
        </motion.span>
      )}

      <motion.div
        style={{ y, opacity }}
        className={`relative z-10 mx-auto w-full ${width === "prose" ? "max-w-3xl" : "max-w-[1500px]"}`}
      >
        <Reveal direction="up" duration={0.6}>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>

        <h1
          className={`display-tight mt-5 ${
            width === "prose"
              ? "text-[clamp(2rem,5.4vw,3.6rem)]"
              : "text-[clamp(2.6rem,8vw,6.4rem)]"
          }`}
        >
          <TextReveal text={title} by="word" className="block text-white" />
          {accent && (
            <span className="mt-1 block font-serif text-[0.84em] font-normal italic tracking-[-0.02em]">
              <TextReveal text={accent} by="word" delay={0.15} wordClassName="text-gradient" />
            </span>
          )}
        </h1>

        {description && (
          <Reveal direction="up" delay={0.22}>
            <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink-dim">{description}</p>
          </Reveal>
        )}

        {children && (
          <Reveal direction="up" delay={0.3}>
            <div className="mt-8">{children}</div>
          </Reveal>
        )}
      </motion.div>
    </section>
  );
}
