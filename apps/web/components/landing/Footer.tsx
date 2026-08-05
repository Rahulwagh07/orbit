import React from "react";
import { Monitor } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.05] bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-5 h-5 text-white" />
            <span className="font-semibold text-lg tracking-tight text-white">Cloud Infinity</span>
          </div>
          <p className="text-sm text-white/60">
            Computing, through the browser.
          </p>
        </div>

        <div className="flex gap-8">
          <a href="#product" className="text-sm text-white/70 hover:text-white font-medium transition-colors">Product</a>
          <a href="#architecture" className="text-sm text-white/70 hover:text-white font-medium transition-colors">Architecture</a>
          <a href="#github" className="text-sm text-white/70 hover:text-white font-medium transition-colors">GitHub</a>
        </div>

      </div>
      
      <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-white/[0.05] flex justify-between items-center text-xs text-white/40">
        <span>&copy; {currentYear} Cloud Infinity</span>
      </div>
    </footer>
  );
}
