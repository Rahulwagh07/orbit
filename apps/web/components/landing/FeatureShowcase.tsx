"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Laptop, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2, Sparkles, Layers } from "lucide-react";

const features = [
  {
    id: "streaming",
    icon: <Monitor className="w-5 h-5 text-indigo-400" />,
    badge: "CORE ENGINE",
    title: "Stream Any Desktop App",
    tagline: "Heavy applications running at full speed directly inside your web browser.",
    description:
      "Run Chromium, VS Code, Blender, or custom Linux software without installing anything locally. Orbit streams high-definition video frames to your display while capturing mouse and keyboard inputs with sub-frame precision.",
    highlights: [
      "Ultra-low latency streaming (<15ms)",
      "Native keyboard shortcuts & clipboard passthrough",
      "Full hardware-accelerated H.264/H.265 video stream",
    ],
    preview: {
      type: "stream",
      stats: [
        { label: "FRAME RATE", val: "60 FPS" },
        { label: "STREAM RES", val: "1080p / 4K" },
        { label: "INPUT LAG", val: "1.2 ms" },
      ],
    },
  },
  {
    id: "persistence",
    icon: <Laptop className="w-5 h-5 text-emerald-400" />,
    badge: "CROSS-DEVICE",
    title: "Continuous Session State",
    tagline: "Start working on your desktop, resume instantly on your tablet or laptop.",
    description:
      "Your cloud environment stays alive even when you close your laptop lid. All tabs, windows, open files, and uncommitted edits remain exactly where you left them across any device.",
    highlights: [
      "Persistent state saved in real-time",
      "Seamless phone, tablet, and laptop handoff",
      "Zero battery drain during remote execution",
    ],
    preview: {
      type: "persistence",
      stats: [
        { label: "SAVED STATE", val: "100% Intact" },
        { label: "HANDOFF TIME", val: "< 0.5s" },
        { label: "RECOVERABILITY", val: "Instant" },
      ],
    },
  },
  {
    id: "security",
    icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
    badge: "ISOLATION",
    title: "Zero-Risk Cloud Sandbox",
    tagline: "Browse untrusted links and run non-verified code with complete peace of mind.",
    description:
      "Every instance runs inside an ephemeral, disposable container sandbox completely isolated from your host OS. Malware, tracking cookies, and risky scripts can never compromise your physical hardware.",
    highlights: [
      "Strict container memory & network boundary isolation",
      "Automatic session wipe upon closure",
      "Enterprise-grade encrypted data transit",
    ],
    preview: {
      type: "security",
      stats: [
        { label: "HOST RISKS", val: "0 System Exposure" },
        { label: "SANDBOX MODE", val: "Strict Isolated" },
        { label: "ENCRYPTION", val: "TLS 1.3 + AES" },
      ],
    },
  },
  {
    id: "turbo",
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    badge: "PERFORMANCE",
    title: "Instant Hardware Boost",
    tagline: "Harness 32 vCPUs and Cloud GPUs on your standard ultra-thin laptop.",
    description:
      "Transform your 5-year-old laptop into a workstation powerhouse. Compile massive codebases, run AI models, or open hundreds of browser tabs without fan noise or thermal throttling.",
    highlights: [
      "Elastic scaling up to 32 vCPUs & 64GB RAM",
      "Dedicated GPU video encoding pipeline",
      "Gigabit symmetric network speeds",
    ],
    preview: {
      type: "turbo",
      stats: [
        { label: "VCPU ALLOC", val: "Up to 32 Cores" },
        { label: "CLOUD GPU", val: "NVIDIA Acceleration" },
        { label: "DOWNLOAD", val: "1.2 Gbps" },
      ],
    },
  },
];

export function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const activeFeature = features[activeTab] || features[0]!;

  return (
    <section id="features" className="py-28 px-4 md:px-6 relative bg-[#050508]">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-emerald-900/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Modern Workflows</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Designed for Speed, Privacy & Power
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 font-normal">
            Orbit eliminates the boundaries between local software and cloud performance.
          </p>
        </div>

        {/* Feature Tab Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {features.map((feature, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-col items-start p-4 rounded-xl text-left border transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-white/[0.08] border-indigo-500/50 shadow-xl shadow-indigo-950/30"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFeatureGlow"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/40 tracking-wider">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-1">
                  {feature.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Feature Display Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Copy & Checklist */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    {activeFeature.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
                    {activeFeature.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
                    {activeFeature.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {activeFeature.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-white/90 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <a
                    href="#playground"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group"
                  >
                    <span>Test live in playground</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Metrics Demo */}
              <div className="lg:col-span-6">
                <div className="bg-[#0b0c12] rounded-xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white tracking-wide">
                        ACTIVE METRICS ENGINE
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">SYS-VERIFIED</span>
                  </div>

                  {/* Interactive Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {activeFeature.preview.stats.map((stat, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                        <div className="text-[10px] font-mono text-white/40 mb-1">{stat.label}</div>
                        <div className="text-sm sm:text-base font-extrabold font-mono text-indigo-300">
                          {stat.val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Visual Graph Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/60 font-mono">
                      <span>Stream Throughput Efficiency</span>
                      <span className="text-emerald-400 font-bold">99.8%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "98%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
