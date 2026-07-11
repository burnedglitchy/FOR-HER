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

const noTexts = ["No", "Nice try", "Nope", "Not happening", "Try again 😏"];

type ProposalSectionProps = {
  onAccepted: () => void;
};

export default function ProposalSection({ onAccepted }: ProposalSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRefs = useRef<HTMLParagraphElement[]>([]);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hasDodged, setHasDodged] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

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

    // Setup intersection observer to only activate dodge when in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    return () => {
      context.revert();
      observer.disconnect();
    };
  }, []);

  // Update button coordinates to match placeholder before first dodge
  useEffect(() => {
    const updatePosition = () => {
      if (!hasDodged && placeholderRef.current && buttonsVisible) {
        const rect = placeholderRef.current.getBoundingClientRect();
        setPos({ x: rect.left, y: rect.top });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    if (buttonsVisible) {
      const t = setTimeout(updatePosition, 100);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
        clearTimeout(t);
      };
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [buttonsVisible, hasDodged]);

  const dodge = () => {
    const btnWidth = 140;
    const btnHeight = 56;
    const margin = 40;
    const minX = margin;
    const maxX = window.innerWidth - btnWidth - margin;
    const minY = margin;
    const maxY = window.innerHeight - btnHeight - margin;

    const avoidRects: DOMRect[] = [];
    const yesContainer = document.getElementById("yes-maybe-container");
    if (yesContainer) {
      avoidRects.push(yesContainer.getBoundingClientRect());
    }

    let newX = pos ? pos.x : 0;
    let newY = pos ? pos.y : 0;

    for (let attempt = 0; attempt < 25; attempt += 1) {
      newX = minX + Math.random() * (maxX - minX);
      newY = minY + Math.random() * (maxY - minY);

      const btnRect = {
        left: newX,
        top: newY,
        right: newX + btnWidth,
        bottom: newY + btnHeight,
      };

      const overlaps = avoidRects.some((rect) => {
        return !(
          btnRect.right < rect.left ||
          btnRect.left > rect.right ||
          btnRect.bottom < rect.top ||
          btnRect.top > rect.bottom
        );
      });

      if (!overlaps) break;
    }

    setPos({ x: newX, y: newY });
    setHasDodged(true);
    setDodgeCount((prev) => prev + 1);
  };

  // Listen to proximity
  useEffect(() => {
    if (!isActive || !pos || !buttonsVisible) return;

    const handleMouseMove = (event: MouseEvent) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(event.clientX - btnCenterX, event.clientY - btnCenterY);

      if (dist < 80) {
        dodge();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(touch.clientX - btnCenterX, touch.clientY - btnCenterY);

      if (dist < 90) {
        dodge();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isActive, pos, buttonsVisible]);

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
              id="yes-maybe-container"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mt-12 flex flex-col justify-center items-center gap-4 sm:flex-row"
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

              {/* Placeholder for runaway button layout spacing */}
              <div
                ref={placeholderRef}
                className="w-[140px] h-[56px] shrink-0 pointer-events-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {buttonsVisible && pos && (
          <motion.button
            ref={buttonRef}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              dodge();
            }}
            onClick={(e) => {
              e.preventDefault();
              dodge();
            }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: 140,
              height: 56,
            }}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="z-50 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 font-bold text-paper/70 backdrop-blur-xl transition hover:border-red-500/40 hover:text-white pointer-events-auto select-none"
          >
            {noTexts[dodgeCount % noTexts.length]}
          </motion.button>
        )}
      </div>
    </section>
  );
}
