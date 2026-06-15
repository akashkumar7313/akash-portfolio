"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const socials = [
  {
    icon: FiGithub,
    href: "https://github.com/akashkumarprajapati",
    label: "GitHub",
    color: "hover:text-white",
  },
  {
    icon: FiLinkedin,
    href: "https://www.linkedin.com/in/akash-kumarprajapati",
    label: "LinkedIn",
    color: "hover:text-blue-400",
  },
  {
    icon: FaWhatsapp,
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9189XXXXXXXX"}`,
    label: "WhatsApp",
    color: "hover:text-green-400",
  },
  {
    icon: FiMail,
    href: "mailto:akashkumarprajapati2003@gmail.com",
    label: "Email",
    color: "hover:text-accent-cyan",
  },
];

export default function FloatingSocialSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4"
    >
      <div className="w-px h-16 bg-gradient-to-b from-accent-blue to-transparent" />
      {socials.map(({ icon: Icon, href, label, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-dark-400 ${color} hover:bg-white/10 hover:border-white/20 transition-all duration-300`}
          aria-label={label}
        >
          <Icon className="text-lg" />
        </a>
      ))}
      <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent-purple" />
    </motion.div>
  );
}
