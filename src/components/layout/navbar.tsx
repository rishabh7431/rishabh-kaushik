"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { contactHref, isBookingConfigured, nav, navMore, site } from "@/data/site";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { CommandPalette } from "./command-palette";
import { Magnetic } from "@/components/ui/magnetic";

export function Navbar() {
  const pathname = usePathname();
  const { direction, atTop } = useScrollDirection();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hidden = direction === "down" && !atTop && !mobileOpen;

  // Route changes can come from anywhere (nav links, command palette, browser
  // back), so the open menus are reset here rather than in each click handler.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMoreOpen(false);
    setMobileOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const moreActive = navMore.some((m) => isActive(m.href));

  function openMore() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMoreOpen(true);
  }
  function scheduleCloseMore() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMoreOpen(false), 160);
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: hidden ? 0 : 0.1 }}
        className="fixed inset-x-0 top-0 z-[140]"
      >
        <div
          className={cn(
            "mx-auto flex h-[68px] max-w-[1500px] items-center justify-between px-5 transition-all duration-500 sm:px-8",
            !atTop && "backdrop-blur-xl",
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} — home`}>
            <span className="font-serif text-[1.6rem] italic leading-none tracking-tight text-white transition-transform duration-500 group-hover:-rotate-6">
              {site.initials}
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-mono text-[0.56rem] font-medium uppercase tracking-[0.16em] text-white">
                Software Developer
              </span>
              <span className="mt-0.5 font-mono text-[0.56rem] font-medium uppercase tracking-[0.16em] text-accent">
                {site.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop nav pill */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-black/45 p-1.5 backdrop-blur-xl lg:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-[0.83rem] font-medium transition-colors duration-300",
                    active ? "text-black" : "text-ink-dim hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}

            {/* More dropdown */}
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={openMore}
              onMouseLeave={scheduleCloseMore}
            >
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className={cn(
                  "relative inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-[0.83rem] font-medium transition-colors duration-300",
                  moreActive ? "text-black" : "text-ink-dim hover:text-white",
                )}
              >
                {moreActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">More</span>
                <ChevronDown
                  className={cn(
                    "relative z-10 size-3.5 transition-transform duration-300",
                    moreOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, scale: 0.97, filter: "blur(6px)" }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-[calc(100%+12px)] w-56 overflow-hidden rounded-2xl border border-line-strong bg-[#080808]/97 p-1.5 shadow-[0_30px_80px_-28px_rgba(0,0,0,1)] backdrop-blur-xl"
                  >
                    {navMore.map((item, i) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + i * 0.045, duration: 0.32 }}
                      >
                        <Link
                          href={item.href}
                          role="menuitem"
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-200",
                            isActive(item.href)
                              ? "bg-white/[0.07] text-white"
                              : "text-ink-dim hover:bg-white/[0.05] hover:text-white",
                          )}
                        >
                          <span className="text-[0.85rem] font-medium">{item.label}</span>
                          <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-faint">
                            {item.hint}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Magnetic strength={0.18}>
              <a
                href={contactHref()}
                target={isBookingConfigured() ? "_blank" : undefined}
                rel={isBookingConfigured() ? "noopener noreferrer" : undefined}
                className="ml-1 whitespace-nowrap rounded-full bg-white/[0.13] px-4 py-1.5 text-[0.83rem] font-medium text-white transition-colors duration-300 hover:bg-white/20"
              >
                {site.bookingLabel}
              </a>
            </Magnetic>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <CommandPalette />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid size-9 place-items-center rounded-full border border-line bg-white/[0.03] text-ink-dim transition-colors hover:text-white lg:hidden"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[190] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="relative flex h-full flex-col px-6 pb-10 pt-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl italic text-white">{site.initials}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-full border border-line text-ink-dim"
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav className="mt-12 flex flex-col gap-1">
                {[...nav, ...navMore].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-baseline justify-between border-b border-line py-4",
                        isActive(item.href) ? "text-white" : "text-ink-dim",
                      )}
                    >
                      <span className="display-tight text-3xl">{item.label}</span>
                      <span className="font-mono text-[0.6rem] tracking-[0.16em] text-ink-faint">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto flex items-center gap-3">
                <a
                  href={contactHref()}
                  target={isBookingConfigured() ? "_blank" : undefined}
                  rel={isBookingConfigured() ? "noopener noreferrer" : undefined}
                  className="flex h-12 flex-1 items-center justify-center rounded-full bg-white text-[0.9rem] font-medium text-black"
                >
                  {site.bookingLabel}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
