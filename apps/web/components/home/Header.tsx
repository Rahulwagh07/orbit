"use client";

import { ArrowRight } from "lucide-react";
import { useLaunch } from "./useLaunch";

export function Header() {
  const { launch, label, isLoading } = useLaunch();

  return (
    <header>
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-surface">
            ○
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Orbit</span>
        </a>
        <nav className="hidden items-center gap-6 text-[13.5px] text-muted sm:flex">
          <a href="#type" className="u-link">
            Type
          </a>
          <a href="#compare" className="u-link">
            Compare
          </a>
        </nav>
        {!isLoading ? (
          <button
            onClick={launch}
            className="btn-accent group flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium"
          >
            {label}
            <ArrowRight className="arr h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="h-8 w-28 animate-pulse rounded-full bg-line" />
        )}
      </div>
    </header>
  );
}
