'use client'

import { motion } from 'framer-motion'
import { WindowState } from './Desktop'

interface DockProps {
  windows: WindowState[]
  onToggleAppWindows: (app: 'chromium' | 'vscode' | 'terminal') => void
}

export function Dock({ windows, onToggleAppWindows }: DockProps) {
  const chromeWins = windows.filter(w => w.applicationType === 'chromium')
  const vscodeWins = windows.filter(w => w.applicationType === 'vscode')
  const terminalWins = windows.filter(w => w.applicationType === 'terminal')

  const chromeStatus = chromeWins.length === 0 
    ? 'none' 
    : chromeWins.every(w => w.isMinimized) 
      ? 'minimized' 
      : 'active'

  const vscodeStatus = vscodeWins.length === 0
    ? 'none'
    : vscodeWins.every(w => w.isMinimized)
      ? 'minimized'
      : 'active'

  const terminalStatus = terminalWins.length === 0
    ? 'none'
    : terminalWins.every(w => w.isMinimized)
      ? 'minimized'
      : 'active'

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
        <div className="relative group flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1, y: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleAppWindows('chromium')}
            className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg relative"
          >
            <ChromeSVG />
          </motion.button>

          {chromeStatus !== 'none' && (
            <span 
              className={`w-1.5 h-1.5 rounded-full absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                chromeStatus === 'active' 
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                  : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              }`}
            />
          )}

          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-2 py-1 rounded">
            Chromium
          </div>
        </div>

        <div className="relative group flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1, y: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleAppWindows('vscode')}
            className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg relative"
          >
            <VSCodeSVG />
          </motion.button>

          {vscodeStatus !== 'none' && (
            <span 
              className={`w-1.5 h-1.5 rounded-full absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                vscodeStatus === 'active' 
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                  : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              }`}
            />
          )}

          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            VS Code
          </div>
        </div>

        <div className="relative group flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1, y: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleAppWindows('terminal')}
            className="w-14 h-14 flex items-center justify-center shadow-lg relative"
          >
            <TerminalSVG />
          </motion.button>

          {terminalStatus !== 'none' && (
            <span
              className={`w-1.5 h-1.5 rounded-full absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                terminalStatus === 'active'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              }`}
            />
          )}

          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Terminal
          </div>
        </div>
      </div>
    </div>
  )
}

function ChromeSVG() {
  return (
    <svg
      viewBox="-0.82 0 437.46 437.46"
      xmlns="http://www.w3.org/2000/svg"
      className="w-9 h-9"
    >
      <path
        d="M217.341.039s128.478-5.783 196.57 123.337H206.416s-39.188-1.289-72.593 46.255c-9.634 19.916-19.91 40.473-8.349 80.937C108.773 222.309 36.823 97.04 36.823 97.04S87.578 5.176 217.341.039z"
        fill="#c6352e"
      ></path>
      <path
        d="M407.223 327.871s-59.247 114.143-205.118 108.533c17.995-31.148 103.772-179.682 103.772-179.682s20.709-33.289-3.744-85.991c-12.431-18.305-25.09-37.486-65.919-47.713 32.836-.326 177.285.021 177.285.021s54.168 89.891-6.276 204.832z"
        fill="#f4d911"
      ></path>
      <path
        d="M28.373 328.738s-69.224-108.395 8.58-231.908c17.979 31.16 103.71 179.72 103.71 179.72s18.469 34.578 76.341 39.756c22.061-1.609 45.007-2.982 74.279-33.223-16.139 28.594-88.673 153.521-88.673 153.521S97.681 438.56 28.373 328.738z"
        fill="#81b354"
      ></path>
      <path
        d="M202.105 437.46l29.187-121.793s32.092-2.504 58.982-32.017c-16.693 29.365-88.169 153.81-88.169 153.81z"
        fill="#7baa50"
      ></path>
      <path
        d="M119.59 220.093c0-53.69 43.52-97.215 97.215-97.215 53.69 0 97.214 43.524 97.214 97.215 0 53.693-43.522 97.219-97.214 97.219-53.695 0-97.215-43.525-97.215-97.219z"
        fill="#ffffff"
      ></path>
      <linearGradient
        id="a"
        gradientUnits="userSpaceOnUse"
        x1="-829.128"
        y1="1417.339"
        x2="-829.128"
        y2="1261.441"
        gradientTransform="matrix(1 0 0 -1 1045.93 1557.636)"
      >
        <stop offset="0" stopColor="#a2c0e6"></stop>
        <stop offset="1" stopColor="#406cb1"></stop>
      </linearGradient>
      <path
        d="M135.86 220.093c0-44.702 36.238-80.941 80.945-80.941 44.698 0 80.94 36.239 80.94 80.941 0 44.703-36.242 80.945-80.94 80.945-44.707.001-80.945-36.244-80.945-80.945z"
        fill="url(#a)"
      ></path>
      <path
        d="M413.5 123.039l-120.183 35.237s-18.123-26.596-57.104-35.258c33.776-.115 177.287.021 177.287.021z"
        fill="#e7ce12"
      ></path>
      <path
        d="M123.137 246.197c-16.89-29.25-86.31-149.16-86.31-149.16l89.029 88.07s-9.149 18.82-5.68 45.7l2.961 15.39z"
        fill="#bc332c"
      ></path>
    </svg>
  )
}

function VSCodeSVG() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-9 h-9"
      fill="#007ACC"
    >
      <title>Visual Studio Code</title>
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  )
}

function TerminalSVG() {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <title>Terminal</title>
      <defs>
        <linearGradient id="terminal-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdfdfd" />
          <stop offset="0.35" stopColor="#e9e9eb" />
          <stop offset="1" stopColor="#a6a7ab" />
        </linearGradient>
        <linearGradient id="terminal-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b4a80" />
          <stop offset="0.18" stopColor="#1b3260" />
          <stop offset="0.6" stopColor="#101f42" />
          <stop offset="1" stopColor="#08122a" />
        </linearGradient>
        <linearGradient id="terminal-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="terminal-face-clip">
          <rect x="9" y="9" width="110" height="110" rx="25" />
        </clipPath>
      </defs>

      {/* Metallic rim */}
      <rect
        x="4"
        y="4"
        width="120"
        height="120"
        rx="29"
        fill="url(#terminal-rim)"
      />
      <rect
        x="4.5"
        y="4.5"
        width="119"
        height="119"
        rx="28.5"
        fill="none"
        stroke="#75767b"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Terminal face */}
      <rect x="9" y="9" width="110" height="110" rx="25" fill="url(#terminal-face)" />

      {/* Glass sheen across the top half */}
      <rect
        x="9"
        y="9"
        width="110"
        height="56"
        fill="url(#terminal-sheen)"
        clipPath="url(#terminal-face-clip)"
      />

      {/* Prompt glyph: > _ */}
      <path
        d="M41 50 L61 70 L41 90"
        fill="none"
        stroke="#f5f5f7"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="69"
        y1="84.5"
        x2="95"
        y2="84.5"
        stroke="#f5f5f7"
        strokeWidth="11"
        strokeLinecap="round"
      />
    </svg>
  )
}
