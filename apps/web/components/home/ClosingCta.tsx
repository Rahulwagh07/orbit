"use client";

import { Reveal } from "./Reveal";

export function ClosingCta() {
  return (
    <section className="pb-24 pt-24">
      <Reveal>
        <h2 className="font-display max-w-md text-[36px] leading-[1.08] sm:text-[42px]">
          Open a tab and your computer is already there.
        </h2>
        <p className="mt-4 text-[13px] text-muted">
          Trying it costs nothing, and when you close the tab there is nothing to uninstall.
        </p>
      </Reveal>
    </section>
  );
}
