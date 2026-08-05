"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, Cpu, Globe, Code2, Terminal, HardDrive, Activity, Play, Check } from "lucide-react";

export function ProductPrinciples() {
  const [activeApp, setActiveApp] = useState<"browser" | "vscode" | "terminal">("browser");

  return (
    <section id="features" className="py-28 px-6 bg-[#09090b] relative overflow-hidden border-t border-white/10">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Engineered for freedom.
          </h2>
          <p className="mt-4 text-base md:text-lg text-zinc-400 font-normal max-w-xl mx-auto">
            Everything you need from a modern workstation, accessible directly inside your web browser.
          </p>
        </div>

        {/* Dynamic Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Interactive App Launcher (Spans 2 Columns) */}
          <div className="bento-card md:col-span-2 p-8 flex flex-col justify-between group">
            <div className="bento-card-glow absolute inset-0 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-mono text-xs text-zinc-500">01 / LAUNCH ENGINE</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Instant app execution
              </h3>
              <p className="text-sm text-zinc-400 max-w-md leading-relaxed mb-6 font-normal">
                Click any app to launch it in isolated cloud compute. No installers, no dependencies, and zero setup time.
              </p>
            </div>

            {/* Interactive Mini App Selector Inside Bento Card */}
            <div className="bg-[#09090b] rounded-xl border border-white/10 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveApp("browser")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-2 transition-all ${
                    activeApp === "browser"
                      ? "bg-white text-zinc-950 font-bold shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Chromium
                </button>
                <button
                  onClick={() => setActiveApp("vscode")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-2 transition-all ${
                    activeApp === "vscode"
                      ? "bg-white text-zinc-950 font-bold shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> VS Code
                </button>
                <button
                  onClick={() => setActiveApp("terminal")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-2 transition-all ${
                    activeApp === "terminal"
                      ? "bg-white text-zinc-950 font-bold shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" /> Terminal
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeApp}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center justify-between text-xs font-mono text-zinc-300 pt-1"
                >
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {activeApp === "browser"
                      ? "Chromium 122 — Ready in 380ms"
                      : activeApp === "vscode"
                      ? "VS Code Workspace — Synced in 410ms"
                      : "Cloud Shell bash — Ready in 290ms"}
                  </span>
                  <span className="text-indigo-400 font-bold">1 Gbps Stream</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bento Card 2: Zero Disk Usage (Spans 1 Column) */}
          <div className="bento-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="font-mono text-xs text-zinc-500">02 / DISK</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                0 MB local disk
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                Never waste gigabytes of local storage on heavy desktop software again.
              </p>
            </div>

            <div className="bg-[#09090b] rounded-xl border border-white/10 p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Local Storage</span>
                <span className="text-emerald-400 font-bold">0 MB</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-emerald-400" />
              </div>
              <div className="flex justify-between text-zinc-500 text-[10px] pt-1">
                <span>Cloud Storage: Unlimited</span>
                <span>Encrypted</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Sub-15ms Streaming (Spans 1 Column) */}
          <div className="bento-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-mono text-xs text-zinc-500">03 / STREAM</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Sub-15ms speed
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                High-definition display frames stream directly via WebRTC at 60 FPS.
              </p>
            </div>

            <div className="bg-[#09090b] rounded-xl border border-white/10 p-4 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 block">MOTION LATENCY</span>
                <span className="text-indigo-400 font-bold text-sm">11.4 ms</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block">FRAMERATE</span>
                <span className="text-emerald-400 font-bold text-sm">60 FPS</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Encrypted Cloud Sandboxes (Spans 2 Columns) */}
          <div className="bento-card md:col-span-2 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-mono text-xs text-zinc-500">04 / PRIVACY</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Isolated encrypted sandboxes
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                Your apps run in private cloud containers. Nothing touches or pollutes your physical drive, leaving zero residual files behind.
              </p>
            </div>

            <div className="bg-[#09090b] rounded-xl border border-white/10 p-4 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AES-256 Encrypted Session
              </span>
              <span className="text-zinc-500">Zero Local Trace</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}




