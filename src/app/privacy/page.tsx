import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How this site handles data: page-view counts only, no cookies, no analytics script, no tracking and no mailing list.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="PRIVACY"
      accent="in plain language."
      updated="August 2026"
      intro="This is a personal portfolio, not a product. It collects almost nothing, and everything it does collect is listed below."
      sections={[
        {
          heading: "What this site stores",
          body: [
            "Page view counts: an integer per URL, so I can see which project pages get read. No identifiers, no sessions, no cookies, and no way to attribute a view to a person.",
            "That is the entire list. There is no contact form, no comments and no newsletter."
          ],
        },
        {
          heading: "What it does not store",
          body: [
            "No advertising or cross-site tracking cookies. No analytics script. No fingerprinting. No behavioural profile. No mailing list — unless you email me directly, in which case your message lives in my inbox like any other email.",
          ],
        },
        {
          heading: "Third-party services",
          body: [
            "GitHub: the site reads public repository and activity data through GitHub's API to render the activity panel. That request is made by the server, not by your browser, so GitHub does not see you.",
            "Hosting: the host may keep standard server access logs, including IP addresses, for security and abuse prevention. Those logs belong to the host and are retained under their policy.",
          ],
        },
        {
          heading: "Rate limiting",
          body: [
            "The view-count endpoint keeps a short-lived, in-memory counter keyed by a hash of your IP address to stop it being hammered. Entries expire within a minute and are never written to disk.",
          ],
        },
        {
          heading: "Contact",
          body: [`Any question about this page: ${site.email}.`],
        },
        {
          heading: "Changes",
          body: [
            "If this policy changes, the date at the top changes with it. There is no mailing list to notify, so the page itself is the record.",
          ],
        },
      ]}
    />
  );
}
