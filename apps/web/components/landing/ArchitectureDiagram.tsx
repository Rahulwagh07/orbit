"use client";

import React from "react";

export function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          One interface. <br className="hidden md:block" />
          Compute where it belongs.
        </h2>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
          
          {/* CONTROL PLANE */}
          <div className="w-full md:w-[35%]">
            <h3 className="text-xs font-bold tracking-widest text-white/40 mb-4">CONTROL PLANE</h3>
            <p className="text-sm text-white/70 font-medium mb-6">
              Manages the lifecycle of application instances and tells the browser where its compute lives.
            </p>
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 shadow-sm">
              <ul className="space-y-3 font-mono text-xs text-white/80">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Create
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Schedule
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Start
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Recover
                </li>
              </ul>
            </div>
          </div>

          {/* DIAGRAM */}
          <div className="w-full md:w-[30%] flex justify-center hidden md:flex relative h-64">
             {/* Lines */}
             <svg className="absolute inset-0 w-full h-full" overflow="visible">
                {/* Control plane path */}
                <path d="M 0 100 C 50 100 50 20 100 20" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 100 20 C 150 20 150 100 200 100" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
                
                {/* Data plane path */}
                <path d="M 0 180 C 100 180 100 220 200 220" fill="none" stroke="white" strokeOpacity="0.8" strokeWidth="2" />
                <path d="M 200 220 C 100 220 100 180 0 180" fill="none" stroke="white" strokeOpacity="0.8" strokeWidth="2" />
             </svg>
          </div>

          {/* DATA PLANE */}
          <div className="w-full md:w-[35%] text-right">
            <h3 className="text-xs font-bold tracking-widest text-white/40 mb-4">DATA PLANE</h3>
            <p className="text-sm text-white/70 font-medium mb-6">
              High-frequency traffic takes the direct realtime path rather than passing through the control API.
            </p>
            <div className="bg-[#141414] text-white rounded-xl p-6 shadow-xl text-left border border-white/10">
              <ul className="space-y-4 font-mono text-xs">
                <li className="flex justify-between items-center text-emerald-400">
                  <span>Display</span>
                  <span>← 60fps</span>
                </li>
                <li className="flex justify-between items-center text-blue-400">
                  <span>Input</span>
                  <span>→ &lt;20ms</span>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
