"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiHeart,
  FiArrowUpRight,
  FiSend,
} from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: FiGithub, href: "https://github.com/akashkumarprajapati", label: "GitHub" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/akash-kumarprajapati", label: "LinkedIn" },
  { icon: FiMail, href: "mailto:akashkumarprajapati2003@gmail.com", label: "Email" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--glass-5)]" ref={ref}>
      {/* Top gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent origin-left"
      />

      <div className="max-width px-4 sm:px-8 py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Brand + Description */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-4">
            <a href="#hero" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20 group-hover:shadow-accent-blue/40 group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-base font-heading">A</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                Akash<span className="text-dark-100 dark:text-white">.</span>
              </span>
            </a>

            <p className="text-dark-400 text-sm leading-relaxed mb-4 max-w-xs">
              Software Engineer specializing in Flutter & React Native. Building high-performance cross-platform mobile apps.
            </p>

            {/* Animated stat */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-heading text-accent-blue tabular-nums">
                {isInView ? <CountUp end={4} duration={2} /> : 0}
              </span>
              <span className="text-dark-400 text-xs">+ Years of Experience</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="sm:col-span-1 lg:col-span-2">
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-dark-400 text-sm hover:text-accent-blue transition-all duration-300 flex items-center gap-1 group/link"
                  >
                    <FiArrowUpRight className="text-[10px] opacity-0 group-hover/link:opacity-100 -ml-4 group-hover/link:ml-0 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="sm:col-span-1 lg:col-span-3">
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--glass-5)] border border-[var(--glass-10)] text-dark-300 hover:text-accent-blue hover:border-accent-blue/50 hover:bg-accent-blue/10 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Get In Touch */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-3">
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Get In Touch
            </h4>
            <p className="text-dark-400 text-sm leading-relaxed mb-3">
              Have a project in mind? Let&apos;s build something great together.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-semibold shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 transition-all duration-300 group/btn"
            >
              <FiSend className="group-hover/btn:translate-x-1 transition-transform" />
              Contact Me
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-[var(--glass-5)]"
        >
          <p className="text-dark-400 text-xs sm:text-sm flex items-center gap-1">
            &copy; {year} Made with
            <FiHeart className="text-red-500 animate-pulse" /> by Akash Kumar Prajapati
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
