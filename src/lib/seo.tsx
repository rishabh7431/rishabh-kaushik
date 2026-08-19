import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Shared metadata builder so every route ships a canonical URL, a unique
 * description and its own Open Graph image without repeating boilerplate.
 *
 * Note: no `twitter:` tags are emitted. Twitter/X falls back to Open Graph
 * when they are absent, and there is no X account to credit.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = "/og/og-default.png",
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
}): Metadata {
  const url = `${site.url.replace(/\/$/, "")}${path}`;
  const desc = metaDescription(description);

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      url,
      title: `${title} · ${site.name}`,
      description: desc,
      siteName: site.name,
      locale: "en_CA",
      images: [{ url: image, width: 1200, height: 630, alt: `${title} — ${site.name}` }],
      ...(publishedTime ? { publishedTime } : {}),
    },
  };
}

/**
 * Renders structured data as a real <script type="application/ld+json"> in the
 * server HTML — the pattern Next.js documents. Using next/script here would
 * defer it into a client-side JS payload, which crawlers should not have to
 * execute in order to read it.
 */
export function JsonLd({ data, id }: { data: Record<string, unknown>; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Search results truncate around 155-160 characters. Trim on a word boundary
 * so a description is never cut mid-word in a SERP.
 */
export function metaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : cut.length).replace(/[,;:—-]$/, "")}…`;
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  const base = site.url.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${base}${t.path}`,
    })),
  };
}
