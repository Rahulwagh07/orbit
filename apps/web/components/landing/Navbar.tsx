"use client";

import React, { useEffect, useState } from "react";
import { Monitor } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { motion, useScroll } from "framer-motion";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 40);
    });
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-[#09090b]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
          <Monitor className="w-4 h-4 text-white" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-white">Orbit</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a
          href="#features"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Product
        </a>
        <a
          href="#how-it-works"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Workflow
        </a>
        <a
          href="#use-cases"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Use Cases
        </a>
      </div>

      <div className="flex items-center gap-4">
        {!isLoading && !user ? (
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2.5 text-xs font-bold bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02] active:scale-100 shadow-xl"
          >
            Launch Computer
          </button>
        ) : !isLoading && user ? (
          <button
            onClick={() => (window.location.href = "/computer")}
            className="px-6 py-2.5 text-xs font-bold bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02] active:scale-100 shadow-xl"
          >
            Open Computer
          </button>
        ) : (
          <div className="w-32 h-9 bg-white/10 rounded-full animate-pulse" />
        )}
      </div>
    </motion.nav>
  );
}




