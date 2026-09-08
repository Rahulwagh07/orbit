"use client";

import React, { useEffect, useRef, useState } from "react";

type HistItem = { cmd: string; out: string[] };

const HELP = ["help: show this list", "launch <chromium|vscode|terminal>: start one of these", "status: look at your own machine", "clear: start over"];

const APPS = ["chromium", "vscode", "terminal"];

export function Terminal({ onLaunch }: { onLaunch: (app: string) => void }) {
  const [hist, setHist] = useState<HistItem[]>([{ cmd: "", out: ["Type help, hit enter."] }]);
  const [val, setVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [hist]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const [verb, arg] = cmd.toLowerCase().split(/\s+/);
    if (verb === "clear") {
      setHist([]);
      return;
    }
    if (verb === "help") {
      setHist((h) => [...h, { cmd, out: HELP }]);
      return;
    }
    if (verb === "launch") {
      const app = arg ?? "chromium";
      if (!APPS.includes(app)) {
        setHist((h) => [...h, { cmd, out: [`no such app: ${app}. try chromium, vscode, terminal.`] }]);
        return;
      }
      onLaunch(app);
      setHist((h) => [...h, { cmd, out: [`In the real thing, ${app} would be running now.`, `Here you just get the words. Signed in, you get the app.`] }]);
      return;
    }
    if (verb === "status") {
      const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? "?";
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? "?";
      setHist((h) => [...h, { cmd, out: [`cores: ${cores} · device memory: ${mem} GB`, `orbit adds: 0 MB to your disk`] }]);
      return;
    }
    setHist((h) => [...h, { cmd, out: [`unknown: ${cmd}. try help.`] }]);
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="cursor-text rounded-xl border border-line bg-surface px-5 py-4 font-mono text-[12.5px] leading-relaxed"
    >
      <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted">orbit: type below</span>
      </div>
      <div className="max-h-[220px] space-y-3 overflow-y-auto">
        {hist.map((h, i) => (
          <div key={i}>
            {h.cmd && (
              <p className="text-ink">
                <span className="text-accent">$ </span>
                {h.cmd}
              </p>
            )}
            <div className="mt-1 space-y-0.5 text-muted">
              {h.out.map((l) => (
                <p key={l}>
                  <span className="mr-2 text-accent">→</span>
                  {l}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(val);
          setVal("");
        }}
        className="mt-3 flex items-center gap-2 border-t border-line pt-3"
      >
        <span className="text-accent">$</span>
        <input
          ref={inputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="help"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full bg-transparent text-ink outline-none placeholder:text-faint"
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
}
