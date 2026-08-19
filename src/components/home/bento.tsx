"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Cloud, Code2, Mail, MapPin, Send, Sparkles, Users } from "lucide-react";
import { contactHref, isBookingConfigured, site, workspaceTabs } from "@/data/site";
import { RubikCube } from "@/components/three/rubik-cube";
import { NodeGraph } from "./node-graph";
import { Tabs } from "@/components/ui/tabs";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Magnetic } from "@/components/ui/magnetic";
import { TiltCard } from "@/components/ui/tilt-card";
import { useLocalTime } from "@/hooks/use-local-time";
import { useCopy } from "@/hooks/use-copy";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const ICONS = {
  sparkles: <Sparkles className="size-3" />,
  code: <Code2 className="size-3" />,
  cloud: <Cloud className="size-3" />,
  users: <Users className="size-3" />,
} as const;

export function BentoGrid() {
  const [tab, setTab] = useState<string>(workspaceTabs[0].id);
  const activeTab = workspaceTabs.find((t) => t.id === tab) ?? workspaceTabs[0];
  const time = useLocalTime(site.location.timezone);
  const { copied, copy } = useCopy();
  const { push } = useToast();

  async function copyEmail() {
    const ok = await copy(site.email);
    push({
      title: ok ? "Email copied to clipboard" : "Could not copy",
      description: ok ? site.email : "Select and copy it manually instead.",
      variant: ok ? "success" : "error",
    });
  }

  return (
    <section className="relative w-full bg-void px-5 pb-24 pt-4 sm:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-4 lg:grid-cols-[0.85fr_1.5fr_1fr]">
        {/* ── Profile card ─────────────────────────────── */}
        <Reveal direction="up" duration={0.9}>
          <TiltCard intensity={5} className="h-full">
            <div className="card-surface grain flex h-full min-h-[520px] flex-col justify-between p-7">
              <div>
                <h2 className="display-tight text-[2.1rem] leading-[0.95] text-white">
                  {site.firstName}
                  <span className="mt-0.5 block font-serif text-[1.15em] font-normal italic text-white/35">
                    {site.lastName}
                  </span>
                </h2>

                <div className="mt-4 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-dim">
                  <MapPin className="size-3" />
                  {site.location.city}, {site.location.region}
                  {time && <span className="text-ink-faint">· {time}</span>}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center">
                <RubikCube size={120} />
              </div>

              <dl className="grid grid-cols-2 gap-3 border-t border-line pt-5">
                {[
                  { k: "Role", v: "Software Developer" },
                  { k: "Stack", v: "TS · React · Azure" },
                  { k: "Education", v: "SAIT, Aug 2026" },
                  { k: "Status", v: "Open to work" },
                ].map((row) => (
                  <div key={row.k}>
                    <dt className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ink-faint">
                      {row.k}
                    </dt>
                    <dd className="mt-1 text-[0.8rem] text-white/85">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TiltCard>
        </Reveal>

        {/* ── Workspace card ───────────────────────────── */}
        <Reveal direction="up" delay={0.1} duration={0.9}>
          <div className="card-surface grain flex h-full min-h-[520px] flex-col p-7">
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-dim">
                {site.firstName.toUpperCase()} OS <span className="text-ink-faint">/ WORKSPACE</span>
              </p>
              <Badge dot dotColor="#24d17e" pulse className="border-accent/25 bg-accent/8 text-accent">
                Online
              </Badge>
            </div>

            <Tabs
              className="mt-5"
              items={workspaceTabs.map((t) => ({
                id: t.id,
                label: t.label,
                icon: ICONS[t.icon as keyof typeof ICONS],
              }))}
              value={tab}
              onChange={setTab}
              layoutId="workspace-tab"
            />

            {/* loader bar that replays on each tab change */}
            <div className="mt-4 h-1 w-full max-w-[240px] overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                key={tab}
                className="h-full rounded-full bg-gradient-to-r from-node to-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="mt-6 grid flex-1 gap-8 md:grid-cols-[1fr_1.05fr]">
              <motion.div
                key={`${tab}-list`}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                <p className="eyebrow">{activeTab.heading}</p>
                <ul className="mt-3.5 flex flex-col gap-2.5">
                  {activeTab.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-2.5 text-[0.9rem] text-white/88"
                    >
                      <span className="size-1 shrink-0 rounded-full bg-node" />
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="eyebrow">Current Focus</p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {activeTab.focus.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.28 + i * 0.06, duration: 0.45 }}
                        className="flex items-center gap-2 text-[0.82rem] text-ink-dim"
                      >
                        <span className="text-ink-faint">·</span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <div className="flex items-center justify-center">
                <NodeGraph
                  key={`${tab}-graph`}
                  sources={activeTab.graph.left}
                  sink={activeTab.graph.right}
                  accent={tab === "build" ? "#24d17e" : tab === "cloud" ? "#3b82f6" : tab === "ai" ? "#a855f7" : "#f59e0b"}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Contact card ─────────────────────────────── */}
        <Reveal direction="up" delay={0.2} duration={0.9}>
          <div
            id="contact"
            className="card-surface grain flex h-full min-h-[520px] flex-col justify-between gap-7 p-7"
          >
            <div>
              <Badge dot dotColor="#24d17e" pulse className="border-transparent bg-transparent px-0 text-accent">
                Available for work
              </Badge>

              <h2 className="display-tight mt-4 text-[2rem] leading-[0.95] text-white">
                {site.ctaHeading}
                <span className="mt-1 block font-serif text-[1.05em] font-normal italic text-white/70">
                  {site.ctaAccent}
                </span>
              </h2>

              <p className="mt-5 text-[0.92rem] leading-relaxed text-ink-dim">
                Recent software development graduate, eager to grow on the Microsoft cloud stack —
                including the Power Platform and SharePoint — learning from experienced consultants
                and architects.
              </p>

              <dl className="mt-6 flex flex-col gap-3 border-t border-line pt-5">
                {[
                  { k: "Based in", v: `${site.location.city}, ${site.location.region}` },
                  { k: "Graduated", v: "SAIT, August 2026" },
                  { k: "Looking for", v: "Developer roles" },
                ].map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-3">
                    <dt className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ink-faint">
                      {row.k}
                    </dt>
                    <dd className="text-[0.85rem] text-white/85">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={copyEmail}
                data-cursor="hover"
                data-cursor-label={copied ? "Copied" : "Copy"}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-3.5 text-left transition-colors duration-300 hover:border-line-strong"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04] text-ink-dim transition-colors group-hover:text-white">
                  <Mail className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[0.74rem] text-white">{site.email}</span>
                  <span
                    className={cn(
                      "mt-0.5 block font-mono text-[0.55rem] uppercase tracking-[0.16em] transition-colors",
                      copied ? "text-accent" : "text-ink-faint",
                    )}
                  >
                    {copied ? "Copied to clipboard" : "Tap to copy email"}
                  </span>
                </span>
              </button>

              <Magnetic strength={0.16}>
                <a
                  href={contactHref()}
                  target={isBookingConfigured() ? "_blank" : undefined}
                  rel={isBookingConfigured() ? "noopener noreferrer" : undefined}
                  className="group relative flex h-12 w-full items-center justify-center gap-1.5 overflow-hidden rounded-full bg-white text-[0.9rem] font-medium text-black"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {isBookingConfigured() ? (
                    <CalendarDays className="relative z-10 size-4" />
                  ) : (
                    <Send className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  )}
                  <span className="relative z-10">{site.bookingLabel}</span>
                </a>
              </Magnetic>

              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-12 w-full items-center justify-center gap-1.5 rounded-full border border-line text-[0.9rem] font-medium text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white"
              >
                Download Résumé
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
