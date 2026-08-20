import { isBookingConfigured, site } from "./site";

export type LinkCard = {
  id: string;
  label: string;
  handle: string;
  url: string;
  description: string;
  accent: string;
  icon: "github" | "linkedin" | "mail" | "file" | "calendar";
};

/** Only the contact details that appear on the resume, plus the GitHub account that hosts FitCheck. */
const baseCards: LinkCard[] = [
  {
    id: "email",
    label: "Email",
    handle: site.email,
    url: `mailto:${site.email}`,
    description: "The fastest way to reach me. I read everything and reply to real messages.",
    accent: "#24d17e",
    icon: "mail",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: `/in/${site.socials.linkedin.handle}`,
    url: site.socials.linkedin.url,
    description: "Roles, timeline and the professional trail, in the formal format.",
    accent: "#0a66c2",
    icon: "linkedin",
  },
  {
    id: "github",
    label: "GitHub",
    handle: `@${site.socials.github.handle}`,
    url: site.socials.github.url,
    description: "Where the code lives, including the FitCheck source.",
    accent: "#ffffff",
    icon: "github",
  },
  {
    id: "resume",
    label: "Résumé",
    handle: "PDF",
    url: site.resumeUrl,
    description: "One page: skills, experience, education and professional development.",
    accent: "#3b82f6",
    icon: "file",
  },
];

/** Booking card, shown only once site.bookingUrl is filled in. */
const bookingCard: LinkCard = {
  id: "booking",
  label: "Book a Time",
  handle: "Live calendar",
  url: site.bookingUrl,
  description: "Pick a slot that works for you and it lands straight in my calendar.",
  accent: "#a855f7",
  icon: "calendar",
};

export const linkCards: LinkCard[] = isBookingConfigured()
  ? [bookingCard, ...baseCards]
  : baseCards;
