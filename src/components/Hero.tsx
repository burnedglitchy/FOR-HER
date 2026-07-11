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
        context.fillStyle = `rgba(245, 236, 215, ${star.alpha * 0.72})`;
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(201,149,108,0.11),transparent_30rem),linear-gradient(180deg,rgba(10,6,9,0.12),rgba(10,6,9,0.94))]" />
      <div
        ref={contentRef}
        className="relative z-10 max-w-6xl pb-[12vh]"
      >
        <p className="mb-6 font-body text-xs font-semibold uppercase tracking-[0.42em] text-accent">
          Nakul to Tanu
        </p>
        <h1 className="min-h-[1.05em] font-display text-[clamp(4.75rem,13vw,13rem)] font-bold leading-[0.84] text-paper">
          {typedHeadline}
          <span className="ml-3 inline-block h-[0.82em] w-1 translate-y-2 bg-gradient-to-b from-accent-light to-accent-deep align-baseline shadow-[0_0_18px_rgba(201,149,108,0.55)]" />
        </h1>
        <p
          ref={subtitleRef}
          className="mt-9 max-w-2xl text-xl leading-8 text-muted sm:text-2xl sm:leading-10"
        >
          I know we met 1.5 weeks ago. Feels like I've known you forever.
        </p>
      </div>
    </section>
  );
}
