"use client";

import useFetch from "@/hooks/use-fetch";
import { motion } from "motion/react";
import { CalendarDays, Flame, GitBranch, GitCommitHorizontal } from "lucide-react";
import type { GithubPayload } from "@/lib/github";
import { site } from "@/data/site";
import { relativeTime } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { Skeleton, TerminalLoading } from "@/components/ui/skeleton";
import { ContributionGraph } from "./contribution-graph";
import { Counter } from "@/components/ui/counter";
import { GithubIcon } from "@/components/ui/social-icons";
import { ArrowLink } from "@/components/ui/arrow-link";

/**
 * "Behind the curtains" — live GitHub state. Fetched client-side from our own
 * cached API route so the section can show a real loading state (matching the
 * reference site's terminal-style boot message) instead of blocking the page.
 */
export function GithubSection() {
  const { data, error, loading } = useFetch<GithubPayload>("/api/github");

  // If GitHub could not be reached, render nothing at all.
  //
  // This previously fell back to `?? 0` and printed "0 contributions,
  // 0 repositories, 0 stars, 0 followers" — which does not read as "we could
  // not load this", it reads as "this developer has shipped nothing". An absent
  // section is neutral; a zeroed one actively argues against you. The usual
  // cause is the unauthenticated GitHub API rate-limiting Vercel's shared
  // serverless IPs, which a GITHUB_TOKEN fixes (see README).
  const unavailable = !loading && (Boolean(error) || !data || data.degraded);
  if (unavailable) return null;

  // A derived calendar that totals zero means "no public events in the window",
  // not "no contributions" — so show the graph only when the number is real.
  const showGraph = Boolean(
    data && (data.contributions.source === "graphql" || data.contributions.total > 0),
  );

  // Stars and followers used to sit here. For most working developers both are
  // honestly zero — the work is in private and team repos — and a zero in a
  // stat tile reads as a verdict on the person rather than a measurement of a
  // popularity contest they never entered. Days shipped is the honest number.
  const stats = [
    { label: "Contributions", value: data?.stats.commitsThisYear ?? 0, Icon: GitCommitHorizontal },
    { label: "Active days", value: data?.stats.activeDays ?? 0, Icon: CalendarDays },
    { label: "Longest streak", value: data?.stats.longestStreak ?? 0, Icon: Flame },
    { label: "Repositories", value: data?.stats.repos ?? 0, Icon: GitBranch },
  ];

  // The public events feed only covers 90 days and skips private work, so it
  // is routinely empty for someone who is busy. Recently pushed repositories
  // are the same signal from a source that does not expire.
  const events = data?.events ?? [];
  const recentRepos = (data?.repos ?? [])
    .filter((r) => !r.isFork && r.pushedAt)
    .slice(0, 6);
  const showEvents = events.length > 0;
  const showRepos = !showEvents && recentRepos.length > 0;
  const showActivity = loading || showEvents || showRepos;

  return (
    <section className="relative w-full overflow-hidden bg-abyss px-5 pb-16 pt-24 sm:px-8 md:pt-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col items-center text-center">
          <Reveal direction="up" duration={0.6}>
            <span className="eyebrow">Behind the curtains</span>
          </Reveal>
          <h2 className="display-tight mt-4 text-[clamp(2rem,5vw,3.4rem)]">
            <TextReveal text="The Magic Behind" by="word" className="text-white" />
            <span className="mt-1 block font-serif text-[1.06em] font-normal italic">
              <TextReveal text="the interface." by="word" delay={0.14} wordClassName="text-gradient" />
            </span>
          </h2>
          <Reveal direction="up" delay={0.18}>
            <p className="mt-4 max-w-md font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">
              Decoding logic &amp;&amp; the lyrics
            </p>
          </Reveal>
        </div>

        <div
          // items-start, not the default stretch: the activity card holds a handful
          // of rows and stretching it to the calendar card's height leaves a tall
          // empty well inside a bordered box, which reads as missing content.
          className={`mt-14 grid gap-4 ${showActivity ? "lg:grid-cols-[1.25fr_1fr] lg:items-start" : ""}`}
        >
          {/* Contribution card */}
          <Reveal direction="up" delay={0.06}>
            <div className="card-surface grain flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <GithubIcon className="size-4 text-white" />
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white">
                    {site.firstName}&apos;s GitHub
                  </span>
                </div>
                <ArrowLink href={site.socials.github.url} className="text-[0.75rem]">
                  @{site.socials.github.handle}
                </ArrowLink>
              </div>

              <div className="mt-6 flex-1">
                {loading && (
                  <div className="flex flex-col gap-3">
                    <TerminalLoading label="Initializing connection to GitHub daemon..." />
                    <div className="flex gap-[3px]">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-[3px]">
                          {Array.from({ length: 7 }).map((__, j) => (
                            <Skeleton key={j} className="size-[11px] rounded-[2.5px]" />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && !data && (
                  <p className="font-mono text-[0.7rem] text-red-400/80">
                    GitHub is unreachable right now. The rest of the page is unaffected.
                  </p>
                )}

                {data && showGraph && <ContributionGraph data={data.contributions} />}

                {data && !showGraph && (
                  <p className="text-[0.85rem] leading-relaxed text-ink-faint">
                    Most of this year&apos;s work has been in private and team
                    repositories, so it does not appear on the public calendar.
                  </p>
                )}
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-4">
                {stats.map(({ label, value, Icon }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <Icon className="size-3.5 text-ink-faint" />
                    <span className="display-tight text-2xl text-white">
                      {loading ? <Skeleton className="h-6 w-12" /> : <Counter to={value} />}
                    </span>
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink-faint">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {data && data.languages.length > 0 && (
                <div className="mt-6 border-t border-line pt-6">
                  <p className="eyebrow">Language mix</p>
                  <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    {data.languages.map((l, i) => (
                      <motion.span
                        key={l.name}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${l.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {data.languages.map((l, i) => (
                      <span
                        key={l.name}
                        className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] text-ink-dim"
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
                        />
                        {l.name} {l.percent}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Activity feed */}
          {showActivity && (
            <Reveal direction="up" delay={0.14}>
              <div className="card-surface grain flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">{showRepos ? "Recently updated" : "Latest push"}</span>
                  {data && (
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-accent">
                      live
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-1 flex-col gap-3">
                  {loading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-2 border-b border-line pb-3">
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-2.5 w-1/3" />
                      </div>
                    ))}

                  {showEvents &&
                    events.slice(0, 6).map((e, i) => (
                      <motion.a
                        key={e.id}
                        href={e.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -14 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        className="group flex flex-col gap-1 border-b border-line pb-3 last:border-0"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate font-mono text-[0.7rem] text-white/90 group-hover:text-white">
                            {e.repo.split("/")[1] ?? e.repo}
                          </span>
                          <span className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-ink-faint">
                            {relativeTime(e.createdAt)}
                          </span>
                        </span>
                        <span className="line-clamp-2 text-[0.8rem] leading-snug text-ink-dim">
                          {e.message}
                        </span>
                      </motion.a>
                    ))}

                  {showRepos &&
                    recentRepos.map((r, i) => (
                      <motion.a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -14 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        className="group flex flex-col gap-1 border-b border-line pb-3 last:border-0"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate font-mono text-[0.7rem] text-white/90 group-hover:text-white">
                            {r.name}
                          </span>
                          <span className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-ink-faint">
                            {relativeTime(r.pushedAt)}
                          </span>
                        </span>
                        <span className="line-clamp-2 text-[0.8rem] leading-snug text-ink-dim">
                          {r.description ?? (r.language ? `${r.language} repository` : "Repository")}
                        </span>
                      </motion.a>
                    ))}
                </div>

                <a
                  href={site.socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-white"
                >
                  Open profile →
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

const LANG_COLORS = ["#24d17e", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];
