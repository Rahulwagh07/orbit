"use client";

import React from "react";
import { motion } from "framer-motion";
import { MousePointer2, Server, Power, Radio, RefreshCcw } from "lucide-react";

const stages = [
  {
    num: "01",
    icon: <MousePointer2 size={20} />,
    title: "CLICK",
    desc: "You launch Chromium.",
    tech: "[ Chromium ]",
  },
  {
    num: "02",
    icon: <Server size={20} />,
    title: "PROVISION",
    desc: "Cloud Infinity allocates compute.",
    tech: "instance 34142f",
  },
  {
    num: "03",
    icon: <Power size={20} />,
    title: "START",
    desc: "Chromium starts remotely.",
    tech: "READY",
  },
  {
    num: "04",
    icon: <Radio size={20} />,
    title: "CONNECT",
    desc: "Realtime data channel opens.",
    tech: "browser ← sse → cloud",
  },
  {
    num: "05",
    icon: <RefreshCcw size={20} />,
    title: "USE",
    desc: "Pixels come to you. Input goes back.",
    tech: "display ← input →",
  },
];

export function LaunchSequence() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a] border-y border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-16 text-center">
          What happens when you open an app?
        </h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-[10%] right-[10%] h-[1px] bg-white/10 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="flex flex-col items-center text-center bg-[#0a0a0a]"
              >
                <div className="w-16 h-16 rounded-full bg-[#141414] border border-white/10 shadow-sm flex items-center justify-center text-white mb-6">
                  {stage.icon}
                </div>
                
                <div className="text-[10px] font-bold text-white/40 tracking-widest mb-2">
                  {stage.num}
                </div>
                
                <h3 className="text-sm font-bold text-white mb-2 tracking-wide uppercase">
                  {stage.title}
                </h3>
                
                <p className="text-sm text-white/60 font-medium mb-4 h-10">
                  {stage.desc}
                </p>
                
                <div className="mt-auto px-3 py-1.5 bg-white/5 rounded text-xs font-mono text-white/70">
                  {stage.tech}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
