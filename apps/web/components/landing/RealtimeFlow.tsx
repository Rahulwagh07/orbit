"use client";

import React from "react";
import { motion } from "framer-motion";
import { Monitor, Cloud } from "lucide-react";

export function RealtimeFlow() {
  return (
    <section className="py-28 px-6 bg-[#09090b] border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Pixels in. Inputs out.
          </h2>
          <p className="mt-4 text-base md:text-lg text-zinc-400 font-normal max-w-xl mx-auto">
            High-definition display frames stream directly to your web browser with sub-15ms glass-to-glass latency.
          </p>
        </div>

        <div className="rounded-2xl bg-[#121215] border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            
            <div className="text-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-zinc-200" />
              </div>
              <div className="text-sm font-bold text-white">Your Browser</div>
              <div className="text-xs text-zinc-500 font-mono mt-1">Display & Peripherals</div>
            </div>

            <div className="flex-1 w-full flex flex-col gap-6">
              <div className="flex items-center justify-center relative">
                 <div className="w-full border-t border-dashed border-zinc-700" />
                 <motion.div 
                   initial={{ x: 60, opacity: 0 }}
                   animate={{ x: -60, opacity: 1 }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="px-3 py-1 bg-white/10 text-white font-mono text-xs rounded-full absolute border border-white/20 shadow-sm"
                 >
                   ◄ 60 FPS Video Stream
                 </motion.div>
              </div>
              
              <div className="flex items-center justify-center relative">
                 <div className="w-full border-t border-dashed border-zinc-700" />
                 <motion.div 
                   initial={{ x: -60, opacity: 0 }}
                   animate={{ x: 60, opacity: 1 }}
                   transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
                   className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-mono text-xs rounded-full absolute border border-indigo-500/30 shadow-sm"
                 >
                   Keyboard & Mouse Events ►
                 </motion.div>
              </div>
            </div>

            <div className="text-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-8 h-8 text-zinc-200" />
              </div>
              <div className="text-sm font-bold text-white">Cloud Engine</div>
              <div className="text-xs text-zinc-500 font-mono mt-1">High-Speed Compute</div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}



