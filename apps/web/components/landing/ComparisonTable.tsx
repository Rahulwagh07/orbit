"use client";

import React from "react";
import { Check, X, Sparkles } from "lucide-react";

const rows = [
  {
    feature: "Setup & Provisioning Time",
    orbit: "< 1 Second",
    traditionalVdi: "5 - 15 Minutes",
    localMachine: "Hours / OS Setup",
  },
  {
    feature: "Motion Stream Frame Rate",
    orbit: "60 FPS Ultra-HD",
    traditionalVdi: "15 - 30 FPS Laggy",
    localMachine: "Native Hardware",
  },
  {
    feature: "Glass-to-Glass Latency",
    orbit: "< 15ms WebRTC",
    traditionalVdi: "150ms+ RDP/VNC",
    localMachine: "0ms Local",
  },
  {
    feature: "Isolated Sandbox Protection",
    orbit: true,
    traditionalVdi: false,
    localMachine: false,
  },
  {
    feature: "Cross-Device Handoff",
    orbit: true,
    traditionalVdi: false,
    localMachine: false,
  },
  {
    feature: "Battery & Thermal Friendly",
    orbit: true,
    traditionalVdi: false,
    localMachine: false,
  },
];

export function ComparisonTable() {
  return (
    <section id="comparison" className="py-28 px-4 md:px-6 relative bg-[#07080f] border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Modern Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Orbit Wins
          </h2>
          <p className="mt-3 text-base text-white/60 font-normal">
            See how Orbit compares to legacy desktop streaming and traditional hardware.
          </p>
        </div>

        {/* Table Container */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="py-4 px-6 font-bold text-white/60 uppercase tracking-wider text-xs">
                    Capability
                  </th>
                  <th className="py-4 px-6 font-extrabold text-indigo-400 bg-indigo-500/10 border-x border-indigo-500/20 text-sm">
                    Orbit
                  </th>
                  <th className="py-4 px-6 font-medium text-white/60">
                    Legacy VDI / Citrix
                  </th>
                  <th className="py-4 px-6 font-medium text-white/60">
                    Local Laptop
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-semibold text-white/90">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400 bg-indigo-500/5 border-x border-indigo-500/10">
                      {typeof row.orbit === "boolean" ? (
                        row.orbit ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <Check className="w-4 h-4" /> Yes
                          </div>
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )
                      ) : (
                        row.orbit
                      )}
                    </td>
                    <td className="py-4 px-6 text-white/50">
                      {typeof row.traditionalVdi === "boolean" ? (
                        row.traditionalVdi ? (
                          <Check className="w-4 h-4 text-white/70" />
                        ) : (
                          <div className="flex items-center gap-1.5 text-white/40">
                            <X className="w-4 h-4 text-white/30" /> No
                          </div>
                        )
                      ) : (
                        row.traditionalVdi
                      )}
                    </td>
                    <td className="py-4 px-6 text-white/50">
                      {typeof row.localMachine === "boolean" ? (
                        row.localMachine ? (
                          <Check className="w-4 h-4 text-white/70" />
                        ) : (
                          <div className="flex items-center gap-1.5 text-white/40">
                            <X className="w-4 h-4 text-white/30" /> No
                          </div>
                        )
                      ) : (
                        row.localMachine
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
