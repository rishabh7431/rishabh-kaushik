import type { Metadata, Viewport } from "next";
import { sans, display, serif, mono } from "@/lib/fonts";
import { site } from "@/data/site";
import { JsonLd, metaDescription } from "@/lib/seo";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { PageTransition } from "@/components/layout/page-transition";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: metaDescription(site.description),
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  referrer: "origin-when-cross-origin",
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_CA",
    url: site.url,
    title: site.title,
    description: metaDescription(site.description),
    siteName: site.name,
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.role.toLowerCase()}`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const base = site.url.replace(/\/$/, "");

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/#person`,
    name: site.name,
    givenName: site.firstName,
    familyName: site.lastName,
    url: base,
    image: `${base}/og/og-default.png`,
    email: `mailto:${site.email}`,
    jobTitle: "Software Developer",
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: "CA",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "SAIT (Southern Alberta Institute of Technology)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Calgary",
        addressRegion: "AB",
        addressCountry: "CA",
      },
    },
    knowsAbout: [
      "TypeScript",
      "JavaScript",
      "Python",
      "React",
      "Next.js",
      "Node.js",
      "SQL",
      "Microsoft Azure",
      "REST APIs",
      "Agile delivery",
      "Automated testing",
    ],
    sameAs: [site.socials.github.url],
  };

  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: site.title,
    description: site.description,
    inLanguage: "en-CA",
    publisher: { "@id": `${base}/#person` },
  };

  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${display.variable} ${serif.variable} ${mono.variable}`}
    >
      {/*
        Browser extensions (ColorZilla, Grammarly, password managers) stamp their
        own attributes onto <body> before React hydrates, which React reports as a
        hydration mismatch even though the markup we sent is correct.

        suppressHydrationWarning applies to THIS element only — one level deep. It
        silences attribute noise on <body> itself and does not hide genuine
        mismatches anywhere in the tree below it.
      */}
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <ToastProvider>
            <SmoothScroll />
            <CustomCursor />
            <ScrollProgress />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main" className="relative w-full">
              <PageTransition>{children}</PageTransition>
            </main>
          <Footer />
        </ToastProvider>
        <JsonLd id="ld-person" data={personLd} />
        <JsonLd id="ld-website" data={siteLd} />
      </body>
    </html>
  );
}
