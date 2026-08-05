"use client";

import React from "react";

export function ComputeInstance() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            A real application. <br />
            A real environment.
          </h2>
          <p className="text-lg text-white/60 font-medium leading-relaxed">
            Chromium executes inside isolated remote compute. 
            The user&apos;s browser only displays the result and sends input. 
            Your local machine becomes the interface rather than the constraint.
          </p>
        </div>

        <div 
          className="flex-1 w-full bg-[#141414] rounded-xl shadow-xl overflow-hidden font-mono text-sm border border-white/10"
        >
          <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-white/10">
            <span className="text-white/50 text-xs">INSTANCE 34142f</span>
            <span className="flex items-center gap-2 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              READY
            </span>
          </div>
          <div className="p-6 text-white/80 space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">Application</span>
              <span>Chromium</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">OS</span>
              <span>Linux</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">Memory</span>
              <span>2 GB</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">Display</span>
              <span className="text-emerald-400">STREAMING</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Input</span>
              <span className="text-emerald-400">CONNECTED</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
