import React from "react";
import { Monitor } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#09090b] py-14 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
              <Monitor className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">Orbit</span>
          </div>
          <p className="text-sm text-zinc-400 font-normal">
            Your computer, anywhere you go.
          </p>
        </div>

        <div className="flex gap-8">
          <a
            href="#features"
            className="text-sm text-zinc-400 hover:text-white font-medium transition-colors"
          >
            Product
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-zinc-400 hover:text-white font-medium transition-colors"
          >
            Workflow
          </a>
          <a
            href="#use-cases"
            className="text-sm text-zinc-400 hover:text-white font-medium transition-colors"
          >
            Use Cases
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-zinc-500 font-mono">
        <span>&copy; {currentYear} Orbit. All rights reserved.</span>
        <span className="text-indigo-400">All Systems Operational</span>
      </div>
    </footer>
  );
}




