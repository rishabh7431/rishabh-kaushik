import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { GithubSection } from "@/components/widgets/github-section";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { ArrowLink } from "@/components/ui/arrow-link";
import { GithubIcon } from "@/components/ui/social-icons";
import { Timeline } from "@/components/about/timeline";
import { SkillMatrix } from "@/components/about/skill-matrix";
import { Marquee } from "@/components/ui/marquee";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Rishabh Kaushik — recent software development graduate (SAIT, August 2026) with hands-on experience building applications on Microsoft Azure in an Agile team.",
  path: "/about",
  image: "/og/og-about.png",
  type: "profile",
});

/** Paragraphs below are the resume's professional summary, split for reading. */
const SUMMARY = [
  "Recent software development graduate (SAIT, August 2026) with hands-on experience building applications on Microsoft Azure.",
  "I turn business requirements into working software in an Agile team, work in TypeScript, JavaScript and Python with SQL databases and REST APIs, use Git, and write clear documentation as I go.",
  "What sets me apart is real end-to-end delivery, leading a four-person Agile team, and three years of prior client-facing business experience, plus daily use of Microsoft Copilot and other AI tools.",
  "I am eager to grow as a developer on the Microsoft cloud stack, including the Power Platform and SharePoint, learning from experienced consultants and architects.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Software Developer · Calgary, AB"
        title="WHO I"
        accent="really am."
        ghost="ABOUT"
        description="Recent SAIT graduate. Backend and front-end, delivered end to end on Microsoft Azure, in an Agile team."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={site.socials.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.8rem] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white"
          >
            <GithubIcon className="size-3.5" />
            GitHub
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[0.74rem] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white"
          >
            {site.email}
          </a>
          <ArrowLink href={site.resumeUrl}>Résumé (PDF)</ArrowLink>
        </div>
      </PageHeader>

      {/* Professional summary */}
      <section className="w-full bg-void px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-5 text-[1rem] leading-relaxed text-ink-dim">
            <Reveal direction="up">
              <span className="eyebrow">Professional summary</span>
            </Reveal>
            {SUMMARY.map((para, i) => (
              <Reveal key={i} direction="up" delay={0.05 + i * 0.05}>
                <p className={i === 0 ? "font-serif text-[1.45rem] italic leading-snug text-white" : undefined}>
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal direction="left" delay={0.1} duration={1}>
            <TiltCard intensity={6} glowColor="rgba(255,255,255,0.1)">
              <div className="card-surface aspect-4/5 w-full">
                <Image
                  src={site.avatar}
                  alt={site.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/70">
                    {site.location.city}, {site.location.region}
                  </p>
                  <p className="mt-1 font-serif text-2xl italic text-white">{site.name}</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="w-full overflow-hidden border-y border-line bg-abyss py-6">
        <Marquee speed={42}>
          {["TYPESCRIPT", "MICROSOFT AZURE", "REST APIs", "AGILE DELIVERY", "AUTOMATED TESTING"].map((w) => (
            <span key={w} className="flex items-center">
              <span className="px-7 font-display text-[clamp(1rem,2.2vw,1.6rem)] uppercase text-white/80">
                {w}
              </span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      <SkillMatrix />
      <Timeline />
      <GithubSection />
    </>
  );
}
