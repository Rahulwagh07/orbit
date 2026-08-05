"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Cpu, HardDrive, ShieldCheck, Zap, RefreshCw, Terminal, Check } from "lucide-react";

export function InteractivePlayground() {
  const [vcpu, setVcpu] = useState<number>(8);
  const [memory, setMemory] = useState<number>(16);
  const [hasGpu, setHasGpu] = useState<boolean>(true);
  const [appPreset, setAppPreset] = useState<string>("chromium");

  const computedFps = hasGpu ? 60 : 30;
  const computedLatency = vcpu >= 16 ? "9 ms" : vcpu >= 8 ? "12 ms" : "18 ms";
  const estimatedCost = (vcpu * 0.04 + memory * 0.01 + (hasGpu ? 0.25 : 0)).toFixed(2);

  return (
    <section id="playground" className="py-28 px-4 md:px-6 relative bg-[#050508]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Configure Your Cloud Workstation
          </h2>
          <p className="mt-3 text-base text-white/60 font-normal">
            Customize instance resources and see simulated live stream metrics update in real-time.
          </p>
        </div>

        {/* Playground Grid Card */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Instance Specification
            </h3>

            {/* App Preset Selector */}
            <div>
              <label className="text-xs font-mono font-medium text-white/60 mb-2 block uppercase tracking-wider">
                Select Workstation Preset
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "chromium", label: "Privacy Browser" },
                  { id: "vscode", label: "Dev Workstation" },
                  { id: "ai", label: "AI Studio" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setAppPreset(preset.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      appPreset === preset.id
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                        : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* vCPU Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-medium text-white/60 uppercase tracking-wider">
                  Compute Cores (vCPU)
                </span>
                <span className="text-sm font-bold font-mono text-indigo-400">{vcpu} Cores</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 8, 16].map((val) => (
                  <button
                    key={val}
                    onClick={() => setVcpu(val)}
                    className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                      vcpu === val
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {val} vCPU
                  </button>
                ))}
              </div>
            </div>

            {/* RAM Memory Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-medium text-white/60 uppercase tracking-wider">
                  System Memory (RAM)
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400">{memory} GB</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[4, 8, 16, 32].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMemory(val)}
                    className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                      memory === val
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {val} GB
                  </button>
                ))}
              </div>
            </div>

            {/* GPU Acceleration Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">NVIDIA GPU Acceleration</span>
                  <span className="text-[11px] text-white/40">Hardware WebRTC Video Encoder</span>
                </div>
              </div>
              <button
                onClick={() => setHasGpu(!hasGpu)}
                className={`w-11 h-6 rounded-full transition-colors p-1 relative ${
                  hasGpu ? "bg-indigo-600" : "bg-white/20"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    hasGpu ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Real-time Simulated Telemetry Panel */}
          <div className="lg:col-span-6 bg-[#0b0c12] rounded-xl border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    SIMULATED STREAM ENGINE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ONLINE
                </span>
              </div>

              {/* Specs Telemetry Summary */}
              <div className="space-y-3 font-mono text-xs mb-6">
                <div className="flex justify-between py-1.5 border-b border-white/5 text-white/70">
                  <span>PRESET OS:</span>
                  <span className="text-indigo-400 font-bold uppercase">{appPreset} Container</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-white/70">
                  <span>STREAM FRAME RATE:</span>
                  <span className="text-emerald-400 font-bold">{computedFps} FPS</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-white/70">
                  <span>ROUNDTRIP LATENCY:</span>
                  <span className="text-indigo-300 font-bold">{computedLatency}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-white/70">
                  <span>CONTAINER ENCRYPTION:</span>
                  <span className="text-white font-bold">AES-256-GCM</span>
                </div>
              </div>
            </div>

            {/* Launch simulation CTA */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/40 block">ESTIMATED RATE</span>
                <span className="text-lg font-bold text-white font-mono">${estimatedCost} <span className="text-xs font-normal text-white/40">/ hr</span></span>
              </div>
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Launch This Pod</span>
                <Check className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
