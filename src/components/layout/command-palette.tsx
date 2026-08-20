"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Command,
  CornerDownLeft,
  FileText,
  Home,
  Link2,
  Mail,
  Search,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { useCopy } from "@/hooks/use-copy";
import { useToast } from "@/components/ui/toast";
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { getLenis } from "./smooth-scroll";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigation" | "Projects" | "Contact" | "Actions";
  icon: React.ReactNode;
  keywords?: string;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { copy } = useCopy();
  const { push } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const actions = useMemo<Action[]>(() => {
    const base: Action[] = [
      { id: "home", label: "Home", group: "Navigation", icon: <Home className="size-4" />, run: () => go("/") },
      { id: "about", label: "About", group: "Navigation", icon: <User className="size-4" />, run: () => go("/about") },
      { id: "work", label: "Work", hint: "All projects", group: "Navigation", icon: <Sparkles className="size-4" />, run: () => go("/projects") },
      { id: "uses", label: "Stack", hint: "Technical skills", group: "Navigation", icon: <Wrench className="size-4" />, run: () => go("/uses") },
      { id: "links", label: "Links", hint: "Contact", group: "Navigation", icon: <Link2 className="size-4" />, run: () => go("/links") },
    ];

    const projectActions: Action[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      hint: p.category,
      group: "Projects",
      keywords: p.stack.join(" "),
      icon: <span className="font-mono text-[0.62rem] text-ink-faint">{p.index}</span>,
      run: () => go(`/projects/${p.slug}`),
    }));

    const contact: Action[] = [
      {
        id: "email",
        label: "Send an email",
        hint: site.email,
        group: "Contact",
        icon: <Mail className="size-4" />,
        run: () => {
          close();
          window.location.href = `mailto:${site.email}`;
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: `/in/${site.socials.linkedin.handle}`,
        group: "Contact",
        icon: <LinkedinIcon className="size-4" />,
        run: () => {
          close();
          window.open(site.socials.linkedin.url, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: `@${site.socials.github.handle}`,
        group: "Contact",
        icon: <GithubIcon className="size-4" />,
        run: () => {
          close();
          window.open(site.socials.github.url, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "resume",
        label: "Open résumé",
        hint: "PDF",
        group: "Contact",
        icon: <FileText className="size-4" />,
        run: () => {
          close();
          window.open(site.resumeUrl, "_blank", "noopener,noreferrer");
        },
      },
    ];

    const utility: Action[] = [
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        icon: <Mail className="size-4" />,
        run: async () => {
          close();
          const ok = await copy(site.email);
          push({
            title: ok ? "Email copied" : "Copy failed",
            description: ok ? site.email : "Your browser blocked clipboard access.",
            variant: ok ? "success" : "error",
          });
        },
      },
      {
        id: "top",
        label: "Scroll to top",
        group: "Actions",
        icon: <ArrowUp className="size-4" />,
        run: () => {
          close();
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(0, { duration: 1.2 });
          else window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
    ];

    return [...base, ...projectActions, ...contact, ...utility];
  }, [go, close, copy, push]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      `${a.label} ${a.hint ?? ""} ${a.keywords ?? ""} ${a.group}`.toLowerCase().includes(q),
    );
  }, [actions, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Action[]>();
    for (const a of filtered) {
      const list = map.get(a.group) ?? [];
      list.push(a);
      map.set(a.group, list);
    }
    return [...map.entries()];
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Highlight returns to the first result whenever the result set changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setActive(0), [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(1, flat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % Math.max(1, flat.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[active]?.run();
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let cursor = -1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="group grid size-9 place-items-center rounded-full border border-line bg-white/[0.03] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-white"
      >
        <Command className="size-[15px] transition-transform duration-300 group-hover:scale-110" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[180] flex items-start justify-center px-4 pt-[12vh]">
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -14, scale: 0.97, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onKeyDown={onKeyDown}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-[#080808]/97 shadow-[0_40px_120px_-30px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
                <Search className="size-4 text-ink-faint" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, projects, actions…"
                  className="w-full bg-transparent text-[0.9rem] text-white outline-none placeholder:text-ink-faint"
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.6rem] text-ink-faint">
                  ESC
                </kbd>
              </div>

              <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
                {grouped.length === 0 && (
                  <p className="px-3 py-8 text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
                    No results for “{query}”
                  </p>
                )}

                {grouped.map(([group, items]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <p className="px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-faint">
                      {group}
                    </p>
                    {items.map((item) => {
                      cursor += 1;
                      const index = cursor;
                      const isActive = index === active;
                      return (
                        <button
                          key={item.id}
                          data-index={index}
                          onMouseEnter={() => setActive(index)}
                          onClick={item.run}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
                            isActive ? "bg-white/[0.07] text-white" : "text-ink-dim",
                          )}
                        >
                          <span className={cn("grid size-5 place-items-center", isActive ? "text-white" : "text-ink-faint")}>
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate text-[0.875rem]">{item.label}</span>
                          {item.hint && (
                            <span className="truncate font-mono text-[0.62rem] text-ink-faint">{item.hint}</span>
                          )}
                          {isActive && <CornerDownLeft className="size-3.5 text-ink-faint" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-faint">
                <span className="flex items-center gap-3">
                  <span>↑↓ navigate</span>
                  <span>↵ select</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  {site.initials} palette <ArrowUpRight className="size-3" />
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
