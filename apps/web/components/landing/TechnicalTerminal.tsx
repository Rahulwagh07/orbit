"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const presets = [
  {
    cmd: "cloud launch browser --mode=private",
    output: [
      "→ Requesting secure cloud browser instance...",
      "→ Encrypted session created in region us-east-1",
      "→ 1 Gbps gigabit network channel connected",
      "→ Chromium browser ready in 400ms",
      "✓ Instant browser session ACTIVE",
    ],
  },
  {
    cmd: "cloud launch workspace --sync=true",
    output: [
      "→ Syncing your cloud workspace state...",
      "→ Restoring active windows and tabs from previous session...",
      "→ VS Code and desktop tools ready",
      "✓ Workstation fully restored with zero local storage footprint",
    ],
  },
  {
    cmd: "cloud status --privacy",
    output: [
      "• Local Hard Drive: Zero files downloaded (0 MB used)",
      "• Local Hardware:  Zero CPU/GPU strain",
      "• Network:         AES-256-GCM Encrypted Web Stream",
      "✓ System Status:   100% PRIVATE & SECURE",
    ],
  },
];

export function TechnicalTerminal() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<string[]>(presets[0]!.output);

  const runPreset = async (idx: number) => {
    if (isRunning) return;
    setActiveIdx(idx);
    setIsRunning(true);
    setDisplayedLines([]);

    const targetOutput = presets[idx]!.output;
    for (let i = 0; i < targetOutput.length; i++) {
      await new Promise((r) => setTimeout(r, 220));
      setDisplayedLines((prev) => [...prev, targetOutput[i]!]);
    }
    setIsRunning(false);
  };

  return (
    <section id="terminal" className="py-28 px-6 bg-[#09090b] text-white overflow-hidden border-t border-white/10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Column: Interactive Terminal Sandbox */}
        <div className="flex-1 w-full relative">
          <div className="bg-[#121215] rounded-2xl border border-white/10 p-6 font-mono text-xs shadow-2xl overflow-hidden min-h-[300px] flex flex-col">
            {/* Terminal Window Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="text-zinc-500 text-[11px] ml-2 font-mono">orbit-cli</span>
              </div>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                ACTIVE
              </span>
            </div>

            {/* Terminal Command Output */}
            <div className="flex-1 space-y-2 text-zinc-300">
              <div className="text-white flex items-center gap-2 font-bold">
                <span className="text-indigo-400">$</span>
                <span>{presets[activeIdx]!.cmd}</span>
              </div>

              <div className="space-y-1.5 pt-2">
                {displayedLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      line.startsWith("✓")
                        ? "text-emerald-400 font-bold"
                        : line.startsWith("•")
                        ? "text-zinc-200"
                        : "text-zinc-400"
                    }
                  >
                    {line}
                  </motion.div>
                ))}
              </div>

              {isRunning && (
                <div className="inline-block w-2 h-4 bg-indigo-400 animate-pulse align-middle ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Triggers */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Control your workspace <br />
            with precision commands.
          </h2>

          <p className="text-sm md:text-base text-zinc-400 font-normal leading-relaxed">
            Whether you use our clean web interface or shortcuts, Orbit gives you total control over your cloud session.
          </p>

          {/* Action Triggers */}
          <div className="space-y-2 pt-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => runPreset(idx)}
                disabled={isRunning}
                className={`w-full p-3.5 rounded-xl border text-left font-mono text-xs flex items-center justify-between transition-all ${
                  activeIdx === idx
                    ? "bg-white/10 border-white/20 text-white font-bold shadow-md"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>$ {p.cmd}</span>
                <Play className="w-3.5 h-3.5 text-zinc-300 fill-zinc-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




