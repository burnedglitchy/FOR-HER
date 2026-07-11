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

    // Shooting star state
    let nextShootingStarTime = Date.now() + 6000 + Math.random() * 4000;
    let shootingStar: {
      x: number;
      y: number;
      dx: number;
      dy: number;
      length: number;
      speed: number;
      opacity: number;
    } | null = null;

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
      
      // Draw background stars
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

      // Draw shooting star
      const now = Date.now();
      if (!shootingStar && now > nextShootingStarTime) {
        shootingStar = {
          x: Math.random() * (window.innerWidth * 0.6),
          y: Math.random() * (window.innerHeight * 0.3),
          dx: Math.random() * 3 + 4,
          dy: Math.random() * 1.5 + 1.5,
          length: Math.random() * 70 + 50,
          speed: Math.random() * 4 + 5,
          opacity: 1.0,
        };
        nextShootingStarTime = now + 8000 + Math.random() * 4000;
      }

      if (shootingStar) {
        shootingStar.x += shootingStar.dx * shootingStar.speed * 0.12;
        shootingStar.y += shootingStar.dy * shootingStar.speed * 0.12;
        shootingStar.opacity -= 0.015;

        if (
          shootingStar.opacity <= 0 ||
          shootingStar.x > window.innerWidth ||
          shootingStar.y > window.innerHeight
        ) {
          shootingStar = null;
        } else {
          context.beginPath();
          const grad = context.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.dx * shootingStar.length * 0.1,
            shootingStar.y - shootingStar.dy * shootingStar.length * 0.1
          );
          grad.addColorStop(0, `rgba(232, 196, 160, ${shootingStar.opacity * 0.65})`);
          grad.addColorStop(1, "rgba(232, 196, 160, 0)");
          context.strokeStyle = grad;
          context.lineWidth = 1.2;
          context.moveTo(shootingStar.x, shootingStar.y);
          context.lineTo(
            shootingStar.x - shootingStar.dx * shootingStar.length * 0.1,
            shootingStar.y - shootingStar.dy * shootingStar.length * 0.1
          );
          context.stroke();
        }
      }

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
        <p className="font-body text-xs font-semibold uppercase tracking-[0.42em] text-accent">
          Nakul to Tanu
        </p>
        <div className="mt-3 mb-6 h-[1px] w-28 bg-gradient-to-r from-accent-deep via-accent-light to-transparent opacity-80" />
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

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-80 pointer-events-none">
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-paper/70 [font-variant:all-small-caps]">
          scroll
        </span>
        <div className="animate-gentle-bounce text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
