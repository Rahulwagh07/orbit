"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Monitor, Zap, Shield, Globe } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/computer");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-white">
        <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Orbit</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '/api/auth/google'}
            className="px-4 py-2 text-sm font-medium bg-white text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors shadow-lg shadow-white/10"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            The cloud computer for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              the next generation.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Instantly spin up powerful, disposable virtual desktops directly in your browser. 
            No plugins. No downloads. Just pure performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.location.href = '/api/auth/google'}
              className="group flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 font-semibold rounded-full hover:scale-105 transition-all shadow-xl shadow-white/10"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800">
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl"
        >
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video relative flex items-center justify-center">
            {/* macOS window controls mock */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            {/* Fake desktop background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 z-0" />
            
            {/* Fake app window */}
            <div className="relative z-10 w-3/4 h-2/3 bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 flex flex-col overflow-hidden">
              <div className="h-10 border-b border-zinc-800 bg-zinc-950/50 flex items-center px-4">
                <div className="w-full max-w-md h-6 bg-zinc-800 rounded mx-auto" />
              </div>
              <div className="flex-1 p-6 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-left">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <Zap className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Boot</h3>
            <p className="text-zinc-400 leading-relaxed">
              Your cloud environment is ready in milliseconds. Powered by lightweight container architecture.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <Globe className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Zero Latency</h3>
            <p className="text-zinc-400 leading-relaxed">
              Global edge network ensures your pixels travel the shortest path possible for a native feel.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Isolated</h3>
            <p className="text-zinc-400 leading-relaxed">
              Every session is fully isolated and destroyed upon exit. Leave no trace behind.
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 text-center text-zinc-500 text-sm">
        <p>© 2026 Orbit. All rights reserved.</p>
      </footer>
    </div>
  );
}
