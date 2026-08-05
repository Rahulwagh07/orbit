"use client";

import React from "react";
import { motion } from "framer-motion";
import { CloudDesktopPreview } from "./CloudDesktopPreview";
import { useAuth } from "../AuthProvider";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const { user, isLoading } = useAuth();

  return (
    <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden bg-[#09090b]">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Senior Designer Typography - Clean & Confident */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.04]"
        >
          The computer <br />
          <span className="text-zinc-400 font-normal italic font-serif">in your browser.</span>
        </motion.h1>

        {/* Crisp Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed font-normal"
        >
          Run full desktop applications instantly. Zero downloads, zero local storage used, and sub-15ms response speeds on any device.
        </motion.p>

        {/* High Hierarchy Action CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-4"
        >
          {!isLoading && !user ? (
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-8 py-3.5 text-sm font-bold bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.02] active:scale-100 shadow-2xl flex items-center gap-2 group"
            >
              <span>Launch computer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : !isLoading && user ? (
            <button
              onClick={() => (window.location.href = "/computer")}
              className="px-8 py-3.5 text-sm font-bold bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.02] active:scale-100 shadow-2xl flex items-center gap-2 group"
            >
              <span>Open computer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="w-44 h-12 bg-white/10 rounded-full animate-pulse" />
          )}
        </motion.div>

        {/* Minimal Micro Metric */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex items-center gap-2 text-xs font-mono text-zinc-500"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>WebRTC 60 FPS • Encrypted Cloud Sandbox • Sub-15ms Latency</span>
        </motion.div>
      </div>

      {/* Desktop Preview Frame */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1100px] mx-auto mt-14 relative z-20"
      >
        <CloudDesktopPreview />
      </motion.div>
    </section>
  );
}






