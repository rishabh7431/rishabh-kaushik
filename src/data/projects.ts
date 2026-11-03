/**
 * Two projects, both documented.
 *  - GBTAC platform: from the Professional Experience section of the resume.
 *  - Pulse: from the Pulse project README.
 * No other project is claimed anywhere on this site.
 */

export type ProjectStatus = "Delivered" | "Academic Project" | "Android Beta";

export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  status: ProjectStatus;
  role: string;
  team: string;
  summary: string;
  description: string[];
  stack: string[];
  highlights: { label: string; value: string }[];
  contributions: string[];
  decisions?: { title: string; body: string }[];
  limitations?: string[];
  repo?: string;
  /** External destinations rendered as buttons on the project page. */
  links?: { label: string; href: string }[];
  /** A short line under Role — e.g. why there is no repository button. */
  roleNote?: string;
  accent: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "gbtac-platform",
    index: "01",
    title: "GBTAC Research Platform",
    subtitle: "A public web platform for GBTAC researchers",
    category: "Full Stack",
    year: "2026",
    status: "Delivered",
    role: "Full Stack Developer & Project Manager",
    team: "4-person Agile team",
    summary:
      "A TypeScript microservices application on Microsoft Azure — eight services plus an API gateway — delivering a public research platform, built and led across four sprints.",
    description: [
      "GBTAC needed a public web platform for its researchers. I worked on it as Full Stack Developer and Project Manager, leading a four-person Agile team and owning both the programming plan and the testing strategy.",
      "The delivery side meant planning and tracking more than 150 tasks across four sprints in Jira. The engineering side meant building both ends of a TypeScript microservices application on Microsoft Azure: a React and Vite front-end, and Node.js and Express back-end services, backed by Azure SQL, Blob Storage and Container Apps.",
      "I also led AI integration for the platform alongside a backend teammate, embedding AI-powered functionality into the researcher-facing experience.",
    ],
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Node.js",
      "Express",
      "Azure SQL",
      "Azure Blob Storage",
      "Azure Container Apps",
      "Vitest",
      "Supertest",
      "Playwright",
      "CI/CD",
    ],
    highlights: [
      { label: "Architecture", value: "8 services + gateway" },
      { label: "Delivery", value: "150+ tasks, 4 sprints" },
      { label: "Performance", value: "Sub-3s load, sub-500ms filters" },
    ],
    contributions: [
      "Led project management for a 4-person Agile team, planning and tracking 150+ tasks across four sprints in Jira and owning the team's programming plan and testing strategy.",
      "Developed both ends of a TypeScript microservices application (8 services plus an API gateway) on Microsoft Azure: a React and Vite front-end and Node.js and Express back-end services, backed by Azure SQL, Blob Storage and Container Apps.",
      "Led AI integration for the platform alongside a backend teammate, embedding AI-powered functionality into the researcher-facing experience.",
      "Built an ingestion pipeline that cleaned, normalized and loaded the Retrofit Canada case-study dataset into the cloud database.",
      "Created interactive visualizations including a choropleth map, EUI comparison charts and province-level analytics.",
      "Delivered against performance targets (sub-3-second load, sub-500ms filters) with a three-tier test suite (Vitest, Supertest, Playwright) and CI/CD for build, test and deploy.",
    ],
    accent: "#24d17e",
    featured: true,
  },
  {
    slug: "pulse",
    index: "02",
    title: "Pulse",
    subtitle: "A personal health app for iOS and Android",
    category: "Mobile",
    year: "2026",
    status: "Android Beta",
    role: "Personal project",
    team: "Solo build",
    roleNote: "Source is private; happy to walk through the code on a call.",
    summary:
      "A cross-platform health app with barcode food logging, workout tracking, custom diet and training plans, and smartwatch and smart-ring sync, built on Expo and Supabase.",
    description: [
      "Most health apps do one thing well: a calorie counter, a workout log, or a step tracker. Pulse puts nutrition, training, body weight and wearable data in one place, then uses them to build a plan that adjusts as you go.",
      "You can scan a barcode or search for a food, log workouts, and record weight and progress photos. Pulse reads steps, active calories, workouts and weight from Apple Health on iPhone and Health Connect on Android, which covers Apple Watch, Galaxy Watch, Pixel Watch, Oura, Whoop, Garmin and others without integrating each one separately. Friends can join a group with a six-character code and compete in challenges.",
      "It also includes Coach, an AI coach that reads your actual logs and suggests plan changes, which only apply after you tap to approve. Pulse is in open Android beta on Google Play, with iPhone coming through TestFlight.",
    ],
    stack: [
      "Expo SDK 58",
      "React Native",
      "TypeScript",
      "Expo Router",
      "Supabase",
      "PostgreSQL",
      "Row Level Security",
      "React Query",
      "Vitest",
      "EAS Build",
      "Apple HealthKit",
      "Android Health Connect",
    ],
    highlights: [
      { label: "Platforms", value: "iOS, Android and web" },
      { label: "Food sources", value: "5 merged into one search" },
      { label: "Status", value: "Open Android beta" },
    ],
    contributions: [
      "A plan engine in pure, unit-tested TypeScript: calories from Mifflin-St Jeor BMR and activity level, macros by goal and diet style, a training split chosen from days per week, experience and available equipment, and a 7-day meal plan scaled to the calorie target. Plans rebuild on every weigh-in.",
      "A food search that queries a built-in list of about 200 everyday foods, USDA FoodData Central, Open Food Facts, a shared library of foods other users scanned, and the user's own foods, then merges them into one de-duplicated, ranked list.",
      "A Supabase schema with row level security, a sign-up trigger that creates each profile, and a private storage bucket for progress photos.",
      "Groups and challenges (most steps, most workouts, longest streak, weight loss %, \u201cperfect days\u201d) with leaderboards computed inside the database.",
      "Google and Apple sign-in, and Apple Health and Health Connect sync behind one interface chosen per platform.",
    ],
    decisions: [
      {
        title: "Leaderboards never return anyone's raw logs",
        body: "Group rankings are computed by database functions that check membership first and return only scores. Row level security on personal tables stays intact, and weight loss is shared as a percentage, never as a weight.",
      },
      {
        title: "Screens never talk to the database directly",
        body: "Everything goes through one Repo interface, with a Supabase implementation and a local one for demo mode. Swapping the backend later means writing one new implementation, not touching every screen.",
      },
      {
        title: "Safety floors in the plan engine",
        body: "Weight loss is capped at 1% of body weight a week, and calories never drop below BMR or a 1,200 / 1,500 kcal floor, whatever pace the user picks.",
      },
      {
        title: "One search, many sources, graceful failure",
        body: "Results are de-duplicated by barcode or by name and similar calories. Foods with missing or inconsistent macros sink, the user's own foods and favourites rise, and if one source is down the others still show with a note.",
      },
      {
        title: "Platform hubs instead of per-device APIs",
        body: "Reading from Apple Health and Health Connect covers most watches and rings through two integrations instead of a dozen.",
      },
    ],
    limitations: [
      "AI photo food recognition is not in yet — barcode and search only for now.",
      "No direct Oura, Whoop or Garmin APIs; those are covered through Apple Health and Health Connect.",
      "Push notifications and reminders are not built.",
      "No iPhone release yet — TestFlight testing is next.",
    ],
    links: [
      { label: "Website", href: "https://pulse.rkmediacompany.com" },
      {
        label: "Join the Android beta",
        href: "https://play.google.com/store/apps/details?id=ca.rishabhkaushik.pulse",
      },
    ],
    accent: "#3b82f6",
    featured: true,
  },
];

export const projectCategories = [
  "ALL",
  ...Array.from(new Set(projects.map((p) => p.category.toUpperCase()))),
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
