"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "CTO, TechVentures",
    avatar: "RS",
    quote:
      "Akash delivered an exceptional e-commerce app for our platform. His expertise in Flutter and Firebase is outstanding. He understood our requirements perfectly and delivered ahead of schedule. Highly recommend!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Product Manager, HealthFirst",
    avatar: "PP",
    quote:
      "Working with Akash was a fantastic experience. He built our healthcare booking app with complex WebRTC integration and it works flawlessly. His attention to detail and problem-solving skills are top-notch.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Founder, QuickBites",
    avatar: "VS",
    quote:
      "Akash has incredible technical depth. He architected our entire food delivery platform and the real-time tracking feature is incredibly smooth. He's the go-to person for cross-platform mobile development.",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    role: "Lead Developer, FinFlow",
    avatar: "AG",
    quote:
      "Akash's work on our fintech app was phenomenal. The charts and data visualization are beautiful and performant. He's a true professional who writes clean, maintainable code.",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "Engineering Manager, FitLife",
    avatar: "SR",
    quote:
      "Akash led the mobile development for our fitness app with great skill. The HealthKit integration and social features are seamless. He communicates well and is a pleasure to work with.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" className="section-padding">
      <div className="max-width">
        <SectionHeading
          title="What People Say"
          subtitle="Feedback from clients and colleagues I've worked with"
          icon={<FiMessageCircle />}
        />

        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="card text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {t.avatar}
                </div>

                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-dark-200 text-base md:text-lg leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div>
                  <h4 className="text-white font-semibold text-lg">{t.name}</h4>
                  <p className="text-dark-400 text-sm">{t.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-dark-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-accent-blue w-6"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-dark-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
