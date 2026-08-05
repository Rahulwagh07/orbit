"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CloudDesktopPreview() {
  const [step, setStep] = useState(0);

  // Animation sequence
  useEffect(() => {
    // 0: Initial state, cursor idle
    // 1: Cursor moves to dock
    // 2: Dock icon magnifies/hover
    // 3: Click
    // 4: Window opens & Setting up
    // 5: Chromium UI loads
    // 6: Page content appears

    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setStep(1); // Move cursor
      await new Promise(r => setTimeout(r, 1200));
      setStep(2); // Hover
      await new Promise(r => setTimeout(r, 400));
      setStep(3); // Click
      await new Promise(r => setTimeout(r, 200));
      setStep(4); // Open window
      await new Promise(r => setTimeout(r, 1500));
      setStep(5); // Chromium UI
      await new Promise(r => setTimeout(r, 800));
      setStep(6); // Page content
    };

    sequence();
  }, []);

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-w-5xl mx-auto rounded-xl overflow-hidden border border-black/10 shadow-2xl bg-[#1c1c1e] text-white select-none ring-1 ring-white/10">
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3") no-repeat center center',
          backgroundSize: 'cover'
        }}
      />
      
      {/* Top Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center px-3 text-[11px] font-medium tracking-wide z-10">
        <div className="flex gap-4">
          <span className="font-bold">Infinity</span>
          <span className="opacity-80">File</span>
          <span className="opacity-80">Edit</span>
          <span className="opacity-80">View</span>
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl z-20">
        <motion.div 
          className="relative group w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden origin-bottom"
          animate={{
            scale: step >= 2 && step <= 3 ? 1.2 : 1,
            y: step >= 2 && step <= 3 ? -10 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Chromium Logo SVG */}
          <ChromeIcon />
          
          {/* Active dot */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" 
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Application Window */}
      <AnimatePresence>
        {step >= 4 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute top-[10%] left-[10%] right-[10%] bottom-[15%] bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Chrome Top Bar */}
            <div className="h-10 bg-[#2d2d2d] flex items-center px-4 gap-4 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              
              <div className="flex-1 flex justify-center">
                <AnimatePresence mode="wait">
                  {step === 4 ? (
                    <motion.div
                      key="setting-up"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-white/50 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 border border-white/50 border-t-transparent rounded-full animate-spin" />
                      Setting up environment...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="address-bar"
                      initial={{ opacity: 0, width: "60%" }}
                      animate={{ opacity: 1, width: "80%" }}
                      className="h-6 bg-[#1a1a1a] rounded-md px-3 text-xs flex items-center text-white/70"
                    >
                      cloud-infinity.com
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 bg-white relative">
              <AnimatePresence>
                {step >= 6 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 p-8 flex flex-col items-center justify-center text-black"
                  >
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl mb-6 shadow-xl flex items-center justify-center">
                       <span className="text-white font-bold text-2xl">∞</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome to the Cloud</h2>
                    <p className="text-gray-500 max-w-md text-center">
                      This browser is running entirely on remote compute.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Cursor */}
      <motion.div 
        className="absolute w-5 h-5 z-50 pointer-events-none"
        initial={{ x: "70%", y: "40%" }}
        animate={{ 
          x: step >= 1 ? "50%" : "70%", 
          y: step >= 1 ? "calc(100% - 60px)" : "40%",
          scale: step === 3 ? 0.9 : 1
        }}
        transition={{ 
          x: { duration: 1.2, ease: "easeInOut" },
          y: { duration: 1.2, ease: "easeInOut" },
          scale: { duration: 0.1 }
        }}
        style={{ translateX: "-50%", translateY: "-50%" }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
          <path d="M4 2.5L19 11.5L11.5 13.5L8.5 21L4 2.5Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </motion.div>

    </div>
  );
}

function ChromeIcon() {
  return (
    <svg viewBox="-0.82 0 437.46 437.46" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-1">
      <path d="M217.341.039s128.478-5.783 196.57 123.337H206.416s-39.188-1.289-72.593 46.255c-9.634 19.916-19.91 40.473-8.349 80.937C108.773 222.309 36.823 97.04 36.823 97.04S87.578 5.176 217.341.039z" fill="#c6352e"/>
      <path d="M407.223 327.871s-59.247 114.143-205.118 108.533c17.995-31.148 103.772-179.682 103.772-179.682s20.709-33.289-3.744-85.991c-12.431-18.305-25.09-37.486-65.919-47.713 32.836-.326 177.285.021 177.285.021s54.168 89.891-6.276 204.832z" fill="#f4d911"/>
      <path d="M28.373 328.738s-69.224-108.395 8.58-231.908c17.979 31.16 103.71 179.72 103.71 179.72s18.469 34.578 76.341 39.756c22.061-1.609 45.007-2.982 74.279-33.223-16.139 28.594-88.673 153.521-88.673 153.521S97.681 438.56 28.373 328.738z" fill="#81b354"/>
      <path d="M202.105 437.46l29.187-121.793s32.092-2.504 58.982-32.017c-16.693 29.365-88.169 153.81-88.169 153.81z" fill="#7baa50"/>
      <path d="M119.59 220.093c0-53.69 43.52-97.215 97.215-97.215 53.69 0 97.214 43.524 97.214 97.215 0 53.693-43.522 97.219-97.214 97.219-53.695 0-97.215-43.525-97.215-97.219z" fill="#ffffff"/>
      <path d="M135.86 220.093c0-44.702 36.238-80.941 80.945-80.941 44.698 0 80.94 36.239 80.94 80.941 0 44.703-36.242 80.945-80.94 80.945-44.707.001-80.945-36.244-80.945-80.945z" fill="#406cb1"/>
      <path d="M413.5 123.039l-120.183 35.237s-18.123-26.596-57.104-35.258c33.776-.115 177.287.021 177.287.021z" fill="#e7ce12"/>
      <path d="M123.137 246.197c-16.89-29.25-86.31-149.16-86.31-149.16l89.029 88.07s-9.149 18.82-5.68 45.7l2.961 15.39z" fill="#bc332c"/>
    </svg>
  );
}
