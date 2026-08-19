"use client";

import { Marquee } from "@/components/ui/marquee";
import { marqueeWords } from "@/data/site";

export function MarqueeBand() {
  return (
    <section className="relative w-full overflow-hidden border-y border-line bg-void py-7">
      <Marquee speed={38}>
        {marqueeWords.map((word) => (
          <span key={word} className="flex items-center">
            <span className="px-6 font-display text-[clamp(1.1rem,2.6vw,2rem)] font-medium uppercase tracking-[-0.01em] text-white/85">
              {word}
            </span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </Marquee>

      <Marquee speed={46} reverse className="mt-4 opacity-40">
        {marqueeWords.map((word) => (
          <span key={`r-${word}`} className="flex items-center">
            <span className="px-6 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-ink-faint">
              {word}
            </span>
            <span className="text-ink-faint">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
