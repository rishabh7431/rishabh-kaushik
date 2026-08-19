import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { linkCards } from "@/data/links";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { SiteWidgets } from "@/components/widgets/site-widgets";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { GithubIcon } from "@/components/ui/social-icons";
import { CalendarDays, FileText, Mail } from "lucide-react";
import { CopyEmailButton } from "@/components/widgets/copy-email-button";

export const metadata: Metadata = pageMetadata({
  title: "Links",
  description:
    "Contact Rishabh Kaushik — email, GitHub and a downloadable résumé. Software Developer based in Calgary, AB.",
  path: "/links",
  image: "/og/og-links.png",
});

const ICONS = {
  github: GithubIcon,
  mail: Mail,
  file: FileText,
  calendar: CalendarDays,
} as const;

export default function LinksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="GET IN"
        accent="touch."
        ghost="LINKS"
        description="Email is the fastest route to me. The résumé has the full detail, and GitHub has the code."
      >
        <CopyEmailButton />
      </PageHeader>

      <section className="w-full bg-void px-5 pb-28 pt-4 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {linkCards.map((card) => {
              const Icon = ICONS[card.icon];
              return (
                <StaggerItem key={card.id}>
                  <TiltCard intensity={6} glowColor={`${card.accent}22`} className="h-full">
                    <a
                      href={card.url}
                      target={card.url.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      data-cursor-label="Visit"
                      className="card-surface grain group flex h-full flex-col p-7"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                        style={{ background: `linear-gradient(90deg, ${card.accent}, transparent)` }}
                      />

                      <span
                        className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.03] transition-transform duration-500 group-hover:scale-105"
                        style={{ color: card.accent }}
                      >
                        <Icon className="size-[19px]" />
                      </span>

                      <h2 className="display-tight mt-6 text-[1.5rem] text-white">{card.label}</h2>
                      <p className="mt-1 truncate font-mono text-[0.68rem] text-ink-faint">
                        {card.handle}
                      </p>
                      <p className="mt-4 flex-1 text-[0.9rem] leading-relaxed text-ink-dim">
                        {card.description}
                      </p>

                      <span className="mt-6 inline-flex items-center justify-between border-t border-line pt-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint transition-colors group-hover:text-white">
                        {card.id === "email"
                          ? "Compose"
                          : card.id === "resume"
                            ? "Open PDF"
                            : card.id === "booking"
                              ? "Pick a time"
                              : "Visit"}
                        <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </a>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      <SiteWidgets />
    </>
  );
}
