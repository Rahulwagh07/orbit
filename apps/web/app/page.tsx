import { ClosingCta } from "../components/home/ClosingCta";
import { ComparisonSection } from "../components/home/ComparisonSection";
import { Header } from "../components/home/Header";
import { Hero } from "../components/home/Hero";
import { LoginModalProvider } from "../components/home/LoginModal";
import { ProblemNote } from "../components/home/ProblemNote";
import { StreamTimeline } from "../components/home/StreamTimeline";
import { TypeDemo } from "../components/home/TypeDemo";

export default function Home() {
  return (
    <LoginModalProvider>
      <div className="min-h-screen bg-paper text-ink">
        <Header />
        <main className="mx-auto max-w-3xl px-6">
          <Hero />
          <ProblemNote />
          <TypeDemo />
          <ComparisonSection />
        <StreamTimeline />
        <ClosingCta />
      </main>
      </div>
    </LoginModalProvider>
  );
}
