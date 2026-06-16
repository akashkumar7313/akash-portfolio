"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9189XXXXXXXX";
  const href = `https://wa.me/${number}?text=Hi%20Akash!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.`;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 90 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-dark-100 dark:text-white text-2xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow duration-300"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp />
          <span className="absolute inset-0 rounded-full animate-ping bg-green-400/30" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
