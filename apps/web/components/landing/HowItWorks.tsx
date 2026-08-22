"use client";

import React from "react";
import { motion } from "framer-motion";
import { MousePointerClick, Radio, Shield, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    stepNum: "STEP 01",
    icon: <MousePointerClick className="w-6 h-6 text-indigo-400" />,
    title: "One-Click Launch",
    description:
      "Select your desired desktop application or workstation preset. Within 1 second, a isolated cloud container is allocated just for you.",
    highlight: "Zero Installation Needed",
  },
  {
    stepNum: "STEP 02",
    icon: <Radio className="w-6 h-6 text-emerald-400" />,
    title: "Ultra-HD 60 FPS Stream",
    description:
      "A high-speed WebRTC pipeline opens. Low-latency video pixels stream to your screen while mouse clicks and keystrokes travel instantly.",
    highlight: "< 15ms Motion Latency",
  },
  {
    stepNum: "STEP 03",
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    title: "Work & Auto-Save",
    description:
      "Work freely inside your cloud computer. When done, close your tab—your state is securely saved so you can resume anytime from any device.",
    highlight: "Continuous Session Memory",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-4 md:px-6 relative bg-[#07080f] border-y border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How Orbit Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 font-normal">
            Three simple steps to transform any web browser into a full-featured desktop computer.
          </p>
        </div>

        {/* Connecting step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col relative group"
            >
              {/* Top Row: Icon & Step Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <span className="text-xs font-mono font-extrabold text-white/40 tracking-wider">
                  {step.stepNum}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-white/65 leading-relaxed font-normal mb-6 flex-1">
                {step.description}
              </p>

              {/* Bottom Tag */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-emerald-400">
                  {step.highlight}
                </span>
                {idx < 2 && (
                  <ArrowRight className="w-4 h-4 text-white/30 hidden md:block group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
