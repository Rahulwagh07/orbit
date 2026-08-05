"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, AppWindow, Play, Sparkles, Repeat, ArrowRight, CheckCircle2 } from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    title: "1. Open your web browser",
    subtitle: "Navigate to Cloud Infinity from any laptop, tablet, or cheap device.",
    detail: "No native app downloads, no administrator privileges required. Works inside Chrome, Safari, Edge, or Brave.",
    badge: "Any Browser",
    view: {
      type: "url",
      url: "https://cloudinfinity.app/workspace",
      status: "DNS Resolved • Ready",
    },
  },
  {
    id: 2,
    title: "2. Select your application",
    subtitle: "Choose from pre-configured desktop apps or launch a full workstation.",
    detail: "Chromium, VS Code, Linux Shell, and workspace productivity tools launch instantly.",
    badge: "1-Click Launch",
    view: {
      type: "apps",
      apps: ["Chromium Desktop", "VS Code Studio", "Cloud Terminal"],
      status: "Selecting Application...",
    },
  },
  {
    id: 3,
    title: "3. Instant WebRTC stream",
    subtitle: "Display frames stream at 60 FPS directly to your web canvas.",
    detail: "Sub-15ms motion latency gives you instant native responsiveness for mouse, touch, and keyboard.",
    badge: "60 FPS Stream",
    view: {
      type: "stream",
      fps: "60 FPS",
      ping: "11.2 ms",
      status: "WebRTC Data Channel OPEN",
    },
  },
  {
    id: 4,
    title: "4. Resume anywhere",
    subtitle: "Close your laptop and pick up right where you left off from another device.",
    detail: "Your state is saved securely in cloud compute. Zero data lost, zero local storage used.",
    badge: "Cloud Synced",
    view: {
      type: "sync",
      devices: ["MacBook Pro", "iPad Pro", "Windows Desktop"],
      status: "100% Session State Synced",
    },
  },
];

export function LaunchSequence() {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = workflowSteps.find((s) => s.id === activeStep)!;

  return (
    <section id="how-it-works" className="py-28 px-6 bg-[#09090b] border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Three seconds to your cloud desktop.
          </h2>
          <p className="mt-4 text-base md:text-lg text-zinc-400 font-normal max-w-xl mx-auto">
            Experience how seamless launching a cloud workstation can be.
          </p>
        </div>

        {/* Split Interactive Workflow Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Step Selector */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            {workflowSteps.map((step) => {
              const isActive = step.id === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 ${
                    isActive
                      ? "bg-[#18181b] border-indigo-500/50 shadow-xl shadow-indigo-950/20"
                      : "bg-[#121215] border-white/10 hover:border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold tracking-tight ${isActive ? "text-white" : "text-zinc-300"}`}>
                      {step.title}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isActive ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold" : "bg-white/5 text-zinc-500"}`}>
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                    {step.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Visual Canvas */}
          <div className="md:col-span-7 bg-[#121215] rounded-2xl border border-white/10 p-8 flex flex-col justify-between min-h-[380px] shadow-2xl relative overflow-hidden">
            <div className="bento-card-glow absolute inset-0 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-zinc-300 font-bold">WORKFLOW STAGE 0{currentStep.id}</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">{currentStep.view.status}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-[#09090b] rounded-xl border border-white/10 p-6 shadow-inner space-y-4">
                    <h4 className="text-lg font-bold text-white tracking-tight">{currentStep.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">{currentStep.detail}</p>

                    {currentStep.view.type === "url" && (
                      <div className="p-3 bg-[#18181b] rounded-lg border border-white/10 font-mono text-xs text-emerald-400 flex items-center justify-between">
                        <span>{currentStep.view.url}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}

                    {currentStep.view.type === "apps" && (
                      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                        {currentStep.view.apps?.map((app, idx) => (
                          <div key={idx} className="p-3 bg-[#18181b] rounded-lg border border-white/10 text-center font-bold text-white">
                            {app}
                          </div>
                        ))}
                      </div>
                    )}

                    {currentStep.view.type === "stream" && (
                      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                        <div className="p-3 bg-[#18181b] rounded-lg border border-white/10">
                          <span className="text-[10px] text-zinc-500 block">STREAM FPS</span>
                          <span className="text-emerald-400 font-bold text-sm">{currentStep.view.fps}</span>
                        </div>
                        <div className="p-3 bg-[#18181b] rounded-lg border border-white/10">
                          <span className="text-[10px] text-zinc-500 block">LATENCY</span>
                          <span className="text-indigo-400 font-bold text-sm">{currentStep.view.ping}</span>
                        </div>
                      </div>
                    )}

                    {currentStep.view.type === "sync" && (
                      <div className="space-y-2 font-mono text-xs">
                        {currentStep.view.devices?.map((dev, idx) => (
                          <div key={idx} className="p-2.5 bg-[#18181b] rounded-lg border border-white/10 flex items-center justify-between text-zinc-300">
                            <span>{dev}</span>
                            <span className="text-emerald-400 text-[10px] font-bold">State Active</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-white/5">
              <span>Click any step to preview</span>
              <span className="text-indigo-400 font-bold">Step {activeStep} of 4</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}




