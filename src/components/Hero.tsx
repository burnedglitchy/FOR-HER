import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
};

const headline = "Hey Tanu";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const [typedHeadline, setTypedHeadline] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const stars: Star[] = [];
    let animationFrame = 0;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      stars.length = 0;

      for (let index = 0; index < 240; index += 1) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.5 + 0.2,
          speed: Math.random() * 0.18 + 0.025,
          alpha: Math.random() * 0.7 + 0.18,
        });
      }
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > window.innerHeight + 4) {
          star.y = -4;
          star.x = Math.random() * window.innerWidth;
        }

        context.beginPath();
        context.fillStyle = `rgba(255, 248, 243, ${star.alpha})`;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    const subtitle = subtitleRef.current;
    if (!section || !canvas || !content || !subtitle) return;

    const letters = Array.from(headline);
    const counter = { value: 0 };

    const context = gsap.context(() => {
      gsap.to(counter, {
        value: letters.length,
        duration: 2.35,
        ease: `steps(${letters.length})`,
        onUpdate: () => {
          setTypedHeadline(letters.slice(0, Math.round(counter.value)).join(""));
        },
      });

      gsap.fromTo(
        subtitle,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.15, delay: 1, ease: "power2.out" },
      );

      gsap.to(canvas, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(content, {
        autoAlpha: 0,
        y: -86,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "55% top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-shell grid min-h-[115vh] items-end px-6 py-20 sm:px-10 lg:px-20">
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.15),rgba(10,10,15,0.92))]" />
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl pb-[12vh]"
      >
        <p className="mb-5 font-body text-xs font-bold uppercase tracking-[0.34em] text-accent">
          Nakul to Tanu
        </p>
        <h1 className="min-h-[1.05em] font-display text-[clamp(4.5rem,13vw,13rem)] font-bold leading-[0.86] text-paper">
          {typedHeadline}
          <span className="ml-2 inline-block h-[0.82em] w-1 translate-y-2 bg-accent align-baseline" />
        </h1>
        <p
          ref={subtitleRef}
          className="mt-8 max-w-2xl text-xl leading-8 text-paper/72 sm:text-2xl sm:leading-9"
        >
          I know we met 1.5 weeks ago. Feels like I've known you forever.
        </p>
      </div>
    </section>
  );
}
