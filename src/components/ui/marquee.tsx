"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Seamless CSS marquee. The track holds two identical halves and translates by
 * -50%, so the loop point is invisible regardless of content width.
 */
export function Marquee({
  children,
  className,
  trackClassName,
  reverse = false,
  speed = 34,
  pauseOnHover = true,
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  reverse?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
  fade?: boolean;
}) {
  return (
    <div
      className={cn("group relative w-full overflow-hidden", className)}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "flex w-max items-center",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          trackClassName,
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
