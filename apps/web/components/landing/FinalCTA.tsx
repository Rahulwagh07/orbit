"use client";

import React from "react";
import { useAuth } from "../AuthProvider";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  const { user, isLoading } = useAuth();

  return (
    <section className="py-32 px-6 flex flex-col items-center justify-center text-center bg-[#09090b] relative overflow-hidden border-t border-white/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl mx-auto flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          Your computer is ready.
        </h2>
        <p className="text-base sm:text-lg text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed font-normal">
          Experience desktop applications streaming directly in your browser. Zero setup required.
        </p>

        <div className="flex items-center justify-center">
          {!isLoading && !user ? (
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-8 py-3.5 text-sm font-bold bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.02] active:scale-100 shadow-2xl flex items-center justify-center gap-2 group"
            >
              <span>Launch computer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : !isLoading && user ? (
            <button
              onClick={() => (window.location.href = "/computer")}
              className="px-8 py-3.5 text-sm font-bold bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.02] active:scale-100 shadow-2xl flex items-center justify-center gap-2 group"
            >
              <span>Open computer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="w-44 h-12 bg-white/10 rounded-full animate-pulse" />
          )}
        </div>
      </motion.div>
    </section>
  );
}





