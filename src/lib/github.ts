import { githubUsername } from "@/data/site";

const GH = "https://api.github.com";
const REVALIDATE = 60 * 30;

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export type GithubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  location: string | null;
  htmlUrl: string;
  createdAt: string | null;
};

export type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  pushedAt: string;
  topics: string[];
  isFork: boolean;
};

export type GithubEvent = {
  id: string;
  type: string;
  repo: string;
  repoUrl: string;
  createdAt: string;
  message: string;
  commits: { sha: string; message: string }[];
};

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type ContributionData = {
  total: number;
  weeks: ContributionDay[][];
  source: "graphql" | "html" | "derived";
};

export type CalendarStats = {
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
};

export type GithubPayload = {
  profile: GithubProfile | null;
  repos: GithubRepo[];
  events: GithubEvent[];
  contributions: ContributionData;
  languages: { name: string; count: number; percent: number }[];
  stats: { stars: number; repos: number; followers: number; commitsThisYear: number } & CalendarStats;
  degraded: boolean;
  fetchedAt: string;
};

async function gh<T>(pathname: string): Promise<T | null> {
  try {
    const res = await fetch(`${GH}${pathname}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE, tags: ["github"] },
    });

    if (!res.ok) {
      // Log loudly server-side. A failure here used to surface on the page as
      // "0 repositories / 0 followers", which looks like a fact about the
      // person rather than a broken request. The usual cause in production is
      // the unauthenticated rate limit (60/hr per IP) being exhausted on a
      // shared serverless IP — a GITHUB_TOKEN raises it to 5000/hr.
      const remaining = res.headers.get("x-ratelimit-remaining");
      console.warn(
        `[github] ${res.status} ${res.statusText} for ${pathname}` +
          (remaining !== null ? ` — rate limit remaining: ${remaining}` : "") +
          (process.env.GITHUB_TOKEN ? "" : " — no GITHUB_TOKEN set"),
      );
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[github] request failed for ${pathname}:`, (err as Error).message);
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * HTML fallbacks.
 *
 * api.github.com allows 60 unauthenticated requests per hour *per IP*, and on
 * Vercel that IP is shared with every other project in the region — so in
 * production the REST calls come back 403 and every number on the page
 * collapses to zero. github.com's own public pages are not on that budget, so
 * when REST fails we parse them instead. With a GITHUB_TOKEN set none of this
 * runs: GraphQL and REST are exact and win outright.
 * ────────────────────────────────────────────────────────────────────────── */

const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

async function ghHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "text/html", "User-Agent": BROWSER_UA },
      next: { revalidate: REVALIDATE, tags: ["github"] },
    });
    if (!res.ok) {
      console.warn(`[github] html ${res.status} ${res.statusText} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`[github] html request failed for ${url}:`, (err as Error).message);
    return null;
  }
}

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'", nbsp: " ",
};
function decodeEntities(text: string): string {
  return text.replace(/&(#?\w+);/g, (whole, name: string) => ENTITIES[name] ?? whole);
}

/**
 * The public contribution calendar, scraped from the same fragment GitHub's
 * own profile page uses. Each day is a <td data-date data-level id="..."> and
 * its count lives in a sibling <tool-tip for="<that id>">N contributions…</tool-tip>.
 */
export async function contributionsFromHtml(): Promise<ContributionData | null> {
  const html = await ghHtml(`https://github.com/users/${githubUsername}/contributions`);
  return html ? parseContributionsHtml(html) : null;
}

/** Pure half of the above, so it can be unit-tested against a saved page. */
export function parseContributionsHtml(html: string): ContributionData | null {
  const counts = new Map<string, number>();
  const tipRe = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
  for (let m = tipRe.exec(html); m; m = tipRe.exec(html)) {
    const n = /^\s*([\d,]+)\s+contribution/.exec(m[2]);
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }

  const days: ContributionDay[] = [];
  const tdRe = /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
  for (let m = tdRe.exec(html); m; m = tdRe.exec(html)) {
    const id = /\bid="([^"]+)"/.exec(m[0])?.[1] ?? "";
    const level = Number(/\bdata-level="(\d)"/.exec(m[0])?.[1] ?? 0);
    days.push({
      date: m[1],
      count: counts.get(id) ?? 0,
      level: Math.min(4, Math.max(0, level)) as ContributionDay["level"],
    });
  }

  // A year is ~365 cells. Anything far short of that means GitHub changed the
  // markup — fall through to the event-derived calendar rather than render a
  // half-empty grid that understates the year.
  if (days.length < 300) {
    console.warn(`[github] contributions HTML yielded only ${days.length} days — ignoring`);
    return null;
  }

  days.sort((a, b) => a.date.localeCompare(b.date));

  // Columns are weeks starting on Sunday. Pad the first column so the weekday
  // rows stay aligned even if GitHub shifts which day the grid opens on.
  const lead = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: ContributionDay[] = [];
  for (let i = lead; i > 0; i -= 1) {
    const d = new Date(`${days[0].date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - i);
    padded.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
  }

  const all = [...padded, ...days];
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < all.length; i += 7) weeks.push(all.slice(i, i + 7));

  return { total: days.reduce((a, d) => a + d.count, 0), weeks, source: "html" };
}

/** The public repository list, for when the REST call is rate-limited. */
async function reposFromHtml(): Promise<GithubRepo[]> {
  const html = await ghHtml(`https://github.com/${githubUsername}?tab=repositories`);
  return html ? parseReposHtml(html, githubUsername) : [];
}

/** Pure half of the above, so it can be unit-tested against a saved page. */
export function parseReposHtml(html: string, login: string): GithubRepo[] {
  const out: GithubRepo[] = [];
  const blocks = html.split(/<li\b/).filter((b) => b.includes('itemprop="owns"'));

  for (const [i, raw] of blocks.entries()) {
    const block = raw.split("</li>")[0] ?? "";
    const name = /itemprop="name codeRepository"[^>]*>\s*([^<]+?)\s*</.exec(block)?.[1];
    if (!name) continue;

    const description = /itemprop="description">\s*([\s\S]*?)\s*<\/p>/.exec(block)?.[1];
    const stars = /\/stargazers"[^>]*>\s*([\d,]+)/.exec(block)?.[1];
    const forks = /\/forks"[^>]*>\s*([\d,]+)/.exec(block)?.[1];
    const classes = /^[^>]*class="([^"]*)"/.exec(raw)?.[1] ?? "";

    out.push({
      id: i,
      name,
      description: description ? decodeEntities(description.replace(/<[^>]+>/g, "").trim()) : null,
      language: /itemprop="programmingLanguage">([^<]+)</.exec(block)?.[1] ?? null,
      stars: stars ? Number(stars.replace(/,/g, "")) : 0,
      forks: forks ? Number(forks.replace(/,/g, "")) : 0,
      url: `https://github.com/${login}/${name}`,
      pushedAt: /<relative-time[^>]+datetime="([^"]+)"/.exec(block)?.[1] ?? "",
      topics: [],
      isFork: /\bfork\b/.test(classes),
    });
  }

  if (out.length === 0) console.warn("[github] repositories HTML yielded nothing");
  return out;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getProfile(): Promise<GithubProfile | null> {
  const d = await gh<any>(`/users/${githubUsername}`);
  if (!d) return null;
  return {
    login: d.login,
    name: d.name ?? null,
    bio: d.bio ?? null,
    avatarUrl: d.avatar_url ?? null,
    followers: d.followers ?? 0,
    following: d.following ?? 0,
    publicRepos: d.public_repos ?? 0,
    location: d.location ?? null,
    htmlUrl: d.html_url,
    createdAt: d.created_at ?? null,
  };
}

export async function getRepos(): Promise<GithubRepo[]> {
  const d = await gh<any[]>(`/users/${githubUsername}/repos?per_page=100&sort=pushed`);
  if (!Array.isArray(d)) return reposFromHtml();
  return d.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    language: r.language ?? null,
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    url: r.html_url,
    pushedAt: r.pushed_at,
    topics: Array.isArray(r.topics) ? r.topics : [],
    isFork: Boolean(r.fork),
  }));
}

export async function getEvents(): Promise<GithubEvent[]> {
  const d = await gh<any[]>(`/users/${githubUsername}/events/public?per_page=40`);
  if (!Array.isArray(d)) return [];
  return d
    .map((e) => {
      const commits = Array.isArray(e.payload?.commits)
        ? e.payload.commits.slice(0, 3).map((c: any) => ({
            sha: String(c.sha ?? "").slice(0, 7),
            message: String(c.message ?? "").split("\n")[0],
          }))
        : [];
      let message = "";
      switch (e.type) {
        case "PushEvent":
          message = commits[0]?.message ?? `pushed ${e.payload?.size ?? 1} commit(s)`;
          break;
        case "CreateEvent":
          message = `created ${e.payload?.ref_type ?? "repository"}${e.payload?.ref ? ` ${e.payload.ref}` : ""}`;
          break;
        case "WatchEvent":
          message = "starred the repository";
          break;
        case "PullRequestEvent":
          message = `${e.payload?.action} pull request #${e.payload?.number}`;
          break;
        case "IssuesEvent":
          message = `${e.payload?.action} issue #${e.payload?.issue?.number}`;
          break;
        case "ForkEvent":
          message = "forked the repository";
          break;
        case "ReleaseEvent":
          message = `released ${e.payload?.release?.tag_name ?? ""}`;
          break;
        default:
          message = e.type.replace(/Event$/, "").toLowerCase();
      }
      return {
        id: String(e.id),
        type: String(e.type),
        repo: String(e.repo?.name ?? ""),
        repoUrl: `https://github.com/${e.repo?.name ?? ""}`,
        createdAt: String(e.created_at),
        message,
        commits,
      };
    })
    .filter((e) => e.repo);
}

const LEVELS: ContributionDay["level"][] = [0, 1, 2, 3, 4];
function levelFor(count: number, max: number): ContributionDay["level"] {
  if (count === 0) return 0;
  const step = Math.max(1, Math.ceil(max / 4));
  return LEVELS[Math.min(4, Math.ceil(count / step))] ?? 1;
}

function emptyYear(): { weeks: ContributionDay[][]; index: Map<string, ContributionDay> } {
  const days: ContributionDay[] = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 364);
  // align to Sunday
  start.setDate(start.getDate() - start.getDay());
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
  }
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const index = new Map(days.map((d) => [d.date, d]));
  return { weeks, index };
}

async function contributionsFromGraphQL(): Promise<ContributionData | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  try {
    const res = await fetch(`${GH}/graphql`, {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: githubUsername } }),
      next: { revalidate: REVALIDATE, tags: ["github"] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;
    const map: Record<string, ContributionDay["level"]> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };
    return {
      total: cal.totalContributions ?? 0,
      source: "graphql",
      weeks: (cal.weeks ?? []).map((w: any) =>
        (w.contributionDays ?? []).map((d: any) => ({
          date: d.date,
          count: d.contributionCount ?? 0,
          level: map[d.contributionLevel] ?? 0,
        })),
      ),
    };
  } catch {
    return null;
  }
}

function contributionsFromEvents(events: GithubEvent[]): ContributionData {
  const { weeks, index } = emptyYear();
  let total = 0;
  for (const e of events) {
    const day = e.createdAt.slice(0, 10);
    const hit = index.get(day);
    if (!hit) continue;
    const weight = e.type === "PushEvent" ? Math.max(1, e.commits.length) : 1;
    hit.count += weight;
    total += weight;
  }
  const max = Math.max(1, ...[...index.values()].map((d) => d.count));
  for (const d of index.values()) d.level = levelFor(d.count, max);
  return { total, weeks, source: "derived" };
}

/**
 * Streaks and active days, read off whichever calendar we ended up with.
 * These replace "stars earned" and "followers" on the page: for most working
 * developers those two are honestly zero, and a zero there reads as a verdict
 * rather than a measurement. Days shipped is the number that means something.
 */
export function calendarStats(c: ContributionData): CalendarStats {
  const today = new Date().toISOString().slice(0, 10);
  const days = c.weeks.flat().filter((d) => d.date <= today);

  let activeDays = 0;
  let longestStreak = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      activeDays += 1;
      run += 1;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }

  // Count back from the most recent day. Today is allowed to be empty without
  // breaking the streak — the day is not over yet.
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].count > 0) currentStreak += 1;
    else if (!(i === days.length - 1 && days[i].date === today)) break;
  }

  return { activeDays, longestStreak, currentStreak };
}

export async function getGithubPayload(): Promise<GithubPayload> {
  const [profile, repos, events] = await Promise.all([getProfile(), getRepos(), getEvents()]);

  // Exact calendar if we have a token, the public HTML calendar if not, and
  // only then the events-derived approximation — which is near-useless, since
  // the events feed holds 90 days at most and omits private work entirely.
  const contributions =
    (await contributionsFromGraphQL()) ??
    (await contributionsFromHtml()) ??
    contributionsFromEvents(events);

  const langCount = new Map<string, number>();
  for (const r of repos) if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
  const totalLang = [...langCount.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...langCount.entries()]
    .map(([name, count]) => ({ name, count, percent: Math.round((count / totalLang) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    profile,
    repos,
    events,
    contributions,
    languages,
    stats: {
      stars: repos.reduce((a, r) => a + r.stars, 0),
      repos: profile?.publicRepos ?? repos.length,
      followers: profile?.followers ?? 0,
      commitsThisYear: contributions.total,
      ...calendarStats(contributions),
    },
    // Degraded means "we have nothing true to show", not "one call failed".
    // A rate-limited profile lookup alongside a real calendar and a real repo
    // list is still a section worth rendering.
    degraded: contributions.total === 0 && repos.length === 0,
    fetchedAt: new Date().toISOString(),
  };
}
