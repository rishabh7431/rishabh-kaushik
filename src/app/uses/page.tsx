import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { useGroups } from "@/data/uses";
import { PageHeader } from "@/components/layout/page-header";
import { SiteWidgets } from "@/components/widgets/site-widgets";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { SpotlightGroup } from "@/components/ui/spotlight";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Stack",
  description:
    "The languages, frameworks, cloud services and tools Rishabh Kaushik works with — TypeScript, React, Next.js, Node.js, Azure SQL, Git and CI/CD.",
  path: "/uses",
  image: "/og/og-uses.png",
});

export default function UsesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Technical skills"
        title="THE"
        accent="stack."
        ghost="STACK"
        description="Everything on this page is on my résumé — the languages I write in, what I build with, where the data lives, and the tools the work runs through."
      />

      <section className="w-full bg-void px-5 pb-28 pt-4 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-20">
          {useGroups.map((group) => (
            <div key={group.index}>
              <Reveal direction="up">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[0.68rem] tracking-[0.16em] text-ink-faint">
                      {group.index}
                    </span>
                    <h2 className="display-tight text-[clamp(1.6rem,3.6vw,2.4rem)] text-white">
                      {group.title}
                      <span className="ml-3 font-serif text-[0.7em] font-normal italic text-ink-faint">
                        {group.kicker}
                      </span>
                    </h2>
                  </div>
                  <p className="max-w-md text-[0.9rem] text-ink-dim">{group.description}</p>
                </div>
              </Reveal>

              <SpotlightGroup className="mt-8" color="rgba(36,209,126,0.09)" size={420}>
                <StaggerGroup className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <StaggerItem key={item.name}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        data-cursor-label="Open"
                        className="group relative flex h-full items-center justify-between gap-4 bg-[#070707] p-5 transition-colors duration-400 hover:bg-[#0d0d0d]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[1rem] font-medium text-white">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint">
                            {item.detail}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2.5">
                          {item.tag && (
                            <span className="hidden rounded-md border border-line px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-ink-faint sm:inline">
                              {item.tag}
                            </span>
                          )}
                          <ArrowUpRight className="size-3.5 text-ink-faint transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                        </span>
                      </a>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </SpotlightGroup>
            </div>
          ))}
        </div>
      </section>

      <SiteWidgets />
    </>
  );
}
