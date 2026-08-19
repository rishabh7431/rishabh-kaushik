"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#";

/**
 * Glyph-cycling decode effect driven by a single rAF loop. Each character has a
 * randomised settle frame so the reveal front is ragged rather than linear.
 */
export function ScrambleText({
  text,
  className,
  speed = 1.6,
  trigger = "mount",
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  speed?: number;
  trigger?: "mount" | "hover" | "view";
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const [output, setOutput] = useState(trigger === "mount" ? "" : text);
  const frame = useRef(0);
  const raf = useRef(0);
  const hostRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOutput(text);
      return;
    }

    const queue = Array.from(text).map((char, i) => ({
      char,
      start: i * (3 / speed),
      end: i * (3 / speed) + 9 / speed,
    }));

    const run = () => {
      let done = 0;
      let out = "";
      for (const item of queue) {
        if (frame.current >= item.end) {
          done += 1;
          out += item.char;
        } else if (frame.current >= item.start) {
          out += item.char === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          out += item.char === " " ? " " : "";
        }
      }
      setOutput(out);
      frame.current += 1;
      if (done < queue.length) raf.current = requestAnimationFrame(run);
    };

    const start = () => {
      cancelAnimationFrame(raf.current);
      frame.current = 0;
      raf.current = requestAnimationFrame(run);
    };

    if (trigger === "mount") {
      start();
    } else if (trigger === "view") {
      const el = hostRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            start();
            io.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf.current);
      };
    }

    return () => cancelAnimationFrame(raf.current);
  }, [text, speed, trigger, reduced]);

  const hoverHandlers =
    trigger === "hover"
      ? {
          onPointerEnter: () => {
            if (reduced) return;
            cancelAnimationFrame(raf.current);
            frame.current = 0;
            const queue = Array.from(text).map((char, i) => ({
              char,
              start: i * (3 / speed),
              end: i * (3 / speed) + 9 / speed,
            }));
            const run = () => {
              let done = 0;
              let out = "";
              for (const item of queue) {
                if (frame.current >= item.end) {
                  done += 1;
                  out += item.char;
                } else if (frame.current >= item.start) {
                  out += item.char === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                } else {
                  out += item.char;
                }
              }
              setOutput(out);
              frame.current += 1;
              if (done < queue.length) raf.current = requestAnimationFrame(run);
            };
            raf.current = requestAnimationFrame(run);
          },
        }
      : {};

  const Component = Tag as "span";

  return (
    <Component
      ref={hostRef as React.Ref<HTMLSpanElement>}
      className={cn("tabular-nums", className)}
      {...hoverHandlers}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>{output || " "}</span>
    </Component>
  );
}
