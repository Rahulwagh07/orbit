"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { Terminal } from "./Terminal";

export function TypeDemo() {
  const [launched, setLaunched] = useState<string | null>(null);

  return (
    <section id="type" className="mt-20 scroll-mt-20">
      <Reveal>
        <h2 className="font-display text-[32px] leading-tight sm:text-[36px]">
          What happens if you type here?
        </h2>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted">
          This box listens. Try <span className="font-mono text-[13px] text-ink">help</span>, then{" "}
          <span className="font-mono text-[13px] text-ink">launch vscode</span>.
          {launched && (
            <>
              {" "}
              Last opened: <span className="font-mono text-[13px] text-accent">{launched}</span>.
            </>
          )}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <div className="mt-6">
          <Terminal onLaunch={setLaunched} />
        </div>
      </Reveal>
    </section>
  );
}
