"use client";

import { useRef, useEffect } from "react";
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
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-[var(--glass-5)]" ref={ref}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent origin-left"
      />

      <div className="max-width  sm:px-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12"
        >
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20 group-hover:shadow-accent-blue/40 group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-base font-heading">A</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                Akash<span className="text-dark-100 dark:text-white">.</span>
              </span>
            </Link>

            <p className="text-dark-400 text-sm leading-relaxed mb-4 max-w-xs">
              Software Engineer specializing in Flutter & React Native. Building high-performance cross-platform mobile apps.
            </p>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-heading text-accent-blue tabular-nums">
                {isInView ? <CountUp end={4} duration={2} /> : 0}
              </span>
              <span className="text-dark-400 text-xs">+ Years of Experience</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-1 lg:col-span-2">
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-dark-400 text-sm hover:text-accent-blue transition-all duration-300 flex items-center gap-1 group/link"
                  >
                    <FiArrowUpRight className="text-[10px] opacity-0 group-hover/link:opacity-100 -ml-4 group-hover/link:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-1 lg:col-span-3">
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Connect
            </h4>

            {/* Fixed wrapper */}
            <div className="w-[350px] mx-auto min-h-[300px]">

              {/* Light + Dark handled by LinkedIn itself */}
              <div
                className="badge-base LI-profile-badge overflow-hidden rounded-xl"
                data-locale="en_US"
                data-size="medium"
                data-theme="light"
                data-type="VERTICAL"
                data-vanity="akash-kumar-prajapati"
                data-version="v1"
              >
                <a
                  className="badge-base__link LI-simple-link"
                  href="https://in.linkedin.com/in/akash-kumar-prajapati"
                ></a>
              </div>

            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-3">
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Get In Touch
            </h4>
            <p className="text-dark-400 text-sm leading-relaxed mb-3">
              Have a project in mind? Let&apos;s build something great together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-semibold shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 hover:scale-105 transition-all duration-300 group/btn"
            >
              <FiSend className="group-hover/btn:translate-x-1 transition-transform" />
              Contact Me
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-[var(--glass-5)]"
        >
          <p className="text-dark-400 text-xs sm:text-sm flex items-center">
            &copy; {year} Made with
            <FiHeart className="text-red-500 animate-pulse" /> by Akash Kumar Prajapati
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
