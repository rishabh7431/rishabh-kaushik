import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  dot,
  dotColor = "#24d17e",
  pulse = false,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
  dotColor?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-dim",
        className,
      )}
    >
      {dot && (
        <span className="relative inline-flex size-1.5">
          <span className="absolute inset-0 rounded-full" style={{ background: dotColor }} />
          {pulse && (
            <span
              className="absolute inset-0 animate-pulse-ring rounded-full"
              style={{ background: dotColor }}
            />
          )}
        </span>
      )}
      {children}
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-white/[0.02] px-2 py-1 font-mono text-[0.62rem] tracking-[0.08em] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
