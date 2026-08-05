"use client";

import React from "react";

export function ComputeInstance() {
  return (
    <section className="py-28 px-6 bg-[#09090b] border-t border-white/10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Full desktop capabilities. <br />
            Zero local strain.
          </h2>
          <p className="text-base md:text-lg text-zinc-400 font-normal leading-relaxed">
            Every application runs in a high-speed cloud environment. Your local browser only receives crisp video frames and sends instant input events. Your physical machine is the interface, not the limitation.
          </p>
        </div>

        <div 
          className="flex-1 w-full bg-[#121215] rounded-2xl overflow-hidden font-mono text-xs border border-white/10 shadow-2xl"
        >
          <div className="bg-[#18181b] px-4 py-3 flex items-center justify-between border-b border-white/10">
            <span className="text-zinc-300 font-bold">SESSION TELEMETRY</span>
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </span>
          </div>
          <div className="p-6 text-zinc-300 space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">Applications</span>
              <span className="text-white font-bold">Chromium, VS Code, Workspace</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">Network Channel</span>
              <span className="text-indigo-400 font-bold">1 Gbps Cloud Stream</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">Disk Footprint</span>
              <span className="text-emerald-400 font-bold">0 MB Local</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">Display Stream</span>
              <span className="text-white font-bold">60 FPS WebRTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Encryption</span>
              <span className="text-zinc-300 font-bold">AES-256 Cloud Sandbox</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}



