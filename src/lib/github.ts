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
export type ContributionData = { total: number; weeks: ContributionDay[][]; source: "graphql" | "derived" };

export type GithubPayload = {
  profile: GithubProfile | null;
  repos: GithubRepo[];
  events: GithubEvent[];
  contributions: ContributionData;
  languages: { name: string; count: number; percent: number }[];
  stats: { stars: number; repos: number; followers: number; commitsThisYear: number };
  degraded: boolean;
  fetchedAt: string;
};

async function gh<T>(pathname: string): Promise<T | null> {
  try {
    const res = await fetch(`${GH}${pathname}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE, tags: ["github"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
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
  if (!Array.isArray(d)) return [];
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

export async function getGithubPayload(): Promise<GithubPayload> {
  const [profile, repos, events] = await Promise.all([getProfile(), getRepos(), getEvents()]);
  const graph = await contributionsFromGraphQL();
  const contributions = graph ?? contributionsFromEvents(events);

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
    },
    degraded: !profile,
    fetchedAt: new Date().toISOString(),
  };
}
