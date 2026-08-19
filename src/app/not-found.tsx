import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { nav, navMore } from "@/data/site";
import { ButtonLink } from "@/components/ui/button";
import { StarField } from "@/components/ui/starfield";
import { ScrambleText } from "@/components/ui/scramble-text";

export default function NotFound() {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-void px-5 py-32 text-center">
      <StarField density={0.00018} parallax={30} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 45%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <span className="eyebrow">Error · route not found</span>

        <h1 className="display-tight mt-6 text-[clamp(5rem,22vw,16rem)] leading-none text-white">
          <ScrambleText text="404" speed={1.2} />
        </h1>

        <p className="mt-2 font-serif text-[clamp(1.5rem,4vw,2.6rem)] italic text-gradient">
          this page drifted off.
        </p>

        <p className="mt-6 max-w-md text-[0.96rem] leading-relaxed text-ink-dim">
          The URL resolved to nothing. Either it moved or it never existed.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" icon={<ArrowLeft className="size-4" />}>
            Back home
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            Browse work
          </ButtonLink>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[...nav.slice(1), ...navMore].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-10 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-faint/70">
          press ⌘K to search the site
        </p>
      </div>
    </section>
  );
}
