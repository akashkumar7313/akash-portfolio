"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiLinkedin,
  FiCheck,
  FiCopy,
  FiPhone,
  FiSend,
  FiMessageCircle,
  FiUser,
  FiEdit3,
  FiSmartphone,
  FiArrowRight,
} from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import Toast from "@/components/ui/Toast";
import TiltCard from "@/components/ui/TiltCard";

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

const particles = [
  { left: "6%", top: "16%", size: 4, delay: 0, duration: 6 },
  { left: "13%", top: "74%", size: 3, delay: 1.2, duration: 7 },
  { left: "47%", top: "7%", size: 2, delay: 0.6, duration: 5 },
  { left: "88%", top: "26%", size: 4, delay: 1.6, duration: 8 },
  { left: "93%", top: "70%", size: 3, delay: 0.3, duration: 6 },
  { left: "61%", top: "90%", size: 2, delay: 2, duration: 7 },
];

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then(setContactInfo)
      .catch(() => {});
  }, []);

  const email = contactInfo?.email || "akashkumarprajapati2003@gmail.com";

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
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; title: string; message: string }>({
    show: false, type: "success", title: "", message: "",
  });

  const fieldMeta = {
    name: { label: "Your Name", icon: FiUser, required: true, type: "text" as const, placeholder: "John Doe" },
    email: { label: "Your Email", icon: FiMail, required: true, type: "email" as const, placeholder: "john@example.com" },
    phone: { label: "Phone Number", icon: FiSmartphone, required: true, type: "tel" as const, placeholder: "98765 43210" },
    message: { label: "Your Message", icon: FiEdit3, required: true, type: "textarea" as const, placeholder: "Tell me about your project..." },
  };

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: digits }));
  };

  const getError = (field: string) => {
    if (!touched.has(field)) return "";
    const val = form[field as keyof typeof form];
    if (fieldMeta[field as keyof typeof fieldMeta]?.required && !val.trim()) return "Required";
    if (field === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Invalid email";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = new Set(["name", "email", "message", "phone"]);
    setTouched(allTouched);
    if (!form.name.trim() || !form.email.trim() || !form.message.trim() || !form.phone.trim() || (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))) return;
    setSending(true);
    const phoneWithPrefix = form.phone ? `+91${form.phone}` : "";
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: phoneWithPrefix }),
      });
      if (res.ok) {
        setToast({ show: true, type: "success", title: "Message Sent!", message: "Thank you! I'll get back to you within 24 hours." });
        setForm({ name: "", email: "", phone: "", message: "" });
        setTouched(new Set());
      } else {
        const data = await res.json();
        setToast({ show: true, type: "error", title: "Failed to Send", message: data.error || "Something went wrong." });
      }
    } catch {
      setToast({ show: true, type: "error", title: "Network Error", message: "Could not connect to the server." });
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: FiMail, label: "Email", value: email, color: "text-[#c9f36c]", bg: "bg-[#c9f36c]/10", action: copyEmail },
    { icon: FiPhone, label: "Phone", value: contactInfo?.phone || "+91 63933 42727", color: "text-[#a8d94a]", bg: "bg-[#a8d94a]/10" },
    { icon: FiMapPin, label: "Location", value: contactInfo?.location || "Lucknow, Uttar Pradesh, India", color: "text-[#c9f36c]", bg: "bg-[#c9f36c]/10" },
    { icon: FiLinkedin, label: "LinkedIn", value: "/in/akash-kumar-prajapati", link: contactInfo?.linkedin || "https://www.linkedin.com/in/akash-kumar-prajapati/", color: "text-[#a8d94a]", bg: "bg-[#a8d94a]/10" },
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden grid-bg">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9f36c]/30 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#c9f36c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#a8d94a]/5 rounded-full blur-[120px] pointer-events-none" />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#c9f36c]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 12px rgba(201,243,108,0.8)",
            }}
            animate={
              reduceMotion
                ? undefined
                : { y: [0, -18, 0], opacity: [0.15, 0.7, 0.15] }
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-width relative z-10 w-full overflow-hidden">
        <SectionHeading title="Get In Touch" subtitle="Have a project in mind? Let's build something great together." icon={<FiMail />} />

        <Toast show={toast.show} type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <TiltCard className="card overflow-hidden" intensity={5}>
              <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40">
                <div className="absolute inset-0 rounded-full border border-[#c9f36c]/15 motion-safe:animate-spin [animation-duration:22s]" />
                <div className="absolute inset-5 rounded-full border border-dashed border-[#c9f36c]/15 motion-safe:animate-spin [animation-duration:15s] [animation-direction:reverse]" />
                <div className="absolute inset-10 rounded-full bg-[#c9f36c]/10 blur-xl" />
              </div>

              <div className="relative [transform:translateZ(22px)]">
                <h3 className="text-dark-100 dark:text-white font-bold text-lg mb-6 flex items-center gap-2">
                  <motion.span
                    whileHover={{ rotate: 12, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="w-8 h-8 rounded-lg bg-[#c9f36c]/20 flex items-center justify-center shadow-lg shadow-[#c9f36c]/10"
                  >
                    <FiMessageCircle className="text-[#c9f36c]" />
                  </motion.span>
                  Contact Info
                </h3>

                <div className="space-y-5">
                  {contactItems.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 sm:gap-4 group/item"
                    >
                      <motion.div
                        whileHover={{ scale: 1.12, rotate: 6, rotateY: 12 }}
                        transition={{ type: "spring", stiffness: 280, damping: 15 }}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 ring-1 ring-white/5 group-hover/item:ring-[#c9f36c]/30 transition-all duration-300 [transform-style:preserve-3d]`}
                      >
                        <item.icon className={`${item.color} text-base sm:text-lg`} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-dark-500 text-[11px] uppercase tracking-wider mb-0.5">{item.label}</p>
                        {"action" in item ? (
                          <button onClick={item.action} className="text-dark-100 dark:text-white text-sm hover:text-[#c9f36c] transition-colors flex items-center gap-2 w-full text-left">
                            <span className="truncate">{item.value}</span>
                            {copied ? <FiCheck className="text-green-500 shrink-0" /> : <FiCopy className="text-dark-500 text-xs shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" />}
                          </button>
                        ) : "link" in item ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-dark-100 dark:text-white text-sm hover:text-[#c9f36c] transition-colors block truncate">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-dark-100 dark:text-white text-sm truncate">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>

            <TiltCard
              intensity={6}
              className="card bg-gradient-to-br from-[#c9f36c]/[0.05] via-[#a8d94a]/[0.04] to-[#c9f36c]/[0.05] relative overflow-hidden"
            >
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c9f36c]/10 blur-3xl" />
              <div className="relative [transform:translateZ(24px)]">
                <h4 className="text-dark-100 dark:text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  Let&apos;s Work Together
                </h4>
                <p className="text-dark-300 text-sm leading-relaxed">
                  I&apos;m currently open to freelance opportunities and full-time roles. Whether you have a project idea or just want to connect, feel free to reach out!
                </p>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TiltCard
              intensity={3}
              animatedBorder
              className="card rounded-2xl shadow-2xl shadow-[#c9f36c]/5"
            >
              <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#c9f36c]/10 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-[#a8d94a]/10 blur-3xl" />

              <form onSubmit={handleSubmit} className="relative space-y-5 [transform-style:preserve-3d]">
                <div className="relative [transform:translateZ(26px)]">
                  <h3 className="text-dark-100 dark:text-white font-bold text-lg flex items-center gap-2">
                    <motion.span
                      whileHover={{ rotateY: 180, rotateX: 12 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14 }}
                      className="w-8 h-8 rounded-lg bg-[#c9f36c]/20 flex items-center justify-center shadow-lg shadow-[#c9f36c]/10 [transform-style:preserve-3d]"
                    >
                      <FiSend className="text-[#c9f36c]" />
                    </motion.span>
                    Send a Message
                  </h3>
                </div>

                {(["name", "email", "phone", "message"] as const).map((field) => {
                  const meta = fieldMeta[field];
                  const error = getError(field);
                  const hasValue = !!form[field];
                  const isFocused = focused === field;
                  const Icon = meta.icon;
                  const inputId = `contact-${field}`;

                  return (
                    <div key={field} className="relative z-10 [transform:translateZ(14px)]">
                      <label
                        htmlFor={inputId}
                        className={`mb-1.5 ml-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                          isFocused ? "text-[#c9f36c]" : error ? "text-red-500" : "text-dark-500"
                        }`}
                      >
                        {meta.label} {meta.required && <span className="text-red-500">*</span>}
                      </label>

                      <div
                        className={`group/field relative flex items-start overflow-hidden rounded-xl border transition-all duration-300 ${
                          error
                            ? "border-red-500/50 bg-red-500/5"
                            : isFocused
                            ? "-translate-y-0.5 border-[#c9f36c] bg-[#c9f36c]/5 shadow-lg shadow-[#c9f36c]/10"
                            : "border-[var(--glass-10)] bg-[var(--glass-5)] hover:border-[var(--glass-20)] hover:bg-[var(--glass-10)]"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center pl-4 pt-3.5 transition-all duration-300 group-focus-within/field:scale-110 group-focus-within/field:-rotate-6 ${
                            isFocused ? "text-[#c9f36c]" : error ? "text-red-500" : "text-dark-500"
                          }`}
                        >
                          <Icon className="text-lg" />
                        </div>

                        <div className="flex-1">
                          {meta.type === "textarea" ? (
                            <textarea
                              id={inputId}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              onFocus={() => setFocused("message")}
                              onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add("message")); }}
                              required={meta.required}
                              rows={4}
                              placeholder={meta.placeholder}
                              className="w-full resize-none bg-transparent pl-3 pr-4 pt-3.5 pb-3 text-sm leading-relaxed text-dark-100 placeholder:text-dark-500 focus:outline-none dark:text-white"
                            />
                          ) : field === "phone" ? (
                            <div className="flex items-center">
                              <span className="pl-3 text-sm font-medium text-[#91a096] select-none">+91</span>
                              <input
                                id={inputId}
                                type="tel"
                                value={form.phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                onFocus={() => setFocused("phone")}
                                onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add("phone")); }}
                                placeholder={meta.placeholder}
                                maxLength={10}
                                required={meta.required}
                                className="w-full bg-transparent py-3.5 pl-2 pr-4 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none dark:text-white"
                              />
                            </div>
                          ) : (
                            <input
                              id={inputId}
                              type={meta.type}
                              value={form[field]}
                              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                              onFocus={() => setFocused(field)}
                              onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add(field)); }}
                              required={meta.required}
                              placeholder={meta.placeholder}
                              className="w-full bg-transparent py-3.5 pl-3 pr-4 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none dark:text-white"
                            />
                          )}
                        </div>

                        {(isFocused || hasValue) && !error && (
                          <div className="pr-4 pt-3.5">
                            <motion.span
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 320, damping: 16 }}
                              className="block"
                            >
                              <FiCheck className="text-sm text-green-500" />
                            </motion.span>
                          </div>
                        )}

                        {!error && (
                          <span
                            aria-hidden
                            className={`pointer-events-none absolute inset-x-3 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-[#c9f36c] via-[#d9ff8a] to-[#a8d94a] transition-transform duration-500 ${
                              isFocused ? "scale-x-100" : "scale-x-0"
                            }`}
                          />
                        )}
                      </div>

                      {error && (
                        <p className="mt-1 ml-1 text-[11px] font-medium text-red-500">{error}</p>
                      )}
                    </div>
                  );
                })}

                <motion.button
                  type="submit"
                  disabled={sending}
                  className="group/btn relative z-10 w-full overflow-hidden rounded-xl py-3.5 font-semibold text-[#101412] transition-all duration-300 bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] shadow-lg shadow-[#c9f36c]/20 disabled:cursor-not-allowed disabled:opacity-70 [transform-style:preserve-3d]"
                  whileHover={sending ? undefined : { scale: 1.015, rotateX: 6 }}
                  whileTap={sending ? undefined : { scale: 0.985 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#c9f36c] via-[#d9ff8a] to-[#a8d94a] bg-[length:200%_100%]"
                    animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {sending ? (
                      <><span className="w-4 h-4 border-2 border-[var(--glass-30)] border-t-white rounded-full animate-spin" /><span>Sending...</span></>
                    ) : (
                      <><FiSend className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" /> Send Message <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" /></>
                    )}
                  </span>
                </motion.button>
              </form>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
