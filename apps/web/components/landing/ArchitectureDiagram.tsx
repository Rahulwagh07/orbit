"use client";

import React from "react";
import { Laptop, Shield, Check, Zap, Cpu, BatteryCharging } from "lucide-react";
import { motion } from "framer-motion";

export function ArchitectureDiagram() {
  return (
    <section id="use-cases" className="py-28 px-6 bg-[#09090b] border-t border-white/10">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Split Feature 1: Lightweight Hardware (Text Left, Visual Right) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-400 font-semibold">
              <Laptop className="w-3.5 h-3.5" />
              <span>Lightweight Devices</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Turn any Chromebook or tablet into a workstation.
            </h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
              Heavy software consumes massive CPU cycles and drains laptop battery. With Orbit, all computation happens in high-speed cloud clusters.
            </p>
            <div className="space-y-2 pt-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero CPU fan noise & battery drain</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Instant 60 FPS WebRTC display stream</span>
              </div>
            </div>
          </div>

          {/* Feature 1 Visual Card */}
          <div className="flex-1 w-full bg-[#121215] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 text-zinc-300 font-bold">
              <span>LOCAL DEVICE SPECS</span>
              <span className="text-emerald-400">OPTIMIZED</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#09090b] rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-500 block">CPU LOAD</span>
                <span className="text-emerald-400 font-bold text-sm">2% (Idle)</span>
              </div>
              <div className="p-3 bg-[#09090b] rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-500 block">BATTERY LIFE</span>
                <span className="text-white font-bold text-sm">12+ Hours</span>
              </div>
              <div className="p-3 bg-[#09090b] rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-500 block">DEVICE TEMP</span>
                <span className="text-emerald-400 font-bold text-sm">34°C (Cool)</span>
              </div>
              <div className="p-3 bg-[#09090b] rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-500 block">FAN NOISE</span>
                <span className="text-white font-bold text-sm">0 dB (Silent)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Feature 2: Encrypted Sandboxes (Visual Left, Text Right) */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Feature 2 Visual Card */}
          <div className="flex-1 w-full bg-[#121215] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 text-zinc-300 font-bold">
              <span>SANDBOX SECURITY STATE</span>
              <span className="text-indigo-400">ENCRYPTED</span>
            </div>

            <div className="p-4 bg-[#09090b] rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Local Disk Footprint</span>
                <span className="text-emerald-400 font-bold">0 MB Saved</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Session Encryption</span>
                <span className="text-indigo-400 font-bold">AES-256-GCM</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Isolated Sandbox</span>
                <span className="text-emerald-400 font-bold">Ephemeral Container</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-400 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Isolated Privacy</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Isolated private web browsing & testing.
            </h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
              Test untrusted links, inspect suspicious web code, or browse sensitive data inside ephemeral cloud sandboxes. Zero files or tracking cookies remain on your physical disk.
            </p>
            <div className="space-y-2 pt-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>100% ephemeral cloud container isolation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero local IP address exposure</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}




