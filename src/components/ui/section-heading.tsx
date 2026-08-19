import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { GradientText } from "./gradient-text";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="up" duration={0.6}>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}

      <h2 className="display-tight text-4xl sm:text-5xl lg:text-[3.6rem]">
        <TextReveal text={title} by="word" className="block" />
        {accent && (
          <span className="mt-1 block font-serif text-[1.08em] font-normal italic tracking-[-0.02em]">
            <TextReveal
              text={accent}
              by="word"
              delay={0.14}
              wordClassName="text-gradient"
            />
          </span>
        )}
      </h2>

      {description && (
        <Reveal direction="up" delay={0.18}>
          <p
            className={cn(
              "max-w-2xl text-[0.975rem] leading-relaxed text-ink-dim",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}

      {children}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

export { GradientText };
