"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMessageCircle,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import TiltCard from "@/components/ui/TiltCard";
import SectionHeading from "@/components/ui/SectionHeading";

interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (testimonials.length > 0 && current >= testimonials.length) {
      setCurrent(0);
    }
  }, [testimonials.length, current]);

  const goTo = (index: number) => {
    if (!testimonials.length) return;
    setDirection(index > current ? 1 : -1);
    setCurrent((index + testimonials.length) % testimonials.length);
  };

  const next = () => goTo((current + 1) % testimonials.length);
  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  const t = testimonials[current];
  const progress = ((current + 1) / testimonials.length) * 100;

  const slideVariants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? 90 : -90,
      rotateY: d > 0 ? 18 : -18,
      scale: 0.94,
    }),
    center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? -90 : 90,
      rotateY: d > 0 ? -18 : 18,
      scale: 0.94,
    }),
  };

  return (
    <section
      id="testimonials"
      className="section-padding relative overflow-hidden bg-gradient-to-b from-[#f7faf4] via-[#f9fcf5] to-[#f3f8ee] dark:from-[#0b0f0c] dark:via-[#101412] dark:to-[#0d120e]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-1/4 h-80 w-80 rounded-full bg-[#c9f36c]/15 blur-[120px]" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#c9f36c]/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#a8d94a]/10 blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9f36c]/40 to-transparent" />
      </div>

      <div className="max-width relative z-10">
        <SectionHeading
          title="Client Testimonials"
          kicker="Testimonials"
          subtitle="Unfiltered feedback from the founders, managers, and teams I have shipped with."
          icon={<FiMessageCircle />}
        />

        <div className="mx-auto max-w-5xl">
          <div className="relative [perspective:1600px]">
            {/* stacked card depth */}
            <div aria-hidden className="pointer-events-none absolute inset-x-6 -top-3 bottom-3 rotate-[-2.2deg] rounded-[28px] border border-[#c9f36c]/15 bg-white/50 dark:bg-[#101612]/60" />
            <div aria-hidden className="pointer-events-none absolute inset-x-3 -top-1.5 bottom-1.5 rotate-[1.4deg] rounded-[28px] border border-[#c9f36c]/15 bg-white/60 dark:bg-[#0d120e]/70" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative [transform-style:preserve-3d]"
              >
                <TiltCard intensity={5} glow="201 243 108" className="rounded-[28px]">
                  <div className="relative overflow-hidden rounded-[28px] border border-[#a8d94a]/15 bg-white/90 shadow-[0_30px_90px_-40px_rgba(132,204,22,0.35)] backdrop-blur-md dark:border-[#c9f36c]/10 dark:bg-[#0b0f0c]/95">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c9f36c] via-[#d9ff8a] to-[#a8d94a]" />
                    <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#c9f36c]/10 blur-3xl" />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-10 left-4 select-none font-serif text-[190px] leading-none text-[#a8d94a]/[0.07] dark:text-[#c9f36c]/[0.06]"
                    >
                      &ldquo;
                    </span>

                    <div className="relative p-6 sm:p-8 md:p-12">
                      <div className="mb-8 flex items-center justify-between">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8d94a]/80 dark:text-[#c9f36c]/80">
                          {String(current + 1).padStart(2, "0")}
                          <span className="mx-1 text-gray-300 dark:text-white/20">/</span>
                          {String(testimonials.length).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                          <FiCheckCircle className="text-xs" />
                          Verified
                        </span>
                      </div>

                      <div className="grid items-start gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
                        <div className="flex flex-row items-center gap-4 md:flex-col md:items-start md:gap-5">
                          <div className="relative shrink-0">
                            <span className="absolute -inset-2 rounded-[26px] bg-gradient-to-br from-[#c9f36c] via-[#d9ff8a] to-[#a8d94a] opacity-60 blur-md" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#a8d94a] via-[#c9f36c] to-[#c9f36c] text-xl font-bold text-[#101412] shadow-lg shadow-[#c9f36c]/25 sm:h-20 sm:w-20 sm:text-2xl">
                              {t.avatar}
                            </div>
                          </div>
                          <div className="md:mt-1">
                            <div className="mb-1 flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < t.rating
                                      ? "fill-[#c9f36c] text-[#c9f36c]"
                                      : "text-gray-300 dark:text-white/15"
                                  }`}
                                />
                              ))}
                            </div>
                            <h3 className="font-heading text-base font-bold text-gray-900 sm:text-lg dark:text-white">
                              {t.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-[#91a096]">
                              {t.role}
                            </p>
                          </div>
                        </div>

                        <blockquote className="relative">
                          <p className="text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl md:leading-relaxed dark:text-white/85">
                            {t.quote}
                          </p>
                          <div className="mt-6 flex items-center gap-3">
                            <span className="h-px w-10 bg-gradient-to-r from-[#c9f36c] to-transparent" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 dark:text-[#91a096]/70">
                              {t.role.split(",")[0]}
                            </span>
                          </div>
                        </blockquote>
                      </div>

                      <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-[#a8d94a]/10">
                        <motion.div
                          key={`bar-${current}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#c9f36c] via-[#d9ff8a] to-[#a8d94a]"
                        />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#a8d94a]/20 bg-white/80 text-[#a8d94a] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-x-0.5 hover:border-[#c9f36c]/50 hover:bg-[#c9f36c] hover:text-[#101412] dark:bg-white/5 dark:text-[#c9f36c] sm:h-12 sm:w-12"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial from ${item.name}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "h-2 w-9 bg-gradient-to-r from-[#c9f36c] to-[#a8d94a]"
                      : "h-2 w-2 bg-[#c9f36c]/40 hover:bg-[#c9f36c]/70 dark:bg-[#c9f36c]/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#a8d94a]/20 bg-white/80 text-[#a8d94a] shadow-sm backdrop-blur transition-all duration-300 hover:translate-x-0.5 hover:border-[#c9f36c]/50 hover:bg-[#c9f36c] hover:text-[#101412] dark:bg-white/5 dark:text-[#c9f36c] sm:h-12 sm:w-12"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="scrollbar-hide mt-8 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
            {testimonials.map((item, i) => {
              const isActive = i === current;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`group flex min-w-[190px] snap-center items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ${
                    isActive
                      ? "border-[#c9f36c]/40 bg-white shadow-lg shadow-[#a8d94a]/10 dark:bg-[#101612]"
                      : "border-transparent bg-white/50 opacity-60 hover:opacity-100 dark:bg-white/[0.03]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${
                      isActive
                        ? "bg-gradient-to-br from-[#a8d94a] to-[#c9f36c] text-white"
                        : "bg-[#a8d94a]/10 text-[#a8d94a] dark:text-[#c9f36c]"
                    }`}
                  >
                    {item.avatar}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-xs font-semibold ${
                        isActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-[#c5cdc8]"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="block truncate text-[10px] text-gray-500 dark:text-[#91a096]">
                      {item.role}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
