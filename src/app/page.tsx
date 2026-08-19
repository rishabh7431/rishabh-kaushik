import { IntroCurtain } from "@/components/layout/intro-curtain";
import { Hero } from "@/components/home/hero";
import { BentoGrid } from "@/components/home/bento";
import { MarqueeBand } from "@/components/home/marquee-band";
import { AboutGlance } from "@/components/home/about-glance";
import { FeaturedWork } from "@/components/home/featured-work";
import { SiteWidgets } from "@/components/widgets/site-widgets";

export default function HomePage() {
  return (
    <>
      <IntroCurtain />
      <Hero />
      <BentoGrid />
      <MarqueeBand />
      <AboutGlance />
      <FeaturedWork />
      <SiteWidgets />
    </>
  );
}
