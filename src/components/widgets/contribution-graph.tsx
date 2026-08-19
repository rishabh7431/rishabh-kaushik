"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { ContributionData, ContributionDay } from "@/lib/github";
import { cn } from "@/lib/utils";

const LEVEL_BG: Record<ContributionDay["level"], string> = {
  0: "rgba(255,255,255,0.055)",
  1: "rgba(36,209,126,0.28)",
  2: "rgba(36,209,126,0.48)",
  3: "rgba(36,209,126,0.72)",
  4: "rgba(36,209,126,1)",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ContributionGraph({
  data,
  className,
}: {
  data: ContributionData;
  className?: string;
}) {
  const [hover, setHover] = useState<ContributionDay | null>(null);

  const monthLabels = data.weeks.map((week, i) => {
    const first = week[0];
    if (!first) return null;
    const d = new Date(first.date);
    const prev = i > 0 ? new Date(data.weeks[i - 1][0]?.date ?? first.date) : null;
    if (!prev || prev.getMonth() !== d.getMonth()) return { index: i, label: MONTHS[d.getMonth()] };
    return null;
  });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="hide-scrollbar overflow-x-auto pb-1">
        <div className="inline-flex min-w-max flex-col gap-1.5">
          <div className="flex gap-[3px]">
            {data.weeks.map((_, i) => {
              const label = monthLabels[i];
              return (
                <span key={i} className="w-[11px] shrink-0">
                  {label && (
                    <span className="block -translate-x-0.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-ink-faint">
                      {label.label}
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {data.weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <motion.span
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.32,
                      delay: Math.min(0.9, (wi * 7 + di) * 0.0016),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onPointerEnter={() => setHover(day)}
                    onPointerLeave={() => setHover(null)}
                    className="size-[11px] shrink-0 rounded-[2.5px] transition-transform duration-150 hover:scale-[1.35]"
                    style={{ background: LEVEL_BG[day.level] }}
                    title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">
          {hover
            ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} · ${hover.date}`
            : `${data.total.toLocaleString()} contributions in the last year`}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink-faint">Less</span>
          {([0, 1, 2, 3, 4] as const).map((l) => (
            <span key={l} className="size-[9px] rounded-[2px]" style={{ background: LEVEL_BG[l] }} />
          ))}
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink-faint">More</span>
        </div>
      </div>

      {data.source === "derived" && (
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-ink-faint/70">
          Derived from public events — add a GITHUB_TOKEN for the exact calendar.
        </p>
      )}
    </div>
  );
}
