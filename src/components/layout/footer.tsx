"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { footerNav, site } from "@/data/site";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { Reveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { Magnetic } from "@/components/ui/magnetic";
import { getLenis } from "./smooth-scroll";
import { useLocalTime } from "@/hooks/use-local-time";

const SOCIALS = [
  { label: "LinkedIn", url: site.socials.linkedin.url, Icon: LinkedinIcon },
  { label: "GitHub", url: site.socials.github.url, Icon: GithubIcon },
  { label: "Email", url: `mailto:${site.email}`, Icon: Mail },
];

export function Footer() {
  const time = useLocalTime(site.location.timezone);

  function toTop() {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative w-full overflow-hidden border-t border-line bg-abyss pb-8 pt-14">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,minmax(0,0.8fr))]">
          {/* Brand column */}
          <Reveal direction="up">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="font-serif text-3xl italic leading-none text-white">{site.initials}</span>
                <span className="flex flex-col leading-none">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-white">
                    {site.name}
                  </span>
                  <span className="mt-0.5 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-accent">
                    {site.tagline}
                  </span>
                </span>
              </Link>

              <p className="max-w-sm text-[0.9rem] leading-relaxed text-ink-faint">
                {site.footerNote}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="font-mono text-[0.74rem] text-ink-dim transition-colors hover:text-white"
              >
                {site.email}
              </a>

              <div className="mt-1 flex items-center gap-2">
                {SOCIALS.map(({ label, url, Icon }) => (
                  <Magnetic key={label} strength={0.3}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid size-9 place-items-center rounded-full border border-line text-ink-faint transition-colors duration-300 hover:border-line-strong hover:text-white"
                    >
                      <Icon className="size-[15px]" />
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Link columns */}
          {Object.entries(footerNav).map(([heading, items], gi) => (
            <Reveal key={heading} direction="up" delay={0.08 + gi * 0.07}>
              <div className="flex flex-col gap-3.5">
                <h3 className="eyebrow">{heading}</h3>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 text-[0.9rem] text-ink-dim transition-colors duration-300 hover:text-white"
                      >
                        <span className="h-px w-0 bg-accent transition-[width] duration-400 group-hover:w-3" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Wordmark ribbon — breaks out of the padded container so it runs
            edge to edge, and loops right to left without ever stopping. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 -mx-5 select-none sm:-mx-8"
          aria-hidden
        >
          <Marquee speed={46} pauseOnHover={false} fade>
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex items-center">
                <span className="display-tight whitespace-nowrap px-8 text-[clamp(3.2rem,12vw,11rem)] leading-[0.85] text-white/[0.085]">
                  {site.name.toUpperCase()}
                </span>
                <span className="text-[clamp(1rem,3vw,2.4rem)] text-accent/25">✦</span>
              </span>
            ))}
          </Marquee>
        </motion.div>

        {/* The name is decorative above, so it stays available to screen readers here. */}
        <span className="sr-only">{site.name}</span>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-5 border-t border-line pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <span className="hidden sm:inline">·</span>
            <span className="italic">{site.footerTagline}</span>
            {time && (
              <>
                <span className="hidden sm:inline">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative inline-flex size-1.5">
                    <span className="absolute inset-0 rounded-full bg-accent" />
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
                  </span>
                  {site.location.city} · {time}
                </span>
              </>
            )}
          </div>

          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={toTop}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white"
            >
              Back to top
              <ArrowUp className="size-3.5 transition-transform duration-400 group-hover:-translate-y-0.5" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
