import { cn } from "@/lib/utils";

/** Shimmering placeholder used by every async widget while it loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-md bg-white/[0.045]",
        className,
      )}
    >
      <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
    </span>
  );
}

export function TerminalLoading({ label }: { label: string }) {
  return (
    <p className="font-mono text-[0.7rem] tracking-[0.1em] text-ink-faint">
      {label}
      <span className="ml-0.5 inline-block animate-blink">_</span>
    </p>
  );
}
