"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Code2, Terminal, Lock, Play, RefreshCw, CheckCircle2, Shield } from "lucide-react";

type ActiveTab = "browser" | "code" | "terminal";

export function CloudDesktopPreview() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("browser");
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchTab = (tab: ActiveTab) => {
    if (activeTab === tab) return;
    setIsSwitching(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsSwitching(false);
    }, 300);
  };

  return (
    <div className="w-full rounded-2xl bg-[#121215] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden text-zinc-100 select-none">
      
      {/* Top OS Window Header */}
      <div className="h-11 bg-[#18181b] border-b border-white/10 px-4 flex items-center justify-between">
        {/* macOS Traffic Lights & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]/90 inline-block" />
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Interactive Workspace Tabs */}
          <div className="flex items-center gap-1">
            <TabButton
              active={activeTab === "browser"}
              onClick={() => handleSwitchTab("browser")}
              icon={<Globe className="w-3.5 h-3.5 text-indigo-400" />}
              label="Chromium Cloud"
            />
            <TabButton
              active={activeTab === "code"}
              onClick={() => handleSwitchTab("code")}
              icon={<Code2 className="w-3.5 h-3.5 text-indigo-400" />}
              label="VS Code Workspace"
            />
            <TabButton
              active={activeTab === "terminal"}
              onClick={() => handleSwitchTab("terminal")}
              icon={<Terminal className="w-3.5 h-3.5 text-indigo-400" />}
              label="Cloud Terminal"
            />
          </div>
        </div>

        {/* Live Stream Telemetry Pill */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE STREAM • 60 FPS
          </span>
          <span className="text-zinc-500 hidden sm:inline-block">11ms Latency</span>
        </div>
      </div>

      {/* Browser Bar (When Browser Tab Active) */}
      {activeTab === "browser" && (
        <div className="h-9 bg-[#18181b]/60 border-b border-white/5 px-4 flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#09090b] rounded-lg border border-white/10 flex-1 max-w-xl text-[11px] font-mono">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="text-zinc-200">https://cloud.internal/workspace/session-8492</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            1 Gbps Gigabit Bandwidth
          </span>
        </div>
      )}

      {/* Workspace Display Area */}
      <div className="relative aspect-[16/9] min-h-[380px] bg-[#09090b] p-6 md:p-8 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {isSwitching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-zinc-500 font-mono text-xs"
            >
              <div className="w-6 h-6 border-2 border-indigo-500/40 border-t-indigo-400 rounded-full animate-spin" />
              <span>Connecting display surface...</span>
            </motion.div>
          ) : activeTab === "browser" ? (
            <motion.div
              key="browser-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-2xl text-left"
            >
              {/* Browser Inside Surface Preview */}
              <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Chromium Desktop Environment</h4>
                      <p className="text-xs text-zinc-400">Zero Local Installation • Instant Execution</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-md font-bold">
                    Connected
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#09090b] rounded-lg border border-white/10">
                    <span className="text-[10px] text-zinc-500 block">DISPLAY STREAM</span>
                    <span className="text-white font-bold">1080p @ 60 FPS</span>
                  </div>
                  <div className="p-3 bg-[#09090b] rounded-lg border border-white/10">
                    <span className="text-[10px] text-zinc-500 block">LOCAL DISK USAGE</span>
                    <span className="text-emerald-400 font-bold">0 MB</span>
                  </div>
                  <div className="p-3 bg-[#09090b] rounded-lg border border-white/10">
                    <span className="text-[10px] text-zinc-500 block">SECURITY</span>
                    <span className="text-indigo-400 font-bold">Isolated Sandbox</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "code" ? (
            <motion.div
              key="code-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full h-full font-mono text-xs text-zinc-300 text-left space-y-2 max-w-2xl bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl"
            >
              <div className="text-zinc-500">// Orbit Remote Workspace</div>
              <div className="text-indigo-400">import &#123; CloudWorkspace &#125; from "@orbit/core";</div>
              <div className="text-zinc-300 mt-2">const session = await CloudWorkspace.launch(&#123;</div>
              <div className="text-zinc-300">  app: "chromium",</div>
              <div className="text-zinc-300">  persistSession: true,</div>
              <div className="text-zinc-300">  videoStream: "webrtc-h265",</div>
              <div className="text-zinc-300">&#125;);</div>
              <div className="text-emerald-400 font-bold pt-2">✓ Connected in 380ms (Session active)</div>
            </motion.div>
          ) : (
            <motion.div
              key="terminal-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full h-full font-mono text-xs text-zinc-300 text-left space-y-2 max-w-2xl bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl"
            >
              <div className="text-indigo-400">$ orbit session status</div>
              <div className="text-zinc-400">• Remote Instance:  Online</div>
              <div className="text-zinc-400">• Video Pipeline:   WebRTC H.265 (60 FPS)</div>
              <div className="text-zinc-400">• Motion Latency:   11.4 ms</div>
              <div className="text-emerald-400 font-bold pt-2">✓ Everything operational. Ready for input.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-[#09090b] text-white border border-white/10 shadow-sm font-semibold"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}






