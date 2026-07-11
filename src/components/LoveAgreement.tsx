import { motion } from "framer-motion";
import { Camera, Heart } from "lucide-react";

const vows = [
  "To be your honest, faithful, and loving partner for the rest of my days.",
  "To be a wonderful and adventurous lover, even across every kilometre between us.",
  "To be your guiding light in the darkness, a warming comfort in the cold, and a shoulder to lean on when life is too much to bear on your own.",
  "To honor, love, and cherish you through all life's adventures, wherever we go, we'll go together.",
  "To build my dreams around yours and make them a reality.",
  "To be there to catch you if you should stumble, carry you over every threshold, and fall in love with you every day.",
  "To love you with my whole heart and with a passion that cannot be expressed in any words.",
  "To be here with you and for you, forever and always.",
];

const sideHearts = Array.from({ length: 8 }, (_, index) => index);

export default function LoveAgreement() {
  const date = new Date().toLocaleDateString("en-IN");

  return (
    <section id="love-agreement" className="section-shell flex items-center justify-center px-4 py-20 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(230,57,70,0.14),transparent_30rem)]" />

      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl bg-paper p-3 text-paper-ink shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:p-5"
      >
        <div className="relative border-[3px] border-[#d35b8c] bg-[#fffdfb] p-4 sm:p-7">
          <div className="pointer-events-none absolute inset-2 border border-[#d35b8c]/55" />
          <div className="pointer-events-none absolute inset-x-5 top-5 h-[calc(100%-2.5rem)] border-x border-[#d35b8c]/30" />

          <div className="relative overflow-hidden border-2 border-[#c64180] bg-[#ffe6f0] p-4 text-[#c1125f]">
            <div className="absolute inset-0 opacity-40 [background-image:repeating-radial-gradient(circle_at_center,transparent_0_8px,rgba(193,18,95,0.32)_9px_10px),repeating-linear-gradient(45deg,transparent_0_9px,rgba(193,18,95,0.20)_10px_11px)]" />
            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div>
                <p className="font-display text-2xl font-bold sm:text-4xl">₹ 100</p>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]">One Hundred</p>
              </div>
              <div className="grid h-24 w-24 place-items-center rounded-full bg-[#e63946] text-white shadow-inner sm:h-28 sm:w-28">
                <Heart size={42} fill="currentColor" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold sm:text-4xl">Rs. 100</p>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]">India Non Judicial</p>
              </div>
            </div>
            <p className="relative mt-3 text-center font-body text-xs font-extrabold uppercase tracking-[0.32em] sm:text-sm">
              Bharat India Love Stamp
            </p>
          </div>

          <div className="relative px-6 pb-5 pt-7 sm:px-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex flex-col justify-around text-accent">
              {sideHearts.map((heart) => (
                <Heart key={`left-${heart}`} size={heart % 2 ? 19 : 24} fill="currentColor" opacity={heart % 2 ? 0.42 : 0.82} />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-around text-accent">
              {sideHearts.map((heart) => (
                <Heart key={`right-${heart}`} size={heart % 2 ? 24 : 19} fill="currentColor" opacity={heart % 2 ? 0.82 : 0.42} />
              ))}
            </div>

            <h2 className="text-center font-display text-4xl font-bold text-paper-ink sm:text-5xl">
              Love Agreement
            </h2>

            <div className="mx-auto mt-6 max-w-xl text-center font-display text-lg leading-8">
              <p>This agreement is signed between</p>
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                <span className="border-b-2 border-paper-ink px-3 text-2xl">Nakul</span>
                <span className="text-base">and</span>
                <span className="border-b-2 border-paper-ink px-3 text-2xl">Tanu</span>
              </div>
              <p>
                on the date of <span className="border-b-2 border-paper-ink px-5">{date}</span>
              </p>
            </div>

            <p className="mx-auto mt-7 max-w-2xl text-center font-display text-lg font-semibold leading-7">
              The above two persons have decided to be together for the rest of their lives and vow to live
              together bound by the conditions of love and happiness.
            </p>

            <h3 className="mt-7 text-center font-display text-2xl font-bold">
              Now, I hereby agree to the following:
            </h3>
            <ul className="mx-auto mt-4 max-w-2xl space-y-1.5 font-display text-base font-semibold leading-6 sm:text-lg sm:leading-7">
              {vows.map((vow) => (
                <li key={vow}>{vow}</li>
              ))}
            </ul>

            <p className="mt-8 text-center font-display text-lg font-semibold">
              I hereby agree to abide by these terms and conditions for the rest of my life.
            </p>

            <div className="relative mt-10 grid grid-cols-[1fr_96px_1fr] items-end gap-4 sm:grid-cols-[1fr_130px_1fr]">
              <div className="text-center">
                <p className="font-hand text-4xl">Nakul</p>
                <div className="mx-auto h-0.5 max-w-44 bg-paper-ink" />
                <p className="font-display text-sm font-bold">Signature Party One</p>
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -18, y: -45 }}
                whileInView={{ scale: 1, rotate: -6, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 220, damping: 11, delay: 0.35 }}
                className="relative mx-auto grid h-24 w-24 place-items-center rounded-[42%_48%_44%_50%] bg-[#9e0715] shadow-[inset_0_0_0_7px_rgba(255,255,255,0.08),0_14px_24px_rgba(0,0,0,0.32)] sm:h-28 sm:w-28"
              >
                <div className="absolute inset-3 rounded-[48%] border-2 border-[#5f030b]" />
                <Heart className="relative text-accent" size={36} fill="currentColor" />
              </motion.div>

              <div className="text-center">
                <p className="font-hand text-4xl">Tanu</p>
                <div className="mx-auto h-0.5 max-w-44 bg-paper-ink" />
                <p className="font-display text-sm font-bold">Signature Party Two</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center font-hand text-3xl text-paper">
          <Camera size={24} />
          Screenshot this 📸
        </p>
      </motion.div>
    </section>
  );
}
