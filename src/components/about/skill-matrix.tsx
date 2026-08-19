"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Tabs } from "@/components/ui/tabs";

/**
 * The resume's Technical Skills block, verbatim. No proficiency scores —
 * the resume does not claim any, so neither does this page.
 */
const GROUPS = [
  {
    id: "languages",
    label: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "SQL", "HTML", "CSS"],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    skills: ["React", "Next.js", "Vite", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    id: "data",
    label: "Data & Services",
    skills: ["Azure SQL", "PostgreSQL", "Azure Blob Storage", "Supabase", "Stripe", "Resend"],
  },
  {
    id: "tools",
    label: "Tools",
    skills: ["Microsoft Azure", "Azure Container Apps", "Git", "GitHub", "CI/CD", "Jira", "Monday.com"],
  },
  {
    id: "ai",
    label: "AI-Assisted",
    skills: ["GitHub Copilot", "Cursor", "Claude", "ChatGPT"],
  },
] as const;

const CONCEPTS = [
  "Microsoft Azure",
  "REST APIs",
  "Relational databases",
  "Requirements to software",
  "Automated testing and QA",
  "Version control (Git)",
  "As-built and technical documentation",
  "Microsoft Copilot and AI tools",
  "Agile delivery",
];

export function SkillMatrix() {
  const [tab, setTab] = useState<string>(GROUPS[0].id);
  const group = GROUPS.find((g) => g.id === tab) ?? GROUPS[0];

  return (
    <section className="w-full bg-abyss px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal direction="up">
              <span className="eyebrow">Technical skills</span>
            </Reveal>
            <h2 className="display-tight mt-4 text-[clamp(1.8rem,4.4vw,3rem)] text-white">
              What I work in
            </h2>
          </div>
          <Reveal direction="up" delay={0.1}>
            <Tabs
              items={GROUPS.map((g) => ({ id: g.id, label: g.label }))}
              value={tab}
              onChange={setTab}
              layoutId="skill-tab"
              size="md"
            />
          </Reveal>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {group.skills.map((s, i) => (
            <motion.span
              key={`${group.id}-${s}`}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-full border border-line bg-white/[0.03] px-5 py-2.5 text-[0.95rem] text-white/90 transition-colors duration-300 hover:border-line-strong hover:text-white"
            >
              {s}
            </motion.span>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <Reveal direction="up">
            <span className="eyebrow">Concepts</span>
          </Reveal>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {CONCEPTS.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 text-[0.92rem] text-ink-dim"
              >
                <span className="size-1 rounded-full bg-accent" />
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
