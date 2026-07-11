import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DistanceMap() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const routeRef = useRef<SVGPathElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [planePos, setPlanePos] = useState({ x: 290, y: 188, angle: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const route = routeRef.current;
    if (!section || !route) return;

    const context = gsap.context(() => {
      const length = route.getTotalLength();
      gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });

      ScrollTrigger.create({
        trigger: section,
        start: "top 65%",
        once: true,
        onEnter: () => {
          gsap.to(route, {
            strokeDashoffset: 0,
            duration: 2.1,
            ease: "power2.inOut",
          });

          gsap.to({ val: 0 }, {
            val: 775,
            duration: 2.1,
            ease: "power2.out",
            onUpdate() {
              setDistance(Math.round(this.targets()[0].val));
            },
          });

          // Animate plane along path on loop
          const planeVal = { progress: 0 };
          gsap.to(planeVal, {
            progress: 1,
            duration: 15,
            repeat: -1,
            ease: "none",
            onUpdate() {
              const totalLength = route.getTotalLength();
              const currentLength = planeVal.progress * totalLength;
              const point = route.getPointAtLength(currentLength);
              const nextPoint = route.getPointAtLength(Math.min(currentLength + 2, totalLength));
              const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
              setPlanePos({ x: point.x, y: point.y, angle: angle });
            },
          });
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-shell flex items-center px-6 py-24 sm:px-10 lg:px-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(230,57,70,0.13),transparent_26rem)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
        <div>
          <p className="mb-4 flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.32em] text-accent">
            <MapPin size={16} />
            Delhi to Indore
          </p>
          <h2 className="font-display text-[clamp(3.6rem,9vw,8.5rem)] font-bold leading-[0.88] text-paper">
            {distance.toLocaleString("en-IN")}
          </h2>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.32em] text-paper/55">kilometres</p>
          
          <div className="mt-7 grid grid-cols-3 gap-2.5 max-w-[420px]">
            <div className="glass-panel rounded-xl p-3 text-center border border-white/5 bg-white/2">
              <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">by road</p>
              <p className="text-sm font-bold text-accent mt-0.5">14 hrs</p>
            </div>
            <div className="glass-panel rounded-xl p-3 text-center border border-white/5 bg-white/2">
              <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">by flight</p>
              <p className="text-sm font-bold text-accent mt-0.5">1.5 hrs</p>
            </div>
            <div className="glass-panel rounded-xl p-3 text-center border border-accent/20 bg-accent/5 shadow-[0_0_12px_rgba(201,149,108,0.12)]">
              <p className="text-[10px] uppercase tracking-wider text-accent-light font-semibold">by call</p>
              <p className="text-sm font-bold text-white mt-0.5 animate-pulse">0 seconds</p>
            </div>
          </div>

          <p className="mt-9 max-w-md font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            kilometers apart. Never felt closer.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[640px]">
          <svg
            viewBox="0 0 620 720"
            className="h-auto w-full drop-shadow-[0_24px_70px_rgba(230,57,70,0.14)]"
            role="img"
            aria-label="Route from Delhi to Indore on a simplified India map"
          >
            <path
              d="M278 38 C338 59 385 101 405 151 C452 172 493 219 497 273 C531 301 539 357 508 397 C518 450 486 506 431 523 C414 564 393 616 346 673 C317 633 296 592 251 562 C195 546 168 503 181 453 C132 423 107 367 134 316 C115 266 139 212 188 192 C196 121 226 72 278 38 Z"
              fill="rgba(255,248,243,0.035)"
              stroke="rgba(255,248,243,0.28)"
              strokeWidth="3"
            />
            {/* The long way (road route) */}
            <path
              id="roadRoute"
              d="M290 188 C220 240 230 320 260 380 C280 420 300 440 322 454"
              fill="none"
              stroke="rgba(201, 149, 108, 0.28)"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
            <text dy="-5" fontSize="10" fontFamily="Inter" fontWeight="500" fill="rgba(201, 149, 108, 0.65)" letterSpacing="0.05em">
              <textPath href="#roadRoute" startOffset="50%" textAnchor="middle">
                the way we've never driven
              </textPath>
            </text>

            <path
              d="M290 188 C282 240 292 285 315 330 C337 371 335 410 322 454"
              fill="none"
              stroke="rgba(255,248,243,0.08)"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              ref={routeRef}
              d="M290 188 C282 240 292 285 315 330 C337 371 335 410 322 454"
              fill="none"
              stroke="#e63946"
              strokeWidth="5"
              strokeLinecap="round"
            />
            
            {/* Animated plane */}
            <g transform={`translate(${planePos.x} ${planePos.y}) rotate(${planePos.angle})`}>
              <path
                d="M-7 0 L-2 -3 L-1 -7 L1 -7 L0 -3 L5 0 L0 3 L1 7 L-1 7 L-2 3 Z"
                fill="#e63946"
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
              />
            </g>

            <g transform="translate(290 188)">
              <circle className="pulse-ring" r="18" fill="none" stroke="#e63946" strokeWidth="3" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <circle r="7" fill="#e63946" />
              <text x="18" y="-13" fill="#fff8f3" fontSize="17" fontFamily="Inter" fontWeight="700">
                Delhi
              </text>
            </g>
            <g transform="translate(322 454)">
              <circle className="pulse-ring" r="18" fill="none" stroke="#e63946" strokeWidth="3" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <circle r="7" fill="#e63946" />
              <text x="19" y="23" fill="#fff8f3" fontSize="17" fontFamily="Inter" fontWeight="700">
                Indore
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
