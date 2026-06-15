"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiLinkedin, FiCheck, FiCopy, FiPhone } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import Toast from "@/components/ui/Toast";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "akashkumarprajapati2003@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; title: string; message: string }>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setToast({
          show: true,
          type: "success",
          title: "Message Sent!",
          message: "Thank you! I'll get back to you within 24 hours.",
        });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        const data = await res.json();
        setToast({
          show: true,
          type: "error",
          title: "Failed to Send",
          message: data.error || "Something went wrong. Please try again or email me directly.",
        });
      }
    } catch {
      setToast({
        show: true,
        type: "error",
        title: "Network Error",
        message: "Could not connect to the server. Please check your connection or email me directly.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-width">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project in mind? Let's build something great together."
          icon={<FiMail />}
        />

        <Toast
          show={toast.show}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div className="card">
              <h3 className="text-white font-bold text-lg mb-4">
                Contact Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <FiMail className="text-accent-blue" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-xs mb-1">Email</p>
                    <button
                      onClick={copyEmail}
                      className="text-white text-sm hover:text-accent-blue transition-colors flex items-center gap-2"
                    >
                      {email}
                      {copied ? (
                        <FiCheck className="text-green-500" />
                      ) : (
                        <FiCopy className="text-dark-500 text-xs" />
                      )}
                    </button>
                    {copied && (
                      <span className="text-green-500 text-xs">
                        Copied to clipboard!
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-accent-purple" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-xs mb-1">Phone</p>
                    <p className="text-white text-sm">
                      Available on request
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-xs mb-1">Location</p>
                    <p className="text-white text-sm">
                      Lucknow, Uttar Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <FiLinkedin className="text-accent-blue" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-xs mb-1">LinkedIn</p>
                    <a
                      href="https://www.linkedin.com/in/akash-kumarprajapati"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm hover:text-accent-blue transition-colors"
                    >
                      /in/akash-kumarprajapati
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-accent-blue/5 via-accent-purple/5 to-accent-cyan/5">
              <h4 className="text-white font-semibold mb-2">
                Let's Work Together
              </h4>
              <p className="text-dark-300 text-sm leading-relaxed">
                I am currently open to freelance opportunities and full-time
                roles. Whether you have a project idea or just want to connect,
                feel free to reach out!
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="card space-y-4">
              <div>
                <label className="text-dark-400 text-sm mb-2 block">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all"
                />
              </div>
              <div>
                <label className="text-dark-400 text-sm mb-2 block">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all"
                />
              </div>
              <div>
                <label className="text-dark-400 text-sm mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all"
                />
              </div>
              <div>
                <label className="text-dark-400 text-sm mb-2 block">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg hover:shadow-accent-blue/25 hover:scale-[1.02] active:scale-95 disabled:opacity-70`}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
