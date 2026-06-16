"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiCpu } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

interface Message {
  role: "user" | "bot";
  text: string;
}

const quickQuestions = [
  "Tell me about yourself",
  "What are your skills?",
  "Show your experience",
  "List your projects",
  "How to contact you?",
];

const greetings = [
  "Hi there! 👋 I'm Akash's AI assistant. Ask me anything about his skills, projects, or experience!",
  "Hello! 👋 Need help? I can tell you all about Akash's work and expertise. What would you like to know?",
  "Hey! 👋 Welcome! I'm here to help you learn more about Akash. Feel free to ask me anything!",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: greetings[Math.floor(Math.random() * greetings.length)] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      const botMsg: Message = { role: "bot", text: data.reply || "Sorry, I didn't understand that." };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple flex items-center justify-center text-white text-2xl shadow-lg shadow-accent-blue/30 hover:shadow-accent-blue/50 transition-shadow duration-300"
        aria-label="Open chatbot"
      >
        <HiSparkles />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[92%] sm:w-96 h-[520px] max-h-[70vh] flex flex-col rounded-2xl border border-[var(--glass-10)] bg-dark-900/95 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-5)] bg-gradient-to-r from-accent-blue/10 to-accent-purple/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                  <FiCpu className="text-dark-100 dark:text-white text-sm" />
                </div>
                <div>
                  <h3 className="text-dark-100 dark:text-white font-semibold text-sm">AI Assistant</h3>
                  <p className="text-dark-400 text-[10px]">Ask me anything!</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--glass-5)] text-dark-400 hover:text-dark-100 dark:text-white hover:bg-[var(--glass-10)] transition-all"
              >
                <FiX />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-br-lg">
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed bg-[var(--glass-5)] border border-[var(--glass-5)] text-dark-200 rounded-bl-lg"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[var(--glass-5)] border border-[var(--glass-5)] rounded-2xl rounded-bl-lg px-4 py-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-dark-500 mb-2 uppercase tracking-wider font-medium">
                  Quick Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 text-[11px] font-medium rounded-full bg-[var(--glass-5)] border border-[var(--glass-10)] text-dark-300 hover:text-dark-100 dark:text-white hover:bg-[var(--glass-10)] hover:border-[var(--glass-20)] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 p-3 border-t border-[var(--glass-5)] bg-dark-950/50"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-[var(--glass-5)] border border-[var(--glass-10)] rounded-xl text-dark-100 dark:text-white text-sm placeholder:text-dark-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/25 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white disabled:opacity-40 transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/25"
              >
                <FiSend className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
