import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DistanceMap from "./components/DistanceMap";
import Hero from "./components/Hero";
import LockScreen from "./components/LockScreen";
import LoveAgreement from "./components/LoveAgreement";
import PoemSection from "./components/PoemSection";
import PolaroidGallery from "./components/PolaroidGallery";
import ProposalSection from "./components/ProposalSection";
import ReasonsSection from "./components/ReasonsSection";
import { useScrollProgress } from "./hooks/useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    if (!unlocked) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [unlocked]);

  const acceptProposal = () => {
    setShowAgreement(true);
    window.setTimeout(() => {
      document.getElementById("love-agreement")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);
  };

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-1 bg-accent" style={{ width: `${progress * 100}%` }} />
      <main>
        <Hero />
        <DistanceMap />
        <PolaroidGallery />
        <ReasonsSection />
        <PoemSection />
        <ProposalSection onAccepted={acceptProposal} />
        {showAgreement && <LoveAgreement />}
      </main>
    </>
  );
}
