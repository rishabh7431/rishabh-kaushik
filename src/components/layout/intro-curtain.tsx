"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const SESSION_KEY = "intro-played";

/**
 * First-load curtain. Rendered only from the home page, and only once per browser
 * session — deep links and repeat visits go straight to content instead of paying
 * 1.5s for an animation they have already seen.
 *
 * It renders on the server so there is no flash of unstyled hero; if the session
 * flag is already set the effect removes it on the first client frame.
 */
export function IntroCurtain() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let played = false;
    try {
      played = window.sessionStorage.getItem(SESSION_KEY) === "1";
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Private mode or storage disabled — just play it.
    }

    if (played) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setVisible(false), 1500);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-curtain"
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-serif text-4xl italic tracking-tight text-white">
              {site.initials}
            </span>
            <div className="h-[2px] w-28 overflow-hidden rounded-full bg-white/12">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="eyebrow">{site.tagline}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
