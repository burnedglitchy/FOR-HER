import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart } from "lucide-react";
import placeholderPhoto from "../assets/photos/Fo8LNKmaYAE2nWh.jpg";
import img1 from "../assets/photos/IMG_20260709_200208_893.jpg";
import img5 from "../assets/photos/IMG_20260709_201426_120.jpg";
import img2 from "../assets/photos/IMG_20260711_002300_126.jpg";
import img3 from "../assets/photos/IMG_20260709_201546_709.jpg";

gsap.registerPlugin(ScrollTrigger);

const polaroids = [
  { src: img2, caption: "CUTIE", rotation: -4 },
  { src: img1, caption: "CHATPATI", rotation: 3 },
  { src: img5, caption: "AWWW", rotation: -2 },
  { src: img3, caption: "POOKIE", rotation: 4 },
  { src: placeholderPhoto, caption: "US?", rotation: -3 },
];

const entranceOffsets = [
  { x: -120, y: 90 },
  { x: 80, y: -100 },
  { x: 0, y: 130 },
  { x: 130, y: 70 },
  { x: -90, y: -80 },
];

const hearts = [
  "left-[7%] top-[18%]",
  "left-[22%] bottom-[16%]",
  "left-[46%] top-[12%]",
  "right-[21%] bottom-[14%]",
  "right-[8%] top-[26%]",
];

export default function PolaroidGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const desktopThreadRef = useRef<SVGPathElement | null>(null);
  const mobileThreadRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const context = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          x: entranceOffsets[index].x,
          y: entranceOffsets[index].y,
          rotate: polaroids[index].rotation * 2,
          autoAlpha: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
          delay: index * 0.15,
        });
      });

      const dThread = desktopThreadRef.current;
      const mThread = mobileThreadRef.current;

      if (window.matchMedia("(min-width: 768px)").matches) {
        gsap.to(track, {
          x: () => {
            const overflow = track.scrollWidth - section.clientWidth + 160;
            return overflow > 0 ? -overflow : 0;
          },
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(track.scrollWidth, window.innerWidth)}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        if (dThread) {
          const length = dThread.getTotalLength();
          gsap.set(dThread, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(dThread, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.max(track.scrollWidth, window.innerWidth)}`,
              scrub: 1,
            },
          });
        }
      } else {
        if (mThread) {
          const length = mThread.getTotalLength();
          gsap.set(mThread, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(mThread, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "bottom 90%",
              scrub: 0.5,
            },
          });
        }
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-shell min-h-screen px-6 py-20 sm:px-10 lg:px-20">
      <div className="noise-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_34rem)]" />
      {hearts.map((position, index) => (
        <Heart
          key={position}
          className={`heart-float absolute ${position} text-accent/70`}
          size={index % 2 ? 18 : 24}
          fill="currentColor"
          style={{ animationDelay: `${index * 0.45}s` }}
        />
      ))}

      <div className="relative z-10 mb-14 max-w-4xl">
        <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.32em] text-accent">
          Little frames
        </p>
        <h2 className="font-display text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] text-paper">
          Proof that distance still kept memories.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="relative z-10 flex w-full flex-col items-center gap-8 pb-12 md:w-max md:flex-row md:items-start md:gap-10 lg:gap-12"
      >
        {/* Desktop thread */}
        <svg
          viewBox="0 0 1800 80"
          preserveAspectRatio="none"
          className="absolute top-[20px] inset-x-0 h-[80px] pointer-events-none z-0 hidden md:block"
          style={{ width: "100%" }}
        >
          <path
            ref={desktopThreadRef}
            d="M 0,30 Q 150,65 300,30 Q 450,65 600,30 Q 750,65 900,30 Q 1050,65 1200,30 Q 1350,65 1500,30 Q 1650,65 1800,30"
            fill="none"
            stroke="rgba(201, 149, 108, 0.55)"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Mobile thread */}
        <svg
          viewBox="0 0 50 2000"
          preserveAspectRatio="none"
          className="absolute left-[15%] top-10 w-[40px] h-[calc(100%-80px)] pointer-events-none z-0 md:hidden"
        >
          <path
            ref={mobileThreadRef}
            d="M 25,0 C 45,250 5,500 25,750 C 45,1000 5,1250 25,1500 C 45,1750 25,2000"
            fill="none"
            stroke="rgba(201, 149, 108, 0.55)"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {polaroids.map((card, index) => (
          <motion.div
            key={`${card.caption}-${index}`}
            ref={(node) => {
              if (node) cardsRef.current[index] = node;
            }}
            initial={{ rotate: card.rotation }}
            whileHover={{ y: -8, rotate: 0, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 210, damping: 17 }}
            className="relative w-[min(78vw,270px)] shrink-0 bg-white p-3 pb-6 shadow-[0_24px_44px_rgba(0,0,0,0.34)] sm:w-[290px] lg:w-[320px]"
          >
            {/* Hanging Pin Detail */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent-deep border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] z-25" />

            <div className="aspect-[4/5] overflow-hidden bg-[#f4d9de]">
              <img
                src={card.src}
                alt={card.caption}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="h-full w-full bg-[linear-gradient(135deg,rgba(230,57,70,0.22),rgba(255,248,243,0.2))]" />
            </div>
            <p className="pt-4 text-center font-hand text-2xl font-bold text-[#3a2a2f]">
              {card.caption}
              <Heart className="ml-1 inline text-accent" size={15} fill="currentColor" />
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
