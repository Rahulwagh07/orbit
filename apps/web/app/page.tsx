import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { ProductPrinciples } from "../components/landing/ProductPrinciples";
import { LaunchSequence } from "../components/landing/LaunchSequence";
import { RealtimeFlow } from "../components/landing/RealtimeFlow";
import { ArchitectureDiagram } from "../components/landing/ArchitectureDiagram";
import { ComputeInstance } from "../components/landing/ComputeInstance";
import { TechnicalTerminal } from "../components/landing/TechnicalTerminal";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-100 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <div id="product">
          <ProductPrinciples />
          <LaunchSequence />
        </div>
        <RealtimeFlow />
        <ArchitectureDiagram />
        <ComputeInstance />
        <div id="terminal">
          <TechnicalTerminal />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}


