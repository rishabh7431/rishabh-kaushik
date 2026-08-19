import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GitBranch, GraduationCap, Users } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { PageHeader } from "@/components/layout/page-header";
import { GithubSection } from "@/components/widgets/github-section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { Badge, Tag } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ViewCounter } from "@/components/widgets/view-counter";
import { JsonLd, breadcrumbs, pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: `/og/og-${project.slug}.png`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const base = site.url.replace(/\/$/, "");

  const projectLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    headline: `${project.title} — ${project.subtitle}`,
    description: project.summary,
    url: `${base}/projects/${project.slug}`,
    image: `${base}/og/og-${project.slug}.png`,
    dateCreated: project.year,
    programmingLanguage: project.stack,
    keywords: project.stack.join(", "),
    author: { "@type": "Person", name: site.name, url: base },
    ...(project.repo ? { codeRepository: project.repo } : {}),
  };

  const crumbsLd = breadcrumbs([
    { name: "Home", path: "/" },
    { name: "Work", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return (
    <>
      <PageHeader
        compact
        eyebrow={`${project.index} · ${project.category} · ${project.year}`}
        title={project.title}
        accent={project.subtitle.toLowerCase() + "."}
        ghost={project.index}
        description={project.summary}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge dot dotColor={project.accent} pulse={project.status === "Delivered"}>
            {project.status}
          </Badge>
          <Badge>
            <Users className="size-3" /> {project.role}
          </Badge>
          <Badge>
            {project.repo ? (
              <>
                <GitBranch className="size-3" /> Public repo
              </>
            ) : (
              <>
                <GraduationCap className="size-3" /> {project.team}
              </>
            )}
          </Badge>
          <ViewCounter path={`/projects/${project.slug}`} />
        </div>
      </PageHeader>

      <article className="w-full bg-void px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <StaggerGroup className="grid gap-4 border-y border-line py-8 sm:grid-cols-3">
            {project.highlights.map((h) => (
              <StaggerItem key={h.label}>
                <p className="eyebrow">{h.label}</p>
                <p className="display-tight mt-2 text-[1.5rem] text-white">{h.value}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-14 grid items-start gap-14 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="flex flex-col gap-5">
              <Reveal direction="up">
                <h2 className="eyebrow">Overview</h2>
              </Reveal>
              {project.description.map((para, i) => (
                <Reveal key={i} direction="up" delay={0.05 + i * 0.05}>
                  <p className="text-[1rem] leading-relaxed text-ink-dim">{para}</p>
                </Reveal>
              ))}

              <Reveal direction="up" delay={0.2}>
                <h2 className="eyebrow mt-8">What I built</h2>
              </Reveal>
              <ul className="flex flex-col gap-3">
                {project.contributions.map((c, i) => (
                  <Reveal key={c} direction="up" delay={0.22 + i * 0.04} as="li">
                    <span className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-dim">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full"
                        style={{ background: project.accent }}
                      />
                      {c}
                    </span>
                  </Reveal>
                ))}
              </ul>

              {project.decisions && project.decisions.length > 0 && (
                <>
                  <Reveal direction="up">
                    <h2 className="eyebrow mt-10">Decisions worth explaining</h2>
                  </Reveal>
                  <div className="flex flex-col gap-7">
                    {project.decisions.map((d, i) => (
                      <Reveal key={d.title} direction="up" delay={0.04 + i * 0.04}>
                        <div className="border-l border-line pl-5">
                          <h3 className="text-[1.05rem] font-semibold leading-snug text-white">
                            {d.title}
                          </h3>
                          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-dim">{d.body}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </>
              )}

              {project.limitations && project.limitations.length > 0 && (
                <>
                  <Reveal direction="up">
                    <h2 className="eyebrow mt-10">What it does not do</h2>
                  </Reveal>
                  <ul className="flex flex-col gap-3">
                    {project.limitations.map((l, i) => (
                      <Reveal key={l} direction="up" delay={0.04 + i * 0.04} as="li">
                        <span className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-dim">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-faint" />
                          {l}
                        </span>
                      </Reveal>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside className="flex flex-col gap-8 lg:sticky lg:top-24">
              <Reveal direction="up" delay={0.1}>
                <div className="card-surface grain p-6">
                  <p className="eyebrow">Stack</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>

                  <div className="mt-7 border-t border-line pt-6">
                    <p className="eyebrow">Role</p>
                    <p className="mt-2 text-[0.92rem] text-white/90">{project.role}</p>
                    <p className="mt-1 text-[0.85rem] text-ink-faint">{project.team}</p>
                  </div>

                  <div className="mt-7 flex flex-col gap-2.5 border-t border-line pt-6">
                    {project.repo ? (
                      <ButtonLink
                        href={project.repo}
                        variant="secondary"
                        size="sm"
                        icon={<ArrowUpRight className="size-3.5" />}
                        className="w-full"
                        magnetic={false}
                      >
                        View repository
                      </ButtonLink>
                    ) : (
                      <p className="text-[0.85rem] leading-relaxed text-ink-faint">
                        Built for a client team, so the repository is not public. Happy to walk
                        through the architecture on a call.
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.18}>
                <Link
                  href={`/projects/${next.slug}`}
                  className="card-surface grain group block p-6"
                  data-cursor="hover"
                  data-cursor-label="Next"
                >
                  <p className="eyebrow">Next project</p>
                  <p className="display-tight mt-2 text-[1.6rem] text-white">{next.title}</p>
                  <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
                    {next.category}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.82rem] text-ink-dim transition-colors group-hover:text-white">
                    Continue
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            </aside>
          </div>

          <Reveal direction="up" className="mt-16">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-faint transition-colors hover:text-white"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              All projects
            </Link>
          </Reveal>
        </div>
      </article>

      <GithubSection />

      <JsonLd id={`ld-project-${project.slug}`} data={projectLd} />
      <JsonLd id={`ld-crumbs-${project.slug}`} data={crumbsLd} />
    </>
  );
}
