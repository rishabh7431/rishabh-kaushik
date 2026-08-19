"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TabItem = { id: string; label: string; icon?: ReactNode };

/** Pill tabs with a shared layoutId indicator that slides between options. */
export function Tabs({
  items,
  value,
  onChange,
  className,
  layoutId = "tab-indicator",
  size = "sm",
}: {
  items: readonly TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center gap-1 rounded-xl border border-line bg-white/[0.02] p-1", className)}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-lg font-mono uppercase tracking-[0.14em] transition-colors duration-300",
              size === "sm" ? "px-2.5 py-1.5 text-[0.62rem]" : "px-3.5 py-2 text-[0.7rem]",
              active ? "text-white" : "text-ink-faint hover:text-ink-dim",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg border border-line-strong bg-white/[0.07]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {item.icon}
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Horizontal filter row used on the projects and blogs indexes. */
export function FilterTabs({
  items,
  value,
  onChange,
  className,
  layoutId = "filter-indicator",
}: {
  items: readonly string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  layoutId?: string;
}) {
  return (
    <div className={cn("hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1", className)}>
      {items.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors duration-300",
              active ? "text-black" : "text-ink-faint hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item}</span>
          </button>
        );
      })}
    </div>
  );
}
