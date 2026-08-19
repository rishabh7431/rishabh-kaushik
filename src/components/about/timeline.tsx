"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/badge";

/** Straight from the resume: Professional Experience, Education, Professional Development. */
const ENTRIES = [
  {
    period: "2026",
    role: "Full Stack Developer & Project Manager",
    org: "GBTAC, Calgary, AB",
    kind: "Experience",
    bullets: [
      "Led project management for a 4-person Agile team delivering a public web platform for GBTAC researchers, planning and tracking 150+ tasks across four sprints in Jira and owning the team's programming plan and testing strategy.",
      "Developed both ends of a TypeScript microservices application (8 services plus an API gateway) on Microsoft Azure: a React and Vite front-end and Node.js and Express back-end services, backed by Azure SQL, Blob Storage and Container Apps.",
      "Led AI integration for the platform alongside a backend teammate, embedding AI-powered functionality into the researcher-facing experience.",
      "Built an ingestion pipeline that cleaned, normalized and loaded the Retrofit Canada case-study dataset into the cloud database, and created interactive visualizations including a choropleth map, EUI comparison charts and province-level analytics.",
      "Delivered against performance targets (sub-3-second load, sub-500ms filters) with a three-tier test suite (Vitest, Supertest, Playwright) and CI/CD for build, test and deploy.",
    ],
    tags: ["TypeScript", "React", "Vite", "Node.js", "Express", "Azure", "Playwright", "CI/CD"],
  },
  {
    period: "2021 to 2024",
    role: "Marketing Manager",
    org: "Change Your Results Inc., Calgary, AB",
    kind: "Experience",
    bullets: [
      "Architected and deployed end-to-end marketing automation systems, integrating CRM, email and scheduling tools to eliminate manual outreach and streamline campaign workflows.",
      "Designed and launched multi-channel lead intake funnels with conditional logic and automated routing, capturing and qualifying prospects at scale.",
      "Rebuilt client onboarding workflows to improve time-to-activation, mapping dependencies, removing friction points and standardizing repeatable processes.",
      "Managed digital advertising campaigns across Google and social platforms, and partnered with senior leadership to align technical workflows with business growth targets.",
    ],
    tags: ["Automation", "CRM", "Workflow design", "Client-facing"],
  },
  {
    period: "May 2025 to August 2026",
    role: "Diploma in Software Development",
    org: "SAIT, Calgary, AB",
    kind: "Education",
    bullets: [
      "Relevant coursework: web development, object-oriented programming, database design, software engineering fundamentals and agile development practices.",
    ],
    tags: ["Web development", "OOP", "Database design", "Agile"],
  },
  {
    period: "July 2026",
    role: "IBM Bob Developer Day",
    org: "Calgary, AB",
    kind: "Professional Development",
    bullets: [
      "Hands-on IBM developer event on Bob, IBM's AI coding agent, and building software faster with agentic, AI-assisted development tools.",
    ],
    tags: ["Agentic tooling", "AI-assisted development"],
  },
];

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const height = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 90,
    damping: 26,
  });

  return (
    <section className="w-full bg-void px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <Reveal direction="up">
          <span className="eyebrow">Experience, education, development</span>
        </Reveal>
        <h2 className="display-tight mt-4 text-[clamp(1.8rem,4.4vw,3rem)] text-white">
          The record
        </h2>

        <div ref={ref} className="relative mt-14 pl-8 sm:pl-12">
          <div className="absolute left-[3px] top-1 h-full w-px bg-line sm:left-[7px]" />
          <motion.div
            className="absolute left-[3px] top-1 w-px origin-top bg-gradient-to-b from-accent via-accent/60 to-transparent sm:left-[7px]"
            style={{ height }}
          />

          <div className="flex flex-col gap-14">
            {ENTRIES.map((e, i) => (
              <motion.div
                key={`${e.role}-${e.period}`}
                initial={{ opacity: 0, x: 26, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span className="absolute -left-8 top-1.5 grid size-[9px] place-items-center sm:-left-12">
                  <span className="size-[9px] rounded-full border border-accent bg-void" />
                </span>

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                    {e.period}
                  </p>
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ink-faint">
                    {e.kind}
                  </span>
                </div>

                <h3 className="display-tight mt-2 text-[1.45rem] leading-tight text-white">
                  {e.role}
                </h3>
                <p className="mt-1 font-serif text-[1.05rem] italic text-ink-faint">{e.org}</p>

                <ul className="mt-4 flex max-w-3xl flex-col gap-2.5">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[0.94rem] leading-relaxed text-ink-dim">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/60" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
