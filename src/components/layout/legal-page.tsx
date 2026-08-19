import type { ReactNode } from "react";
import { PageHeader } from "./page-header";
import { Reveal } from "@/components/ui/reveal";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  eyebrow,
  title,
  accent,
  updated,
  intro,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <>
      <PageHeader
        compact
        width="prose"
        eyebrow={eyebrow}
        title={title}
        accent={accent}
        ghost="LEGAL"
        description={intro}
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
          Last updated · {updated}
        </span>
      </PageHeader>

      <section className="w-full bg-void px-5 pb-28 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {sections.map((section, i) => (
            <Reveal key={section.heading} direction="up" delay={i * 0.04}>
              <div>
                <h2 className="display-tight text-[1.4rem] text-white">
                  <span className="mr-3 font-mono text-[0.68rem] tracking-[0.16em] text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((para, j) => (
                    <p key={j} className="text-[0.98rem] leading-relaxed text-ink-dim">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          {children}
        </div>
      </section>
    </>
  );
}
