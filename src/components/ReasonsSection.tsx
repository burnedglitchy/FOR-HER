import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  "You somehow make losing in Valorant feel like winning",
  "Your voice is the best notification sound I know",
  "You're 775 km away and still the closest person to me",
  "The way you talk about things you love makes me love them too",
  "You make 1.5 weeks feel like a whole lifetime",
];

const noteStyles = [
  { color: "#ffe0e6", rotation: -4, span: "lg:translate-y-14" },
  { color: "#fff1bd", rotation: 3, span: "lg:-translate-y-2" },
  { color: "#d9f2ea", rotation: -2, span: "lg:translate-y-28" },
  { color: "#e6e1ff", rotation: 4, span: "lg:translate-y-4" },
  { color: "#ffd9c7", rotation: -3, span: "lg:-translate-y-10 lg:col-start-2" },
];

const flyIns = [
  { x: -120, y: 40 },
  { x: 120, y: -40 },
  { x: 0, y: 120 },
  { x: -90, y: -80 },
  { x: 110, y: 90 },
];

export default function ReasonsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          x: flyIns[index].x,
          y: flyIns[index].y,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: index * 0.13,
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
          },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-shell px-6 py-24 sm:px-10 lg:px-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_72%,rgba(230,57,70,0.1),transparent_28rem)]" />
      <Heart className="absolute right-[12%] top-[14%] text-accent/40" size={42} fill="currentColor" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-4 font-body text-xs font-bold uppercase tracking-[0.32em] text-accent">
            Reasons
          </p>
          <h2 className="font-display text-[clamp(3.2rem,8vw,7.8rem)] font-bold leading-[0.9] text-paper">
            A few things I keep replaying.
          </h2>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason}
              ref={(node) => {
                if (node) cardsRef.current[index] = node;
              }}
              initial={{ rotate: noteStyles[index].rotation }}
              animate={{ rotate: noteStyles[index].rotation }}
              whileHover={{
                y: -7,
                rotate: [
                  noteStyles[index].rotation,
                  noteStyles[index].rotation + 3,
                  noteStyles[index].rotation - 3,
                  noteStyles[index].rotation,
                ],
              }}
              transition={{ type: "spring", stiffness: 230, damping: 13 }}
              className={`reason-card min-h-56 p-6 shadow-[0_24px_42px_rgba(0,0,0,0.30)] ${noteStyles[index].span}`}
              style={{ backgroundColor: noteStyles[index].color }}
            >
              <p className="font-hand text-3xl font-bold leading-9 text-[#2b2225]">
                {reason}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
