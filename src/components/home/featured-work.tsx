"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { Tag } from "@/components/ui/badge";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SpotlightGroup } from "@/components/ui/spotlight";

function Row({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        ref={ref}
        href={`/projects/${project.slug}`}
        data-cursor="hover"
        data-cursor-label="View"
        className="group relative z-10 grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-7 transition-colors duration-500 hover:border-line-strong sm:gap-8"
      >
        <span className="font-mono text-[0.68rem] tracking-[0.14em] text-ink-faint">
          {project.index}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="display-tight text-[clamp(1.5rem,3.6vw,2.6rem)] text-white transition-colors duration-500">
              {project.title}
            </h3>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
              {project.category} · {project.year} · {project.role}
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-ink-dim">
            {project.summary}
          </p>

          <motion.div style={{ x }} className="mt-3.5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </motion.div>
        </div>

        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-dim transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black">
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        {/* accent underline wipe */}
        <span
          aria-hidden
          className="absolute bottom-[-1px] left-0 h-px w-0 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
          style={{ background: project.accent }}
        />
      </Link>
    </motion.div>
  );
}

export function FeaturedWork() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="relative w-full bg-void px-5 pb-20 pt-24 sm:px-8 md:pt-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal direction="up" duration={0.6}>
              <span className="eyebrow">Selected work</span>
            </Reveal>
            <h2 className="display-tight mt-4 text-[clamp(2rem,5vw,3.4rem)]">
              <TextReveal text="Things I have" by="word" className="text-white" />
              <span className="mt-1 block font-serif text-[1.06em] font-normal italic">
                <TextReveal text="actually built." by="word" delay={0.14} wordClassName="text-gradient" />
              </span>
            </h2>
          </div>
          <Reveal direction="up" delay={0.2}>
            <ArrowLink href="/projects">All projects</ArrowLink>
          </Reveal>
        </div>

        <SpotlightGroup className="mt-12" color="rgba(255,255,255,0.055)" size={520}>
          <div className="border-t border-line">
            {featured.map((p, i) => (
              <Row key={p.slug} project={p} index={i} />
            ))}
          </div>
        </SpotlightGroup>
      </div>
    </section>
  );
}
