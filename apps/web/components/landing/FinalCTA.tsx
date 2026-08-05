"use client";

import React from "react";
import { useAuth } from "../AuthProvider";

export function FinalCTA() {
  const { user, isLoading } = useAuth();
  
  return (
    <section className="py-32 px-6 flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Your computer is ready.
        </h2>
        <p className="text-lg text-white/60 font-medium mb-10">
          Open Cloud Infinity and launch your first remote application.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isLoading && !user ? (
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-8 py-4 text-base font-medium bg-white text-black rounded-full hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-100 shadow-xl shadow-white/5"
            >
              Open computer
            </button>
          ) : !isLoading && user ? (
            <button 
              onClick={() => window.location.href = '/computer'}
              className="px-8 py-4 text-base font-medium bg-white text-black rounded-full hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-100 shadow-xl shadow-white/5"
            >
              Open computer
            </button>
          ) : (
            <div className="w-48 h-14 bg-white/10 rounded-full animate-pulse" />
          )}
          
          <a 
            href="#architecture"
            className="px-8 py-4 text-base font-medium text-white/70 hover:text-white transition-colors"
          >
            View architecture
          </a>
        </div>
      </div>
    </section>
  );
}
