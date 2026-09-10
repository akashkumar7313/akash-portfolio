"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
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

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => {});
  }, []);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d < 0 ? 200 : -200, opacity: 0, scale: 0.95 }),
  };

  const next = () => { setDirection(1); setCurrent((prev) => (prev + 1) % testimonials.length); };
  const prev = () => { setDirection(-1); setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length); };

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section id="testimonials" className="section-padding overflow-hidden grid-bg">
      <div className="max-width">
        <SectionHeading title="What People Say" subtitle="Feedback from clients and colleagues I've worked with" icon={<FiMessageCircle />} />

        <div className="max-w-5xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#c9f36c]/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#a8d94a]/5 rounded-full blur-[60px] pointer-events-none" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-[#151b17] dark:to-[#1b221d] border border-gray-200 dark:border-[#c9f36c]/10 shadow-xl shadow-gray-200/50 dark:shadow-black/30">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9f36c] via-[#a8d94a] to-[#c9f36c]" />

                  {/* Quote icon background */}
                  <div className="absolute top-6 right-6 text-[#c9f36c]/10 dark:text-[#c9f36c]/5">
                    <span className="text-[120px] font-serif leading-none">&ldquo;</span>
                  </div>

                  <div className="relative p-8 md:p-12">
                    <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
                      {/* Left - Avatar & Info */}
                      <div className="flex flex-col items-center md:items-start gap-4">
                        {/* Avatar with glow */}
                        <div className="relative group">
                          <div className="absolute -inset-2 bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center text-[#101412] dark:text-[#101412] font-bold text-2xl shadow-lg shadow-[#c9f36c]/20">
                            {t.avatar}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${i < t.rating ? "text-[#c9f36c] fill-[#c9f36c]" : "text-gray-300 dark:text-[#91a096]/30"}`}
                            />
                          ))}
                        </div>

                        {/* Name & Role */}
                        <div className="text-center md:text-left">
                          <h4 className="text-[#101412] dark:text-[#f4f7f2] font-bold text-lg">{t.name}</h4>
                          <p className="text-[#91a096] text-sm">{t.role}</p>
                        </div>
                      </div>

                      {/* Right - Quote */}
                      <div className="relative">
                        <div className="text-6xl text-[#c9f36c]/20 dark:text-[#c9f36c]/10 font-serif absolute -top-4 -left-2">&ldquo;</div>
                        <blockquote className="text-[#374151] dark:text-[#f4f7f2]/90 text-lg md:text-xl leading-relaxed pl-8 italic">
                          {t.quote}
                        </blockquote>
                        <div className="text-6xl text-[#c9f36c]/20 dark:text-[#c9f36c]/10 font-serif absolute -bottom-8 -right-2 rotate-180">&ldquo;</div>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[#c9f36c]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#91a096]">
                        <span className="w-2 h-2 rounded-full bg-[#c9f36c] animate-pulse" />
                        Verified Client
                      </div>
                      <div className="text-sm text-[#91a096]">
                        {current + 1} / {testimonials.length}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-xl bg-white dark:bg-[#1b221d] border border-gray-200 dark:border-[#c9f36c]/10 flex items-center justify-center text-[#91a096] hover:text-[#c9f36c] hover:border-[#c9f36c]/30 hover:shadow-lg hover:shadow-[#c9f36c]/10 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-8 h-2 bg-[#c9f36c]"
                      : "w-2 h-2 bg-gray-300 dark:bg-[#91a096]/30 hover:bg-[#c9f36c]/50"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-xl bg-white dark:bg-[#1b221d] border border-gray-200 dark:border-[#c9f36c]/10 flex items-center justify-center text-[#91a096] hover:text-[#c9f36c] hover:border-[#c9f36c]/30 hover:shadow-lg hover:shadow-[#c9f36c]/10 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Side cards preview */}
          <div className="hidden lg:flex justify-center gap-4 mt-8">
            {testimonials.map((item, i) => {
              const isActive = i === current;
              const isPrev = i === (current - 1 + testimonials.length) % testimonials.length;
              const isNext = i === (current + 1) % testimonials.length;

              if (!isActive && !isPrev && !isNext) return null;

              return (
                <motion.button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`flex-shrink-0 w-64 p-4 rounded-xl border transition-all duration-300 text-left ${
                    isActive
                      ? "bg-[#c9f36c]/10 border-[#c9f36c]/30 shadow-lg shadow-[#c9f36c]/10"
                      : "bg-white dark:bg-[#151b17] border-gray-200 dark:border-[#c9f36c]/5 opacity-60 hover:opacity-100"
                  }`}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-[#c9f36c] text-[#101412]"
                        : "bg-gray-200 dark:bg-[#1b221d] text-[#91a096]"
                    }`}>
                      {item.avatar}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isActive ? "text-[#101412] dark:text-[#f4f7f2]" : "text-gray-600 dark:text-[#91a096]"}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#91a096]">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-[#91a096]/70 line-clamp-2">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
