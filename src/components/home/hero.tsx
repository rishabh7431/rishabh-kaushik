"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Layers, Mail, MapPin, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { StarField } from "@/components/ui/starfield";
import { TextRevealOnMount } from "@/components/ui/text-reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { LinkedinIcon } from "@/components/ui/social-icons";

/**
 * Hero with three parallax planes driven by scroll progress: the ghost wordmark
 * behind, the name in front, and the corner meta rails which drift the least.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const subY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const railY = useTransform(scrollYProgress, [0, 1], ["0%", "160%"]);

  return (
    <section
      ref={ref}
      className="relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-void"
    >
      <StarField className="z-0" />

      {/* radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, rgba(255,255,255,0.045) 0%, rgba(0,0,0,0) 55%), radial-gradient(80% 60% at 50% 120%, rgba(36,209,126,0.08) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Ghost wordmark */}
      <motion.span
        aria-hidden
        style={{ y: ghostY, opacity: fade }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[26vw] font-bold leading-none tracking-[-0.05em] text-white/[0.022] md:block"
      >
        {site.lastName.toUpperCase()}
      </motion.span>

      {/* Top status pill */}
      <div className="relative z-10 flex justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: -14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: fade }}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.045] px-4 py-2 backdrop-blur-xl">
            <span className="relative inline-flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-accent" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
            </span>
            <span className="text-[0.78rem] font-medium text-white">Open to developer roles</span>
            <Sparkles className="size-3.5 text-accent" />
          </span>
        </motion.div>
      </div>

      {/* Centre stack */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
        <motion.h1
          style={{ y: nameY, scale: nameScale, opacity: fade }}
          className="display-tight text-center text-[clamp(3.6rem,17vw,15rem)] leading-[0.82] text-white"
        >
          <TextRevealOnMount text={site.firstName.toUpperCase()} delay={1.5} stagger={0.055} />
        </motion.h1>

        <motion.div
          style={{ y: subY, opacity: fade }}
          className="mt-6 flex flex-col items-center gap-1 text-center sm:mt-8"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(0.72rem,1.7vw,1.05rem)] font-medium uppercase tracking-[0.34em] text-ink-faint"
          >
            {site.heroLineOne}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.15, delay: 2.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(2rem,6.2vw,4.4rem)] italic leading-[1.05] tracking-[-0.02em] text-white"
          >
            {site.heroLineTwo}
          </motion.p>

          {/* Two calls to action: write to me, or check me out. */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex w-full max-w-[17.5rem] flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
          >
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a
                href={`mailto:${site.email}`}
                className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-7 text-[0.9rem] font-medium text-black sm:w-auto"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <Mail className="relative z-10 size-4" />
                <span className="relative z-10">Email Me</span>
              </a>
            </Magnetic>

            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a
                href={site.socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line-strong bg-white/[0.045] px-7 text-[0.9rem] font-medium text-white backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.1] sm:w-auto"
              >
                <LinkedinIcon className="size-4" />
                <span>Connect on LinkedIn</span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom rails */}
      <motion.div
        style={{ y: railY, opacity: fade }}
        className="relative z-10 flex items-end justify-between px-6 pb-14 sm:px-10"
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2"
        >
          <MapPin className="size-4 text-ink-faint" />
          <div className="leading-tight">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white sm:text-[0.8rem]">
              Based in {site.location.city},
            </p>
            <p className="text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint sm:text-[0.8rem]">
              {site.location.country}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-end gap-2 text-right"
        >
          <Layers className="size-4 text-node" />
          <div className="leading-tight">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white sm:text-[0.8rem]">
              {site.role}
            </p>
            <p className="text-[0.72rem] uppercase tracking-[0.12em] text-node/85 sm:text-[0.8rem]">
              {site.roleSecondary}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        style={{ opacity: fade }}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="flex h-9 w-[22px] items-start justify-center rounded-full border border-line p-1"
        >
          <motion.span
            className="size-1 rounded-full bg-white/70"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
