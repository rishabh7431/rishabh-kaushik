"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowUpRight, GitBranch, GraduationCap } from "lucide-react";
import { projectCategories, projects, type Project } from "@/data/projects";
import { FilterTabs } from "@/components/ui/tabs";
import { TiltCard } from "@/components/ui/tilt-card";
import { Badge, Tag } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

function StatusDot({ status }: { status: Project["status"] }) {
  const color = status === "Delivered" ? "#24d17e" : "#3b82f6";
  return (
    <Badge dot dotColor={color} pulse={status === "Delivered"}>
      {status}
    </Badge>
  );
}

function Card({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, scale: 0.97, filter: "blur(8px)" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard intensity={5} glowColor={`${project.accent}22`} className="h-full">
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="hover"
          data-cursor-label="Open"
          className="card-surface grain group flex h-full flex-col p-7"
        >
          {/* accent bar */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
          />

          <div className="flex items-start justify-between gap-4">
            <span className="font-mono text-[0.68rem] tracking-[0.16em] text-ink-faint">
              {project.index}
            </span>
            <StatusDot status={project.status} />
          </div>

          <h3 className="display-tight mt-6 text-[1.9rem] leading-none text-white">
            {project.title}
          </h3>
          <p className="mt-1.5 font-serif text-[1.05rem] italic text-ink-faint">
            {project.subtitle}
          </p>
          <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint">
            {project.category} · {project.year} · {project.role}
          </p>

          <p className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-ink-dim">
            {project.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
            {project.stack.length > 4 && (
              <Tag className="text-ink-faint">+{project.stack.length - 4}</Tag>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">
              {project.repo ? (
                <>
                  <GitBranch className="size-3" /> Repository
                </>
              ) : (
                <>
                  <GraduationCap className="size-3" /> {project.team}
                </>
              )}
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-line text-ink-dim transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black">
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}

export function ProjectGrid() {
  const [filter, setFilter] = useState("ALL");

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? projects
        : projects.filter((p) => p.category.toUpperCase() === filter),
    [filter],
  );

  return (
    <section className="w-full bg-void px-5 pb-28 pt-4 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <Reveal direction="up">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <FilterTabs items={projectCategories} value={filter} onChange={setFilter} />
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
              {visible.length} {visible.length === 1 ? "project" : "projects"}
            </p>
          </div>
        </Reveal>

        <motion.div layout className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <Card key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="mt-16 text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
            Nothing filed under {filter} yet.
          </p>
        )}
      </div>
    </section>
  );
}
