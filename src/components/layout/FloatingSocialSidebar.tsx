"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiTwitter, FiYoutube, FiLink, FiGlobe, FiInstagram, FiFacebook } from "react-icons/fi";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  FiGithub, FiLinkedin, FiMail, FiTwitter, FiYoutube, FiLink, FiGlobe, FiInstagram, FiFacebook,
  FaWhatsapp, FaXTwitter,
};

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export default function FloatingSocialSidebar() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/socialLinks")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLinks(data);
      })
      .catch(() => {});
  }, []);

  if (links.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4"
    >
      <div className="w-px h-16 bg-gradient-to-b from-accent-blue to-transparent" />
      {links.map(({ platform, url, icon }) => {
        const Icon = iconMap[icon] || FiLink;
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--glass-5)] border border-[var(--glass-10)] text-dark-400 hover:text-dark-100 hover:bg-[var(--glass-10)] hover:border-[var(--glass-20)] transition-all duration-300"
            aria-label={platform}
          >
            <Icon className="text-lg" />
          </a>
        );
      })}
      <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent-purple" />
    </motion.div>
  );
}
