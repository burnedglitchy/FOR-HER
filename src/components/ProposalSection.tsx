import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const proposalLines = [
  "I wasn't looking for this.",
  "But then I found you.",
  "And now I can't imagine not having you.",
  "Tanu — will you be mine?  ",
];

type ProposalSectionProps = {
  onAccepted: () => void;
};

export default function ProposalSection({ onAccepted }: ProposalSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRefs = useRef<HTMLParagraphElement[]>([]);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2400",
          scrub: 1,
          pin: true,
          onUpdate: (self) => setButtonsVisible(self.progress > 0.84),
        },
      });

      lineRefs.current.forEach((line, index) => {
        timeline.fromTo(
          line,
          { autoAlpha: 0, y: 35, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
          index * 0.36,
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  const accept = () => {
    void confetti({
      particleCount: 190,
      spread: 90,
      origin: { y: 0.62 },
      colors: ["#e63946", "#ffb3c1", "#fff8f3", "#f7c6d0"],
    });
    onAccepted();
  };

  return (
    <section ref={sectionRef} className="section-shell grid place-items-center px-6 py-24 text-center sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(230,57,70,0.12),transparent_31rem)]" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="space-y-7">
          {proposalLines.map((line, index) => (
            <p
              key={line}
              ref={(node) => {
                if (node) lineRefs.current[index] = node;
              }}
              className={
                index === proposalLines.length - 1
                  ? "font-display text-[clamp(3rem,7vw,8rem)] font-bold leading-[0.96] text-paper"
                  : "text-xl leading-8 text-paper/70 sm:text-3xl sm:leading-10"
              }
            >
              {index === proposalLines.length - 1 ? (
                <>
                  Tanu, will you be mine? <span className="pulse-glow inline-block"></span>
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </div>

        <AnimatePresence>
          {buttonsVisible && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"
            >
              <button
                type="button"
                onClick={accept}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-white shadow-[0_0_34px_rgba(230,57,70,0.38)] transition hover:scale-[0.99]"
              >
                <Heart size={19} fill="currentColor" />
                Yes 💗
              </button>
              <button
                type="button"
                onClick={accept}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/16 bg-white/8 px-8 py-4 font-bold text-paper backdrop-blur-xl transition hover:border-accent/60 hover:text-white"
              >
                Maybe yes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
