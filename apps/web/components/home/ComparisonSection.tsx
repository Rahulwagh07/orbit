"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "./Reveal";

const MODES = ["local", "orbit"] as const;

type Mode = (typeof MODES)[number];

const ROWS: Record<Mode, [string, string][]> = {
  orbit: [
    ["CPU load", "2%"],
    ["Disk used", "0 MB"],
    ["Open VS Code", "0.4s"],
  ],
  local: [
    ["CPU load", "87%"],
    ["Disk used", "4.2 GB"],
    ["Open VS Code", "install…"],
  ],
};

const TAB_LABELS: Record<Mode, string> = {
  local: "This laptop does it",
  orbit: "Orbit does it",
};

export function ComparisonSection() {
  const [mode, setMode] = useState<Mode>("orbit");

  return (
    <section id="compare" className="mt-16 scroll-mt-20">
      <Reveal>
        <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
          <h2 className="font-display text-[30px] leading-tight">Same laptop, two readings.</h2>
          <p className="text-[14.5px] leading-relaxed text-muted">
            A like-for-like open of the same project. Flip it.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <div className="mt-6">
          <div className="rounded-xl bg-surface">
            <div className="flex border-b border-line">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 px-4 py-2.5 text-[13px] transition-colors ${
                    mode === m ? "tab-active font-semibold text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {TAB_LABELS[m]}
                </button>
              ))}
            </div>
            <div className="divide-y divide-divider px-5">
              {ROWS[mode].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-3 text-[13.5px]">
                  <span className="text-muted">{k}</span>
                  <motion.span
                    key={mode + k}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-ink"
                  >
                    {v}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
