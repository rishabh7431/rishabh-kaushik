/**
 * Two projects, both documented.
 *  - GBTAC platform: from the Professional Experience section of the resume.
 *  - FitCheck: from the FitCheck project write-up.
 * No other project is claimed anywhere on this site.
 */

export type ProjectStatus = "Delivered" | "Academic Project";

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
    slug: "fitcheck",
    index: "02",
    title: "FitCheck",
    subtitle: "AI retail for mobile",
    category: "Mobile / AI",
    year: "2026",
    status: "Academic Project",
    role: "Team of 5",
    team: "SAIT · Emerging Trends in Software Development",
    summary:
      "A working Android shopping app with conversational search, occasion-aware styling and photorealistic virtual try-on — every AI feature optional, sitting on top of a deterministic engine that runs on the phone.",
    description: [
      "Online clothing shops are very good at “show me black dresses under $100” and very poor at “what should I wear to dinner at a Michelin-starred restaurant?” The first is a database query. The second is a judgement — and it is the reason people still shop in physical stores, where a member of staff can look at them and answer it.",
      "FitCheck is a working Android shopping app that attempts the second question. It has three AI features: a search that reads a plain-English request and then asks a language model which of the results genuinely suit the occasion; a Smart Closet that styles what a customer already owns against an occasion and the weather they describe; and a virtual try-on that renders a photorealistic studio photograph of the customer wearing a garment.",
      "The finding I care about is not that the models work. It is that they can be made optional. Every AI feature sits on top of a deterministic engine that runs on the phone, so the app is fully usable with no network, no API key and no running cost. The model improves the answer; it is never required to produce one.",
      "Underneath sits an ordinary retail spine — 35 products across two departments, per-variant stock, filtering and sorting, favourites, a bag, a validated delivery address and a placed order. The AI features are only interesting attached to something real.",
    ],
    stack: [
      "React Native 0.81",
      "Expo SDK 54",
      "React 19",
      "TypeScript 5.9",
      "expo-router",
      "Zustand",
      "Firebase Auth",
      "Gemini 2.5 Flash",
      "Replicate",
      "Vercel Functions",
      "EAS Build",
    ],
    highlights: [
      { label: "Catalogue", value: "35 products, 2 departments" },
      { label: "Offline", value: "Fully usable, no API key" },
      { label: "Shown at", value: "Emergex, August 2026" },
    ],
    contributions: [
      "Conversational search — “Outfit for Calgary in December” resolves into a season and a warmth requirement. Because the catalogue contains nothing rated for that cold, the app says so plainly and recommends layering a coat it does not sell.",
      "Smart Closet — turns a customer's order history into a wardrobe and styles it against an occasion and weather described in their own words.",
      "Photorealistic try-on — takes a full-body photograph and returns a studio photograph of that person wearing the garment: same face, same build, correct colour, seamless backdrop, commercial colour grading.",
      "A deterministic layer between the interface and the network — a query parser, a product ranker, a rule-based stylist and a size calculator. Every AI feature calls into that layer first and reaches the network only if a proxy is configured.",
      "One error type for every model failure — no key, no network, a timeout, a rate limit — with every caller catching it and falling through to the engine on the device.",
      "A rebuilt product data pipeline that reads colour off the product photograph: chroma-keying the background, eroding the edge halo, grouping shades of one fabric together, and naming the result by hue rather than RGB distance.",
    ],
    decisions: [
      {
        title: "The engine narrows; the model chooses among what it narrowed to",
        body: "I could have handed the model the whole catalogue and asked it to pick. Instead the ranker produces a shortlist and the model chooses within it, with its answer intersected against that shortlist before anything renders. A stylist that recommends a garment the shop does not stock is worse than no stylist — this makes that structurally impossible rather than merely unlikely. Tested by feeding it invented product identifiers, none of which reach the screen.",
      },
      {
        title: "Body measurements are never transmitted",
        body: "Size recommendation could have been a model call. It is arithmetic against a size chart, computed on the device, and the measurements are excluded from every request — specifically because the provider's free tier states that submitted content may be used to improve their products. A customer's waist measurement is not mine to contribute to a training set.",
      },
      {
        title: "Secrets live server-side because an APK can be unzipped",
        body: "The app never holds a key. A pair of serverless functions adds them. When a token was once pasted into the wrong configuration field and echoed into the UI, I added shape validation and redaction so no string with the provider's token prefix can reach a log or a screen.",
      },
      {
        title: "Prompts are code with unusually bad error messages",
        body: "Two early versions of the try-on prompt issued instructions — “replace their outfit”, then “remove every garment”. The first was satisfied by compositing a dress over the joggers already in the photo. The second was taken literally enough to remove the subject's legs. The working version contains no destructive verbs at all: it describes the photograph that should exist, including an explicit statement that the subject's limbs are present and correctly proportioned.",
      },
      {
        title: "Filters exclude; judgements rank",
        body: "A search for “dresses” returned handbags for some time, because matching the women's department scored +30 while missing the category scored −25 and the remainder cleared the relevance threshold. Department, category, colour, size, budget and sale are literal properties a shopper can point at, so they now exclude. Occasion, warmth, formality and free text are judgements, so they only rank. When a combination has no stock the app concedes one constraint at a time and names the one it gave up.",
      },
      {
        title: "Testing across the whole catalogue, not one product",
        body: "The domain logic is written as pure functions, separate from the React components, so the real source can be compiled and executed directly against the real catalogue. Generating the try-on prompt for all 35 items is what exposed a naive singularisation producing “dresse”, the word “Occasion” being treated as a garment, “suitable” being read as “suit”, and sunglasses being described as opaque fabric. A single-product test finds none of these.",
      },
    ],
    limitations: [
      "Payment processing is deliberately out of scope — handling card data brings PCI-DSS obligations that are not a reasonable undertaking here, so checkout validates and records a real order and stops before taking payment.",
      "Orders live on the device, so they do not follow a customer to a second phone.",
      "The try-on renders one garment rather than a complete outfit, and image models are not deterministic: the same request twice gives two different photographs.",
      "Generative image models are trained on datasets that over-represent some body types and skin tones. The prompt instructs the model that the subject's build, skin tone, age and ethnicity are unchanged, but whether that instruction holds equally well across all customers is not something five people testing on themselves can establish.",
    ],
    repo: "https://github.com/rishabh7431/fitcheck_pwa",
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
