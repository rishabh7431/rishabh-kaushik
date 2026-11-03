"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { TiltCard } from "@/components/ui/tilt-card";

/** Copy on this section comes from the resume's professional summary. */
export function AboutGlance() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.5, 0.15]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-void px-5 pb-32 pt-20 sm:px-8">
      <motion.div
        aria-hidden
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute right-[-10%] top-1/4 size-[460px] rounded-full blur-[130px]"
      >
        <div className="size-full rounded-full bg-gradient-to-br from-[#ff4d94]/25 via-[#ff7a2f]/15 to-transparent" />
      </motion.div>

      <div className="mx-auto grid max-w-[1500px] items-start gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal direction="up" duration={0.7}>
            <span className="eyebrow">{site.aboutEyebrow}</span>
          </Reveal>

          <h2 className="display-tight mt-4 text-[clamp(2.1rem,5vw,3.6rem)]">
            <TextReveal text={site.aboutHeading} by="word" className="block text-white" />
            <span className="mt-1 block font-serif text-[1.1em] font-normal italic tracking-[-0.02em]">
              <TextReveal text={site.aboutAccent} by="word" delay={0.16} wordClassName="text-gradient" />
            </span>
          </h2>

          <div className="mt-7 flex max-w-xl flex-col gap-4 text-[0.96rem] leading-relaxed text-ink-dim">
            {site.aboutSummary.map((para, i) => {
              // The first paragraph opens with the name; bold it without
              // duplicating the sentence in two places.
              const [before, ...rest] = para.split(site.name);
              return (
                <Reveal key={i} direction="up" delay={0.1 + i * 0.06}>
                  <p>
                    {rest.length > 0 ? (
                      <>
                        {before}
                        <strong className="font-semibold text-white">{site.name}</strong>
                        {rest.join(site.name)}
                      </>
                    ) : (
                      para
                    )}
                  </p>
                </Reveal>
              );
            })}
          </div>

          <Reveal direction="up" delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={site.socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.8rem] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white"
              >
                <LinkedinIcon className="size-3.5" />
                LinkedIn
              </a>
              <a
                href={site.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.8rem] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white"
              >
                <GithubIcon className="size-3.5" />
                GitHub
              </a>
              <ArrowLink href={site.resumeUrl}>Résumé</ArrowLink>
              <ArrowLink href="/about" className="ml-1">
                Full story
              </ArrowLink>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.36}>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-7">
              {[
                { k: "Agile team led", v: "4 people" },
                { k: "Tasks tracked, 4 sprints", v: "150+" },
                { k: "Services + gateway", v: "8 + 1" },
              ].map((stat) => (
                <div key={stat.k}>
                  <dd className="display-tight text-[1.7rem] text-white">{stat.v}</dd>
                  <dt className="mt-1 font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.14em] text-ink-faint">
                    {stat.k}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal direction="left" delay={0.12} duration={1}>
          <motion.div style={{ y: imageY }}>
            <TiltCard intensity={7} glowColor="rgba(255,255,255,0.12)">
              <div className="card-surface aspect-4/5 w-full">
                <Image
                  src={site.avatar}
                  alt={`${site.name}, ${site.role.toLowerCase()} based in ${site.location.city}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 560px, 620px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-5">
                  <div>
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/70">
                      {site.role} · {site.location.city}, {site.location.region}
                    </p>
                    <p className="mt-1 font-serif text-xl italic text-white">{site.name}</p>
                  </div>
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-accent">
                    2026
                  </span>
                </div>
              </div>
            </TiltCard>

            <p className="mt-6 max-w-md font-serif text-[1.15rem] italic leading-snug text-white/75">
              &ldquo;I like the problems that sit under the interface — the architecture, the data
              flow and the failure modes. Then I make sure the thing actually ships.&rdquo;
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
