"use client";

import React from "react";
import { motion } from "framer-motion";

export function ProductTransition() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          The browser is only the interface.
        </h2>
        <p className="mt-6 text-lg text-white/60 font-medium max-w-2xl mx-auto leading-relaxed">
          The application itself runs on isolated remote compute. 
          When you launch an application, Orbit provisions a dedicated container, 
          starts the process, and establishes a bidirectional low-latency data channel.
        </p>
      </motion.div>
    </section>
  );
}
