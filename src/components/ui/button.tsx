"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-white text-black hover:bg-white",
  secondary: "bg-white/[0.06] text-white border border-line hover:border-line-strong",
  ghost: "text-ink-dim hover:text-white",
  outline: "border border-line-strong text-white hover:bg-white/[0.05]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8rem]",
  md: "h-11 px-6 text-[0.875rem]",
  lg: "h-14 px-8 text-[0.95rem]",
};

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  icon?: ReactNode;
};

function Inner({
  children,
  icon,
  variant,
}: {
  children: ReactNode;
  icon?: ReactNode;
  variant: Variant;
}) {
  return (
    <>
      {/* sheen sweep on hover */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {icon && (
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            {icon}
          </span>
        )}
      </span>
    </>
  );
}

const base =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium tracking-tight transition-colors duration-300";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  magnetic = true,
  icon,
  onClick,
  type = "button",
  disabled,
}: CommonProps & {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const node = (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={cn(base, VARIANTS[variant], SIZES[size], disabled && "cursor-not-allowed opacity-50", className)}
    >
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </motion.button>
  );

  return magnetic && !disabled ? <Magnetic strength={0.22}>{node}</Magnetic> : node;
}

export function ButtonLink({
  children,
  className,
  variant = "primary",
  size = "md",
  magnetic = true,
  icon,
  href,
  external,
}: CommonProps & { href: string; external?: boolean }) {
  const isExternal = external ?? /^https?:|^mailto:/.test(href);

  const inner = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
    >
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </motion.span>
  );

  const node = isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex">
      {inner}
    </a>
  ) : (
    <Link href={href} className="inline-flex">
      {inner}
    </Link>
  );

  return magnetic ? <Magnetic strength={0.22}>{node}</Magnetic> : node;
}
