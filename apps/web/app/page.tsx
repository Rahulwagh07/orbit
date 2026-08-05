import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { ProductTransition } from "../components/landing/ProductTransition";
import { LaunchSequence } from "../components/landing/LaunchSequence";
import { ArchitectureDiagram } from "../components/landing/ArchitectureDiagram";
import { RealtimeFlow } from "../components/landing/RealtimeFlow";
import { ComputeInstance } from "../components/landing/ComputeInstance";
import { TechnicalTerminal } from "../components/landing/TechnicalTerminal";
import { ProductPrinciples } from "../components/landing/ProductPrinciples";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/90 font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
      <Navbar />
      <main>
        <Hero />
        <div id="product">
          <ProductTransition />
          <LaunchSequence />
        </div>
        <RealtimeFlow />
        <ArchitectureDiagram />
        <ComputeInstance />
        <TechnicalTerminal />
        <ProductPrinciples />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
