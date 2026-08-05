"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Gauge, Shield, Cpu } from "lucide-react";

const stats = [
  {
    icon: <Gauge className="w-5 h-5 text-emerald-400" />,
    value: "< 15ms",
    label: "Glass-to-Glass Latency",
    subtext: "Global WebRTC edge streaming",
  },
  {
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
    value: "60 FPS",
    label: "Full Ultra-HD Video",
    subtext: "Hardware-accelerated encoding",
  },
  {
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    value: "< 1 Sec",
    label: "Instance Provisioning",
    subtext: "Instant cloud allocation",
  },
  {
    icon: <Shield className="w-5 h-5 text-cyan-400" />,
    value: "100%",
    label: "Zero Local Footprint",
    subtext: "Ephemeral container sandbox",
  },
];

export function StatsBar() {
  return (
    <section className="relative py-12 px-6 border-y border-white/10 bg-[#07080e]/60 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-xl glass-card hover:border-white/20 transition-all duration-300 group"
            >
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-white/80 tracking-wide mb-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-white/40">
                {stat.subtext}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
