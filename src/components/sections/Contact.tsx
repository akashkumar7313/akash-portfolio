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
    <section id="contact" className="section-padding relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9f36c]/25 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#c9f36c]"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, boxShadow: "0 0 12px rgba(201,243,108,0.7)" }}
            animate={reduceMotion ? undefined : { y: [0, -16, 0], opacity: [0.15, 0.6, 0.15] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeading
          title="Get In Touch"
          kicker="Contact"
          subtitle="Have a product in mind? Share the idea and I will help you shape it into something shippable."
          icon={<FiMail />}
        />

        <Toast show={toast.show} type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />

        <div className="bento-grid">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4 md:col-span-5"
          >
            <TiltCard intensity={4} glow="201 243 108" className="rounded-[26px]">
              <div className="bento bento-pad relative overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#c9f36c]/10 blur-3xl" />
                <div className="relative flex items-center gap-3">
                  <span className="bento-icon"><FiMessageCircle /></span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">Contact info</h3>
                    <p className="text-[10px] text-[#6b7280] dark:text-[#91a096]">Direct line to me</p>
                  </div>
                </div>

                <div className="relative mt-6 space-y-4">
                  {contactItems.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="group/item flex items-center gap-3"
                    >
                      <motion.span
                        whileHover={{ scale: 1.08, rotate: 4 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16 }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c9f36c]/15 bg-[#c9f36c]/10 text-[#16a34a] dark:text-[#c9f36c]"
                      >
                        <item.icon className="text-base" />
                      </motion.span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#6b7280] dark:text-[#91a096]">{item.label}</p>
                        {"action" in item ? (
                          <button onClick={item.action} className="flex w-full items-center gap-2 text-left text-xs font-medium text-[#101412] transition-colors hover:text-[#16a34a] dark:text-[#f4f7f2] dark:hover:text-[#c9f36c]">
                            <span className="truncate">{item.value}</span>
                            {copied ? <FiCheck className="shrink-0 text-emerald-500" /> : <FiCopy className="shrink-0 text-[10px] text-[#6b7280] opacity-0 transition-opacity group-hover/item:opacity-100 dark:text-[#91a096]" />}
                          </button>
                        ) : "link" in item ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="block truncate text-xs font-medium text-[#101412] transition-colors hover:text-[#16a34a] dark:text-[#f4f7f2] dark:hover:text-[#c9f36c]">
                            {item.value}
                          </a>
                        ) : (
                          <p className="truncate text-xs font-medium text-[#101412] dark:text-[#f4f7f2]">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>

            <TiltCard intensity={5} glow="168 217 74" className="rounded-[26px]">
              <div className="bento relative overflow-hidden p-5">
                <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-[#c9f36c]/10 blur-3xl" />
                <div className="relative flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <p className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">Available for new work</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  Freelance projects, full-time roles, or a quick product conversation — all welcome.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="bento-chip">Replies in 24h</span>
                  <span className="bento-chip">Remote friendly</span>
                  <span className="bento-chip">Long-term mindset</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7"
          >
            <TiltCard intensity={3} animatedBorder className="rounded-[26px]">
              <div className="bento bento-pad relative overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#c9f36c]/8 blur-3xl" />
                <form onSubmit={handleSubmit} className="relative">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="bento-icon"><FiSend /></span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">Tell me about your project</h3>
                      <p className="text-[10px] text-[#6b7280] dark:text-[#91a096]">A few details are enough to get started.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {(["name", "email"] as const).map((field) => {
                      const meta = fieldMeta[field];
                      const error = getError(field);
                      const Icon = meta.icon;
                      const inputId = `contact-${field}`;
                      return (
                        <div key={field}>
                          <label htmlFor={inputId} className={`mb-1.5 ml-1 flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${focused === field ? "text-[#16a34a] dark:text-[#c9f36c]" : error ? "text-red-500" : "text-[#6b7280] dark:text-[#91a096]"}`}>
                            {meta.label} {meta.required && <span className="text-red-500">*</span>}
                          </label>
                          <div className={`flex items-center overflow-hidden rounded-xl border transition-all duration-300 ${error ? "border-red-500/50 bg-red-500/5" : focused === field ? "border-[#c9f36c] bg-[#c9f36c]/5 shadow-lg shadow-[#c9f36c]/10" : "border-[#101412]/8 bg-[#101412]/[0.02] hover:border-[#101412]/15 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]"}`}>
                            <span className={`pl-3.5 ${focused === field ? "text-[#16a34a] dark:text-[#c9f36c]" : "text-[#6b7280] dark:text-[#91a096]"}`}><Icon className="text-sm" /></span>
                            <input
                              id={inputId}
                              type={meta.type}
                              value={form[field]}
                              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                              onFocus={() => setFocused(field)}
                              onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add(field)); }}
                              required={meta.required}
                              placeholder={meta.placeholder}
                              className="w-full bg-transparent py-3 pl-2.5 pr-3 text-xs text-[#101412] placeholder:text-[#9ca3af] focus:outline-none dark:text-[#f4f7f2] dark:placeholder:text-[#4a5a50]"
                            />
                          </div>
                          {error && <p className="mt-1 ml-1 text-[10px] font-medium text-red-500">{error}</p>}
                        </div>
                      );
                    })}

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-phone" className={`mb-1.5 ml-1 flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${focused === "phone" ? "text-[#16a34a] dark:text-[#c9f36c]" : getError("phone") ? "text-red-500" : "text-[#6b7280] dark:text-[#91a096]"}`}>
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className={`flex items-center overflow-hidden rounded-xl border transition-all duration-300 ${getError("phone") ? "border-red-500/50 bg-red-500/5" : focused === "phone" ? "border-[#c9f36c] bg-[#c9f36c]/5 shadow-lg shadow-[#c9f36c]/10" : "border-[#101412]/8 bg-[#101412]/[0.02] hover:border-[#101412]/15 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]"}`}>
                        <span className="pl-3.5 text-[#6b7280] dark:text-[#91a096]"><FiSmartphone className="text-sm" /></span>
                        <span className="pl-2.5 text-xs font-medium text-[#6b7280] dark:text-[#91a096]">+91</span>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          onFocus={() => setFocused("phone")}
                          onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add("phone")); }}
                          placeholder="98765 43210"
                          maxLength={10}
                          required
                          className="w-full bg-transparent py-3 pl-2 pr-3 text-xs text-[#101412] placeholder:text-[#9ca3af] focus:outline-none dark:text-[#f4f7f2] dark:placeholder:text-[#4a5a50]"
                        />
                      </div>
                      {getError("phone") && <p className="mt-1 ml-1 text-[10px] font-medium text-red-500">{getError("phone")}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-message" className={`mb-1.5 ml-1 flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${focused === "message" ? "text-[#16a34a] dark:text-[#c9f36c]" : getError("message") ? "text-red-500" : "text-[#6b7280] dark:text-[#91a096]"}`}>
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <div className={`flex items-start overflow-hidden rounded-xl border transition-all duration-300 ${getError("message") ? "border-red-500/50 bg-red-500/5" : focused === "message" ? "border-[#c9f36c] bg-[#c9f36c]/5 shadow-lg shadow-[#c9f36c]/10" : "border-[#101412]/8 bg-[#101412]/[0.02] hover:border-[#101412]/15 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]"}`}>
                        <span className={`pl-3.5 pt-3.5 ${focused === "message" ? "text-[#16a34a] dark:text-[#c9f36c]" : "text-[#6b7280] dark:text-[#91a096]"}`}><FiEdit3 className="text-sm" /></span>
                        <textarea
                          id="contact-message"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          onFocus={() => setFocused("message")}
                          onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add("message")); }}
                          required
                          rows={4}
                          placeholder="Tell me about your project..."
                          className="w-full resize-none bg-transparent py-3 pl-2.5 pr-3 text-xs leading-relaxed text-[#101412] placeholder:text-[#9ca3af] focus:outline-none dark:text-[#f4f7f2] dark:placeholder:text-[#4a5a50]"
                        />
                      </div>
                      {getError("message") && <p className="mt-1 ml-1 text-[10px] font-medium text-red-500">{getError("message")}</p>}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={sending ? undefined : { scale: 1.01 }}
                    whileTap={sending ? undefined : { scale: 0.99 }}
                    className="group/btn relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] py-3.5 text-xs font-bold text-[#101412] shadow-lg shadow-[#c9f36c]/20 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
                    {sending ? (
                      <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#101412]/20 border-t-[#101412]" /> Sending...</>
                    ) : (
                      <><FiSend className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" /> Send message <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" /></>
                    )}
                  </motion.button>
                  <p className="mt-3 text-center text-[10px] text-[#6b7280] dark:text-[#91a096]">
                    Your details stay private. No spam, ever.
                  </p>
                </form>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
