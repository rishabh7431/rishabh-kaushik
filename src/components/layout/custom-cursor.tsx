"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/use-media-query";

type CursorState = "default" | "hover" | "text";

/**
 * Two-part cursor: a small dot that tracks the pointer with almost no lag, and a
 * ring that trails on a softer spring. State is derived from `data-cursor`
 * attributes and from the element under the pointer, so no component has to
 * register itself.
 */
export function CustomCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 280, damping: 26, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 280, damping: 26, mass: 0.4 });
  const dotX = useSpring(x, { stiffness: 1100, damping: 45, mass: 0.12 });
  const dotY = useSpring(y, { stiffness: 1100, damping: 45, mass: 0.12 });

  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const enabled = !isTouch && !reduced;

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("cursor-none-desktop");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = e.target as HTMLElement | null;
      const cursorEl = el?.closest?.("[data-cursor]") as HTMLElement | null;
      if (cursorEl) {
        setState((cursorEl.dataset.cursor as CursorState) ?? "hover");
        setLabel(cursorEl.dataset.cursorLabel ?? null);
        return;
      }
      if (el?.closest?.('a, button, [role="button"], summary, [role="tab"]')) {
        setState("hover");
        setLabel(null);
        return;
      }
      if (el?.closest?.("input, textarea, select, [contenteditable]")) {
        setState("text");
        setLabel(null);
        return;
      }
      setState("default");
      setLabel(null);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = label ? 78 : state === "hover" ? 46 : state === "text" ? 10 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 mix-blend-difference"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? (state === "text" ? 0.4 : 1) : 0,
            scale: pressed ? 0.82 : 1,
            backgroundColor: label ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          <motion.span
            className="whitespace-nowrap font-mono text-[0.55rem] font-medium uppercase tracking-[0.14em] text-black"
            animate={{ opacity: label ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          >
            {label}
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div className="absolute left-0 top-0" style={{ x: dotX, y: dotY }}>
        <motion.div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
          animate={{ opacity: visible && !label ? 1 : 0, scale: state === "hover" ? 0.55 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
}
