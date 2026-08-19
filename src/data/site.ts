/**
 * Every string in this file is taken from Rishabh Kaushik's resume
 * (Software Developer, Calgary AB) or the FitCheck project write-up.
 * Nothing here is invented — if a claim is not on one of those two
 * documents, it does not belong in this file.
 */

export const site = {
  name: "Rishabh Kaushik",
  firstName: "Rishabh",
  lastName: "Kaushik",
  initials: "RK",
  title: "Rishabh Kaushik — Software Developer",
  role: "SOFTWARE DEVELOPER",
  roleSecondary: "SAIT GRADUATE, AUGUST 2026",
  tagline: "CALGARY, AB",
  location: { city: "Calgary", region: "AB", country: "Canada", timezone: "America/Edmonton" },
  email: "rishabhkaushik33@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Software developer in Calgary, AB. Recent SAIT graduate building applications on Microsoft Azure with TypeScript, React, Node.js and SQL.",
  keywords: [
    "Rishabh Kaushik",
    "Software Developer",
    "Calgary",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Microsoft Azure",
    "SAIT",
    "Full Stack Developer",
  ],

  // Hero — drawn from the resume's professional summary.
  heroLineOne: "I TURN BUSINESS REQUIREMENTS INTO",
  heroLineTwo: "working software.",

  // Contact card
  ctaHeading: "OPEN TO",
  ctaAccent: "developer roles.",

  // About glance
  aboutEyebrow: "A QUICK GLANCE",
  aboutHeading: "End-to-end delivery,",
  aboutAccent: "on the Microsoft stack.",

  footerNote:
    "Recent software development graduate seeking to grow on the Microsoft cloud stack, including Power Platform and SharePoint.",
  footerTagline: "Requirements in, working software out.",

  resumeUrl: "/Rishabh-Kaushik-Resume.pdf",
  avatar: "/images/avatar.svg",

  /**
   * Live booking link. Paste a scheduling URL here and every "Let's Get in Touch"
   * control on the site becomes a real booking link. Leave it empty and those
   * controls fall back to opening an email — so the site is never broken while
   * you decide.
   *
   *   Cal.com    → https://cal.com/<your-handle>/30min
   *   Calendly   → https://calendly.com/<your-handle>/30min
   *   Google     → https://calendar.app.google/<id>
   *
   * It can also be supplied at build time via NEXT_PUBLIC_BOOKING_URL.
   */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  bookingLabel: "Let's Get in Touch",

  socials: {
    github: { label: "GitHub", handle: "rishabh7431", url: "https://github.com/rishabh7431" },
  },
} as const;

export const githubUsername = process.env.GITHUB_USERNAME ?? site.socials.github.handle;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/projects" },
] as const;

export const navMore = [
  { label: "Stack", href: "/uses", hint: "Tools" },
  { label: "Links", href: "/links", hint: "Contact" },
] as const;

export const footerNav = {
  General: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Work", href: "/projects" },
  ],
  More: [
    { label: "Stack", href: "/uses" },
    { label: "Links", href: "/links" },
    { label: "Résumé", href: "/Rishabh-Kaushik-Resume.pdf" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;

/** Marquee band — technologies listed under Technical Skills on the resume. */
export const marqueeWords = [
  "TYPESCRIPT",
  "REACT",
  "NEXT.JS",
  "NODE.JS",
  "PYTHON",
  "SQL",
  "MICROSOFT AZURE",
  "REST APIs",
  "CI/CD",
  "AGILE DELIVERY",
] as const;

/**
 * Workspace card tabs. Each group maps to a section of the resume's
 * Technical Skills block; "focus" lines come from Concepts.
 */
export const workspaceTabs = [
  {
    id: "build",
    label: "BUILD",
    icon: "code",
    heading: "LANGUAGES & FRAMEWORKS",
    items: ["TypeScript & JavaScript", "React, Next.js, Vite", "Node.js & Express", "Python, Java, SQL"],
    focus: ["Requirements to software", "REST APIs", "As-built documentation"],
    graph: { left: ["FRONTEND", "BACKEND", "API"], right: "SHIP" },
  },
  {
    id: "cloud",
    label: "CLOUD",
    icon: "cloud",
    heading: "DATABASES & SERVICES",
    items: ["Azure SQL & Blob Storage", "Azure Container Apps", "PostgreSQL & Supabase", "Stripe, Resend"],
    focus: ["Microsoft Azure", "Relational databases", "CI/CD build, test, deploy"],
    graph: { left: ["AZURE", "SQL", "STORAGE"], right: "CLOUD" },
  },
  {
    id: "ai",
    label: "AI",
    icon: "sparkles",
    heading: "AI-ASSISTED DEVELOPMENT",
    items: ["GitHub Copilot", "Cursor", "Claude", "ChatGPT"],
    focus: ["LLM-driven code generation", "Debugging & test creation", "Documentation"],
    graph: { left: ["CODE", "TESTS", "DOCS"], right: "COPILOT" },
  },
  {
    id: "team",
    label: "TEAM",
    icon: "users",
    heading: "TOOLS & DELIVERY",
    items: ["Git & GitHub", "Jira", "Monday.com", "CI/CD pipelines"],
    focus: ["Agile delivery", "Automated testing and QA", "Version control"],
    graph: { left: ["SPRINTS", "REVIEW", "QA"], right: "AGILE" },
  },
] as const;

/**
 * Resolves the destination for every "Let's Get in Touch" control.
 * Returns the booking link when one is configured, otherwise a mailto.
 */
export function contactHref() {
  return site.bookingUrl ? site.bookingUrl : `mailto:${site.email}`;
}

export function isBookingConfigured() {
  return Boolean(site.bookingUrl);
}
