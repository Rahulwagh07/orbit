"use client";

import React from "react";
import { motion } from "framer-motion";
import { CloudDesktopPreview } from "./CloudDesktopPreview";
import { useAuth } from "../AuthProvider";

export function Hero() {
  const { user, isLoading } = useAuth();
  
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background subtleties */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white/60 tracking-widest uppercase flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Infrastructure ready
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.05]"
        >
          Your computer, <br />
          somewhere else.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed font-medium"
        >
          Launch real desktop applications on isolated cloud compute and control them directly from your browser. No installation. Your browser becomes the display, keyboard and mouse.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          {!isLoading && !user ? (
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-8 py-4 text-base font-medium bg-white text-black rounded-full hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-100 shadow-xl shadow-white/5"
            >
              Open your computer
            </button>
          ) : !isLoading && user ? (
            <button 
              onClick={() => window.location.href = '/computer'}
              className="px-8 py-4 text-base font-medium bg-white text-black rounded-full hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-100 shadow-xl shadow-white/5"
            >
              Open your computer
            </button>
          ) : (
             <div className="w-48 h-14 bg-white/10 rounded-full animate-pulse" />
          )}
          
          <a 
            href="#architecture"
            className="px-8 py-4 text-base font-medium text-white/70 hover:text-white transition-colors"
          >
            See how it works
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1200px] mx-auto mt-20 relative z-20"
      >
        <CloudDesktopPreview />
      </motion.div>
    </section>
  );
}
