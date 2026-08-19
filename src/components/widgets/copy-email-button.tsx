"use client";

import { Check, Copy } from "lucide-react";
import { site } from "@/data/site";
import { useCopy } from "@/hooks/use-copy";
import { useToast } from "@/components/ui/toast";
import { Magnetic } from "@/components/ui/magnetic";

export function CopyEmailButton() {
  const { copied, copy } = useCopy();
  const { push } = useToast();

  return (
    <Magnetic strength={0.2}>
      <button
        type="button"
        onClick={async () => {
          const ok = await copy(site.email);
          push({
            title: ok ? "Email copied" : "Copy failed",
            description: ok ? site.email : "Select the address and copy it manually.",
            variant: ok ? "success" : "error",
          });
        }}
        className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-5 py-2.5 transition-colors duration-300 hover:border-line-strong"
      >
        {copied ? (
          <Check className="size-3.5 text-accent" />
        ) : (
          <Copy className="size-3.5 text-ink-faint transition-colors group-hover:text-white" />
        )}
        <span className="font-mono text-[0.72rem] text-white">{site.email}</span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ink-faint">
          {copied ? "copied" : "tap to copy"}
        </span>
      </button>
    </Magnetic>
  );
}
