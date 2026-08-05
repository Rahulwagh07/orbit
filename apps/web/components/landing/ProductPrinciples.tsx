"use client";

import React from "react";
import { motion } from "framer-motion";

const principles = [
  {
    num: "01",
    title: "THE APP RUNS THERE.",
    desc: "Your application executes on remote compute, not as a simulation inside the landing page.",
  },
  {
    num: "02",
    title: "THE INTERFACE RUNS HERE.",
    desc: "The browser handles windows, interaction and presentation natively.",
  },
  {
    num: "03",
    title: "THE NETWORK CONNECTS THEM.",
    desc: "Control traffic manages lifecycle. Realtime traffic carries the experience.",
  }
];

export function ProductPrinciples() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {principles.map((p, i) => (
            <motion.div 
              key={p.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="flex flex-col"
            >
              <div className="text-white/30 font-mono text-sm font-bold mb-4">
                {p.num}
              </div>
              <h3 className="text-white font-bold tracking-tight mb-4">
                {p.title}
              </h3>
              <p className="text-white/60 font-medium leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
