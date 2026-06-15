"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiLinkedin, FiCheck, FiCopy, FiPhone, FiSend, FiMessageCircle } from "react-icons/fi";
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
  const [focused, setFocused] = useState<string | null>(null);
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

  const contactItems = [
    { icon: FiMail, label: "Email", value: email, color: "text-accent-blue", bg: "bg-accent-blue/10", action: copyEmail },
    { icon: FiPhone, label: "Phone", value: "Available on request", color: "text-accent-purple", bg: "bg-accent-purple/10" },
    { icon: FiMapPin, label: "Location", value: "Lucknow, Uttar Pradesh, India", color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
    { icon: FiLinkedin, label: "LinkedIn", value: "/in/akash-kumarprajapati", link: "https://www.linkedin.com/in/akash-kumarprajapati", color: "text-accent-blue", bg: "bg-accent-blue/10" },
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent pointer-events-none" />
      <div className="max-width relative z-10">

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
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div className="card">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <FiMessageCircle className="text-accent-blue" />
                Contact Info
              </h3>
              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-center gap-4 group"
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className={`${item.color} text-xl`} />
                    </motion.div>
                    <div>
                      <p className="text-dark-400 text-xs mb-0.5">{item.label}</p>
                      {"action" in item ? (
                        <button onClick={item.action} className="text-white text-sm hover:text-accent-blue transition-colors flex items-center gap-2">
                          {item.value}
                          {copied ? <FiCheck className="text-green-500" /> : <FiCopy className="text-dark-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </button>
                      ) : "link" in item ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:text-accent-blue transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white text-sm">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="card bg-gradient-to-br from-accent-blue/5 via-accent-purple/5 to-accent-cyan/5 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-blue/10 rounded-full blur-2xl" />
              <h4 className="text-white font-semibold mb-2 relative z-10">
                Let's Work Together
              </h4>
              <p className="text-dark-300 text-sm leading-relaxed relative z-10">
                I am currently open to freelance opportunities and full-time
                roles. Whether you have a project idea or just want to connect,
                feel free to reach out!
              </p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="card space-y-4 relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent-purple/5 rounded-full blur-3xl" />
              {(["name", "email", "phone", "message"] as const).map((field) => (
                <div key={field} className="relative z-10">
                  <label className="text-dark-400 text-sm mb-2 block">
                    {field === "name" ? "Your Name" : field === "email" ? "Your Email" : field === "phone" ? "Phone Number" : "Your Message"}
                    {field !== "phone" && <span className="text-red-500"> *</span>}
                  </label>
                  {field === "message" ? (
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                      required
                      rows={4}
                      placeholder="Tell me about your project..."
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-dark-500 focus:outline-none transition-all resize-none ${focused === field ? "border-accent-blue ring-1 ring-accent-blue/50 shadow-lg shadow-accent-blue/10" : "border-white/10"
                        }`}
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                      required={field !== "phone"}
                      placeholder={field === "name" ? "John Doe" : field === "email" ? "john@example.com" : "+91 98765 43210"}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-dark-500 focus:outline-none transition-all ${focused === field ? "border-accent-blue ring-1 ring-accent-blue/50 shadow-lg shadow-accent-blue/10" : "border-white/10"
                        }`}
                    />
                  )}
                </div>
              ))}
              <motion.button
                type="submit"
                disabled={sending}
                className="relative z-10 w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-accent-blue to-accent-purple overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
