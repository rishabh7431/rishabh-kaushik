/**
 * Every entry below is listed under Technical Skills on the resume.
 * Nothing has been added for effect.
 */

export type UseItem = { name: string; detail: string; url: string; tag?: string };
export type UseGroup = { index: string; title: string; kicker: string; description: string; items: UseItem[] };

export const useGroups: UseGroup[] = [
  {
    index: "01",
    title: "LANGUAGES",
    kicker: "WHAT I WRITE IN",
    description: "The languages I work in day to day.",
    items: [
      { name: "TypeScript", detail: "Primary language", url: "https://www.typescriptlang.org", tag: "Language" },
      { name: "JavaScript", detail: "Runtime and browser", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", tag: "Language" },
      { name: "Python", detail: "Scripting and data work", url: "https://www.python.org", tag: "Language" },
      { name: "Java", detail: "Object-oriented coursework", url: "https://www.java.com", tag: "Language" },
      { name: "SQL", detail: "Relational queries", url: "https://learn.microsoft.com/en-us/sql/t-sql/language-reference", tag: "Language" },
      { name: "HTML & CSS", detail: "Markup and styling", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", tag: "Language" },
    ],
  },
  {
    index: "02",
    title: "FRAMEWORKS",
    kicker: "LIBRARIES",
    description: "What I build applications with, front-end and back.",
    items: [
      { name: "React", detail: "UI library", url: "https://react.dev", tag: "Frontend" },
      { name: "Next.js", detail: "App framework", url: "https://nextjs.org", tag: "Frontend" },
      { name: "Vite", detail: "Build tooling", url: "https://vite.dev", tag: "Frontend" },
      { name: "Tailwind CSS", detail: "Styling", url: "https://tailwindcss.com", tag: "Frontend" },
      { name: "Node.js", detail: "Server runtime", url: "https://nodejs.org", tag: "Backend" },
      { name: "Express", detail: "HTTP services", url: "https://expressjs.com", tag: "Backend" },
    ],
  },
  {
    index: "03",
    title: "DATABASES",
    kicker: "& SERVICES",
    description: "Where the data lives and what the applications talk to.",
    items: [
      { name: "Azure SQL", detail: "Managed relational database", url: "https://azure.microsoft.com/en-us/products/azure-sql", tag: "Database" },
      { name: "PostgreSQL", detail: "Relational database", url: "https://www.postgresql.org", tag: "Database" },
      { name: "Azure Blob Storage", detail: "Object storage", url: "https://azure.microsoft.com/en-us/products/storage/blobs", tag: "Storage" },
      { name: "Supabase", detail: "Postgres platform", url: "https://supabase.com", tag: "Database" },
      { name: "Stripe", detail: "Payments", url: "https://stripe.com", tag: "Service" },
      { name: "Resend", detail: "Transactional email", url: "https://resend.com", tag: "Service" },
    ],
  },
  {
    index: "04",
    title: "TOOLS",
    kicker: "& PLATFORMS",
    description: "The cloud, the pipeline and the boards the work runs on.",
    items: [
      { name: "Microsoft Azure", detail: "Cloud platform", url: "https://azure.microsoft.com", tag: "Cloud" },
      { name: "Azure Container Apps", detail: "Service hosting", url: "https://azure.microsoft.com/en-us/products/container-apps", tag: "Cloud" },
      { name: "Git", detail: "Version control", url: "https://git-scm.com", tag: "VCS" },
      { name: "GitHub", detail: "Code hosting", url: "https://github.com", tag: "VCS" },
      { name: "CI/CD", detail: "Build, test, deploy", url: "https://docs.github.com/en/actions", tag: "Pipeline" },
      { name: "Jira", detail: "Sprint tracking", url: "https://www.atlassian.com/software/jira", tag: "Planning" },
      { name: "Monday.com", detail: "Work management", url: "https://monday.com", tag: "Planning" },
    ],
  },
  {
    index: "05",
    title: "AI-ASSISTED",
    kicker: "DEVELOPMENT",
    description:
      "LLM-driven code generation, debugging, test creation and documentation — part of the daily workflow, not an experiment.",
    items: [
      { name: "GitHub Copilot", detail: "In-editor completion", url: "https://github.com/features/copilot", tag: "AI" },
      { name: "Cursor", detail: "AI code editor", url: "https://cursor.com", tag: "AI" },
      { name: "Claude", detail: "Long-context work", url: "https://claude.ai", tag: "AI" },
      { name: "ChatGPT", detail: "Reasoning and drafts", url: "https://chatgpt.com", tag: "AI" },
    ],
  },
];
