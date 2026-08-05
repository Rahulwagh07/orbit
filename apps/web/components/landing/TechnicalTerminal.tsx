"use client";

import React, { useState, useEffect } from "react";

export function TechnicalTerminal() {
  const [lines, setLines] = useState<number>(0);

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setLines(0);
        await new Promise(r => setTimeout(r, 1000));
        setLines(1);
        await new Promise(r => setTimeout(r, 600));
        setLines(2);
        await new Promise(r => setTimeout(r, 200));
        setLines(3);
        await new Promise(r => setTimeout(r, 1200));
        setLines(4);
        await new Promise(r => setTimeout(r, 500));
        setLines(5);
        await new Promise(r => setTimeout(r, 1000));
        setLines(6);
        await new Promise(r => setTimeout(r, 300));
        setLines(7);
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    sequence();
  }, []);

  return (
    <section className="py-32 px-6 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1 w-full relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 blur-2xl z-0 rounded-full" />
          <div className="relative z-10 bg-[#141414] rounded-xl border border-white/10 p-6 font-mono text-xs text-white/70 shadow-2xl overflow-hidden h-[240px]">
            
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <span className="w-3 h-3 rounded-full bg-red-500/50" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <span className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>

            <div className="space-y-2">
              <div className="text-white">$ infinity launch chromium</div>
              
              {lines >= 1 && <div className="text-white/40">creating instance...</div>}
              
              {lines >= 2 && (
                <>
                  <div className="text-blue-400 mt-2">instance: 34142f</div>
                  <div className="text-blue-400">region: local</div>
                </>
              )}
              
              {lines >= 3 && <div className="mt-2">[11%] creating resources</div>}
              {lines >= 4 && <div>[44%] starting application</div>}
              {lines >= 5 && <div>[55%] waiting for application</div>}
              {lines >= 6 && <div>[88%] ready</div>}
              
              {lines >= 7 && (
                <div className="mt-2 text-emerald-400">
                  connected:<br />
                  runtime/34142f
                </div>
              )}
              
              <div className="inline-block w-2 h-3 bg-white/50 animate-pulse ml-1 align-middle" />
            </div>
            
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            Developer infrastructure. <br />
            Not a toy.
          </h2>
          <p className="text-lg text-white/60 font-medium leading-relaxed">
            Every application runs in an isolated container. Manage instances via API, 
            connect securely over WebSocket, and build entirely new workflows around programmable compute.
          </p>
        </div>

      </div>
    </section>
  );
}
