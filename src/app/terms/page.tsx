import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "Terms of use for rishabhkaushik.com — content ownership, permitted use, accuracy and external links.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="TERMS"
      accent="& conditions."
      updated="August 2026"
      intro="Short version: read anything, link to anything, and do not pass my work off as your own."
      sections={[
        {
          heading: "Use of this site",
          body: [
            "You are welcome to browse, read, quote and link to anything here. No account, no permission, no attribution required for reading.",
          ],
        },
        {
          heading: "Content ownership",
          body: [
            `All written content, project descriptions and original code on this site are © ${new Date().getFullYear()} ${site.name} unless stated otherwise.`,
            "Code published in public repositories is governed by the licence in that repository, which takes precedence over this page.",
            "FitCheck was built by a team of five as academic work at SAIT. The write-up here describes my contribution and the team's decisions; the project is not solely mine to license.",
            "You may quote excerpts with attribution and a link. Presenting this work as your own is not permitted.",
          ],
        },
        {
          heading: "Accuracy and no warranty",
          body: [
            "The project pages describe what was built under specific constraints, including the parts that did not work. They are not professional advice, and figures quoted are measurements from those projects rather than guarantees.",
            "This site is provided as-is, without warranty of any kind. I am not liable for any loss arising from use of the information on it.",
          ],
        },
        {
          heading: "External links",
          body: [
            "Links to third-party sites are provided for convenience. I do not control them and am not responsible for their content or their handling of your data.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms: ${site.email}.`],
        },
      ]}
    />
  );
}
