"use client";

import { motion, useMotionValue } from "framer-motion";
import { WindowState } from "./Desktop";
import { RemoteApplicationSurface } from "./RemoteApplicationSurface";
import { Maximize2, Minus, X, Check, Circle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDragControls } from "framer-motion";

interface DesktopWindowProps {
  windowState: WindowState;
  isMinimized: boolean;
  isMaximized: boolean;
  onToggleMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

export function DesktopWindow({ 
  windowState, 
  isMinimized, 
  isMaximized, 
  onToggleMinimize, 
  onToggleMaximize, 
  onClose 
}: DesktopWindowProps) {
  const [position] = useState({ x: 100, y: 100 });
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (isMaximized || isMinimized) {
      x.set(0);
      y.set(0);
    }
  }, [isMaximized, isMinimized, x, y]);

  return (
    <motion.div
      drag={!isMaximized && !isMinimized}
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={isMinimized ? {
        opacity: 0,
        scale: 0.05,
        y: 400,
      } : {
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        position: "absolute",
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? "100%" : "min(95%, 1024px)",
        height: isMaximized ? "100%" : "min(90%, 650px)",
        zIndex: isMaximized ? 40 : 10,
        pointerEvents: isMinimized ? "none" : "auto",
        x,
        y,
      }}
      className="bg-black/90 rounded-xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
    >
      {/* Titlebar */}
      <div 
        className="titlebar h-10 bg-white/10 flex items-center px-4 cursor-grab active:cursor-grabbing border-b border-white/10 select-none"
        onPointerDown={(e) => {
          if (!(e.target as HTMLElement).closest("button")) dragControls.start(e);
        }}
      >
        <div className="flex gap-2 w-20">
          <button type="button" title="Close" onPointerDown={(e) => e.stopPropagation()} onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group">
            <X size={10} className="opacity-0 group-hover:opacity-100 text-black" />
          </button>
          <button type="button" title={isMinimized ? "Restore" : "Minimize"} onPointerDown={(e) => e.stopPropagation()} onClick={onToggleMinimize} className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group">
            <Minus size={10} className="opacity-0 group-hover:opacity-100 text-black" />
          </button>
          <button type="button" title={isMaximized ? "Restore" : "Maximize"} onPointerDown={(e) => e.stopPropagation()} onClick={onToggleMaximize} className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group">
            <Maximize2 size={10} className="opacity-0 group-hover:opacity-100 text-black" />
          </button>
        </div>
        <div className="flex-1 text-center text-sm font-medium text-white/80">
          {windowState.title}
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
        {windowState.status === "deploying" ? (
          <DeploymentProgress phase={windowState.phase || "INITIALIZING"} />
        ) : (
          <RemoteApplicationSurface windowState={windowState} />
        )}
      </div>
    </motion.div>
  );
}

const DEPLOYMENT_STEPS = [
  { id: "INITIALIZING", label: "Initializing deployment request" },
  { id: "CREATING_RESOURCES", label: "Allocating cloud resources" },
  { id: "CONTAINER_STARTING", label: "Starting virtualization engine" },
  { id: "WAITING_READY", label: "Waiting for application readiness" },
  { id: "CONFIGURING_NETWORK", label: "Configuring network tunnels" },
];

function DeploymentProgress({ phase }: { phase: string }) {
  const currentIndex = DEPLOYMENT_STEPS.findIndex((s) => s.id === phase);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const isFailed = phase === "FAILED";

  return (
    <div className="flex flex-col items-center max-w-md w-full px-8 py-10 bg-black/40 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-white/90 tracking-tight">Deploying Application</h2>
        <p className="text-sm text-white/50 mt-1 text-center">Provisioning your remote environment</p>
      </div>

      <div className="w-full space-y-4">
        {DEPLOYMENT_STEPS.map((step, index) => {
          const isCompleted = index < activeIndex || phase === "READY";
          const isActive = index === activeIndex && !isFailed && phase !== "READY";

          return (
            <div key={step.id} className="flex items-center gap-4 relative">
              {/* Connecting line */}
              {index !== DEPLOYMENT_STEPS.length - 1 && (
                <div 
                  className={`absolute left-3.5 top-9 w-0.5 h-6 -translate-x-1/2 ${
                    isCompleted ? "bg-blue-500/50" : "bg-white/10"
                  }`}
                />
              )}
              
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border z-10 transition-colors duration-300 ${
                  isCompleted 
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
                    : isActive
                    ? "bg-white/10 border-white/30 text-white"
                    : "bg-transparent border-white/10 text-white/30"
                }`}
              >
                {isCompleted ? (
                  <Check size={14} className="animate-in zoom-in duration-300" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                ) : (
                  <Circle size={10} className="opacity-50" />
                )}
              </div>
              
              <div className={`text-sm font-medium transition-colors duration-300 ${
                isCompleted 
                  ? "text-white/70"
                  : isActive
                  ? "text-white"
                  : "text-white/30"
              }`}>
                {step.label}
              </div>
            </div>
          );
        })}

        {isFailed && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            Deployment failed. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
