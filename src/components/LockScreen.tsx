import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Sparkles } from "lucide-react";

const PASSWORD = "tanu";
const CHIME_URL = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";

type LockScreenProps = {
  onUnlock: () => void;
};

type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
};

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

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

      for (let index = 0; index < 190; index += 1) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.6 + 0.25,
          speed: Math.random() * 0.24 + 0.04,
          alpha: Math.random() * 0.65 + 0.2,
        });
      }
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const gradient = context.createRadialGradient(
        window.innerWidth * 0.5,
        window.innerHeight * 0.35,
        0,
        window.innerWidth * 0.5,
        window.innerHeight * 0.35,
        window.innerWidth * 0.72,
      );
      gradient.addColorStop(0, "rgba(230, 57, 70, 0.10)");
      gradient.addColorStop(0.5, "rgba(22, 24, 42, 0.20)");
      gradient.addColorStop(1, "rgba(10, 10, 15, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > window.innerHeight + 6) {
          star.y = -6;
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

  const playChime = () => {
    try {
      const chime = new Audio(CHIME_URL);
      chime.volume = 0.22;
      void chime.play().catch(() => undefined);
    } catch {
      // Silence is an acceptable fallback for browsers that block autoplay.
    }
  };

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === PASSWORD) {
      setIsUnlocking(true);
      playChime();
      window.setTimeout(onUnlock, 680);
      return;
    }

    setErrorKey((current) => current + 1);
  };

  return (
    <AnimatePresence>
      {!isUnlocking && (
        <motion.section
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-night px-6"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(18px)" }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.58)_70%)]" />

          <motion.form
            key={errorKey}
            onSubmit={submitPassword}
            animate={errorKey ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
            transition={{ duration: 0.38 }}
            className="glass-panel relative w-full max-w-sm rounded-lg p-6 sm:p-8"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30">
                <LockKeyhole size={20} />
              </span>
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-[0.28em] text-muted">
                  Private Sky
                </p>
                <h1 className="font-display text-3xl font-bold text-paper">For Tanu</h1>
              </div>
            </div>

            <label htmlFor="password" className="mb-2 block text-sm font-medium text-paper/80">
              Enter the word that opens this night.
            </label>
            <input
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mb-4 w-full rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-paper outline-none transition focus:border-accent/70 focus:shadow-[0_0_0_4px_rgba(230,57,70,0.16)]"
              placeholder="Password"
              type="password"
              autoComplete="off"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-[0_0_26px_rgba(230,57,70,0.35)] transition hover:scale-[0.99] hover:shadow-[0_0_34px_rgba(230,57,70,0.48)]"
            >
              <Sparkles size={18} />
              Unlock
            </button>
          </motion.form>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
