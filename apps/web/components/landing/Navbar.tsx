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
      setScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
        scrolled 
          ? "bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/10" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <Monitor className="w-5 h-5 text-white" />
        <span className="font-semibold text-lg tracking-tight text-white">Cloud Infinity</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#product" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Product</a>
        <a href="#architecture" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Architecture</a>
        <a href="#github" className="text-sm font-medium text-white/60 hover:text-white transition-colors">GitHub</a>
      </div>

      <div className="flex items-center gap-4">
        {!isLoading && !user ? (
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-colors"
          >
            Open computer
          </button>
        ) : !isLoading && user ? (
          <button 
            onClick={() => window.location.href = '/computer'}
            className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-colors"
          >
            Open computer
          </button>
        ) : (
          <div className="w-32 h-9 bg-white/10 rounded-full animate-pulse" />
        )}
      </div>
    </motion.nav>
  );
}
