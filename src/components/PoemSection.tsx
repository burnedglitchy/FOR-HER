import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const poemLines = [
  "From a city of lights I found",
  "a voice that felt like home,",
  "a laugh that crossed the distance",
  "and made me less alone.",
  "I don't know how 1.5 weeks",
  "can hold this much of you —",
  "but every time we talk, Tanu,",
  "I know that this is true.",
];

const PoemFlourish = () => (
  <svg
    viewBox="0 0 300 24"
    className="mx-auto w-56 h-auto text-accent opacity-75 select-none pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <path d="M10 12h80c10 0 15-8 25-8s15 8 25 8h10c10 0 15-8 25-8s15 8 25 8h80" />
    <path d="M140 12c5-5 10-5 15 0s10 5 15 0" />
    <circle cx="150" cy="12" r="3" fill="currentColor" />
  </svg>
);

export default function PoemSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          end: "bottom 45%",
          scrub: 1,
        },
      });

      lineRefs.current.forEach((line, index) => {
        timeline.fromTo(
          line,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
          index * 0.22,
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-shell flex min-h-[145vh] items-center justify-center px-6 py-28 sm:px-10">
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(230,57,70,0.12),rgba(230,57,70,0.04)_42%,transparent_70%)] blur-2xl" />
      
      {/* Floating dust particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="dust-particle"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 6 + 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-8">
          <PoemFlourish />
        </div>
        
        <div className="my-6">
          {poemLines.map((line, index) => (
            <p
              key={`${line}-${index}`}
              ref={(node) => {
                if (node) lineRefs.current[index] = node;
              }}
              className="font-display text-[clamp(2.15rem,5vw,5.75rem)] font-semibold italic leading-[1.08] text-paper"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="mt-8">
          <PoemFlourish />
        </div>
      </div>
    </section>
  );
}
