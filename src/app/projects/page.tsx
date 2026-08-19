import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SiteWidgets } from "@/components/widgets/site-widgets";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Two projects by Rishabh Kaushik: a TypeScript microservices platform delivered on Microsoft Azure for GBTAC, and FitCheck, an AI retail app for mobile.",
  path: "/projects",
  image: "/og/og-projects.png",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="THINGS I"
        accent="designed & built."
        ghost="WORK"
        description={`${projects.length} projects, documented in full — what the problem was, what I built, and the decisions I would have to defend in a code review.`}
      />
      <ProjectGrid />
      <SiteWidgets />
    </>
  );
}
