"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLaunch } from "./useLaunch";

export function Hero() {
  const { launch, label } = useLaunch();

  return (
    <section className="pb-10 pt-16 sm:pt-24">
      <Reveal>
        <h1 className="font-display text-[44px] leading-[1.04] sm:text-[62px]">
          <span className="block">Your laptop stays empty.</span>
          <span className="block sm:pl-12">The work happens elsewhere.</span>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
          Heavy software chokes weak machines. Orbit runs the app in the cloud and streams just
          pixels to your tab. Nothing installs. Nothing lingers.
        </p>
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
