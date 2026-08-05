"use client";

import React from "react";
import { motion } from "framer-motion";

export function RealtimeFlow() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          The screen goes one way.<br />
          You go the other.
        </h2>
        <p className="mt-6 text-lg text-white/60 font-medium">
          The internet becomes the cable connecting your display and peripherals to the compute instance.
        </p>
      </div>

      <div className="relative rounded-2xl bg-[#141414] text-white p-8 md:p-12 overflow-hidden shadow-2xl border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          
          <div className="text-center flex-1">
            <div className="text-xs font-bold tracking-widest text-white/40 mb-6">YOUR BROWSER</div>
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🖥️</span>
            </div>
            <div className="font-mono text-sm text-white/80">Display</div>
          </div>

          <div className="flex-1 w-full flex flex-col gap-8 relative">
            <div className="flex items-center justify-center relative">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-dashed border-emerald-500/50" />
               </div>
               <motion.div 
                 initial={{ x: 100, opacity: 0 }}
                 animate={{ x: -100, opacity: 1 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-xs rounded-full relative z-10 border border-emerald-500/30"
               >
                 ◄ frames
               </motion.div>
            </div>
            
            <div className="flex items-center justify-center relative">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-dashed border-blue-500/50" />
               </div>
               <motion.div 
                 initial={{ x: -100, opacity: 0 }}
                 animate={{ x: 100, opacity: 1 }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
                 className="px-3 py-1 bg-blue-500/20 text-blue-400 font-mono text-xs rounded-full relative z-10 border border-blue-500/30"
               >
                 events ►
               </motion.div>
            </div>
          </div>

          <div className="text-center flex-1">
            <div className="text-xs font-bold tracking-widest text-white/40 mb-6">REMOTE COMPUTE</div>
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center mx-auto mb-4">
              <span className="text-2xl">☁️</span>
            </div>
            <div className="font-mono text-sm text-white/80">Chromium</div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
