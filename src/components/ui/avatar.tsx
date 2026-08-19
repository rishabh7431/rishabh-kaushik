import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

const PALETTE = [
  ["#24d17e", "#0b5f3a"],
  ["#3b82f6", "#1e3a8a"],
  ["#a855f7", "#4c1d95"],
  ["#f59e0b", "#7c2d12"],
  ["#ec4899", "#831843"],
  ["#06b6d4", "#164e63"],
];

function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

/** Deterministic gradient avatar — no external image service, no layout shift. */
export function Avatar({
  name,
  seed,
  size = 36,
  className,
}: {
  name: string;
  seed?: string;
  size?: number;
  className?: string;
}) {
  const key = seed ?? name;
  const [from, to] = PALETTE[hash(key) % PALETTE.length];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-white/12 font-mono font-medium text-black/85",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(9, size * 0.34),
        backgroundImage: `linear-gradient(140deg, ${from}, ${to})`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
