"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

interface ToastProps {
  show: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  show,
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-24 left-1/2 z-[60] w-[90%] max-w-md"
        >
          <div
            className={`flex items-start gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              type === "success"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                type === "success"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {type === "success" ? (
                <FiCheckCircle className="text-xl" />
              ) : (
                <FiXCircle className="text-xl" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{title}</p>
              <p className="text-dark-300 text-xs mt-0.5">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <FiX />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
