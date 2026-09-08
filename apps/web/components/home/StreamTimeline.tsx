"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "./Reveal";

const STEPS = [
  { t: "0.0s", title: "Open the link", body: "Any browser, any weak laptop. Nothing to install." },
  { t: "0.4s", title: "Pick an app", body: "Chromium, VS Code, terminal. A container boots for you." },
  { t: "0.8s", title: "Stream starts", body: "Video down, keystrokes up. Feels local." },
  { t: "later", title: "Close, resume anywhere", body: "State stays in the cloud. Nothing left behind." },
];

export function StreamTimeline() {
  const [i, setI] = useState(2);

  return (
    <section className="mt-16">
      <div className="h-px w-10 bg-tick" />
      <Reveal>
        <div className="mt-6">
          <h2 className="text-[15px] font-semibold tracking-tight">Drag from open to resume.</h2>
          <div className="mt-4">
            <div className="min-h-[86px]">
              <p className="font-mono text-[11px] text-accent">{STEPS[i]!.t}</p>
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-display text-[26px] leading-tight">{STEPS[i]!.title}</h3>
                <p className="mt-1 text-[15px] text-muted">{STEPS[i]!.body}</p>
              </motion.div>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              className="scrub mt-5"
              aria-label="Scrub the launch timeline"
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
              <span>open</span>
              <span>pick</span>
              <span>stream</span>
              <span>resume</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
