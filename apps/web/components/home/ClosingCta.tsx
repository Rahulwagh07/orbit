"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLaunch } from "./useLaunch";

export function ClosingCta() {
  const { launch, label } = useLaunch();

  return (
    <section className="pb-24 pt-24">
      <Reveal>
        <h2 className="font-display max-w-md text-[36px] leading-[1.08] sm:text-[42px]">
          Open a tab. There&apos;s your computer.
        </h2>
        <div className="mt-7">
          <button
            onClick={launch}
            className="btn-accent group flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-medium"
          >
            {label}
            <ArrowRight className="arr h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-[13px] text-muted">
          Free to try. No install. Close the tab and it&apos;s gone.
        </p>
      </Reveal>
    </section>
  );
}
