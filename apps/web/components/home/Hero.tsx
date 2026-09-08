"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLaunch } from "./useLaunch";

export function Hero() {
  const { launch, label } = useLaunch();

  return (
    <section className="pb-10 pt-16 sm:pt-24">
      <Reveal>
        <h1 className="font-display text-[44px] leading-[1.04] sm:text-[60px]">
          <span className="block">You open Orbit, and there&apos;s</span>
          <span className="block sm:pl-12">a whole computer in it.</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={launch}
            className="btn-accent group flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium"
          >
            {label}
            <ArrowRight className="arr h-4 w-4" />
          </button>
          <a href="#type" className="btn-ghost rounded-full px-6 py-3 text-[14px]">
            Type something below ↓
          </a>
        </div>
      </Reveal>
    </section>
  );
}
