"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiLinkedin, FiCheck, FiCopy, FiPhone, FiSend, FiMessageCircle, FiUser, FiEdit3, FiSmartphone, FiArrowRight } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import Toast from "@/components/ui/Toast";

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [copied, setCopied] = useState(false);

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
    phone: { label: "Phone Number", icon: FiSmartphone, required: false, type: "tel" as const, placeholder: "98765 43210" },
    message: { label: "Your Message", icon: FiEdit3, required: true, type: "textarea" as const, placeholder: "Tell me about your project..." },
  };

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: digits }));
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    return phone.startsWith("+91") ? phone : `+91 ${phone}`;
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
    if (!form.name.trim() || !form.email.trim() || !form.message.trim() || (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))) return;
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="card relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9f36c]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-dark-100 dark:text-white font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
                <span className="w-8 h-8 rounded-lg bg-[#c9f36c]/20 flex items-center justify-center">
                  <FiMessageCircle className="text-[#c9f36c]" />
                </span>
                Contact Info
              </h3>
              <div className="space-y-5 relative z-10 overflow-hidden">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-center gap-3 sm:gap-4 group/item"
                  >
                    <motion.div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 ring-1 ring-white/5 group-hover/item:ring-white/20 transition-all duration-300`} whileHover={{ scale: 1.1 }}>
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="card bg-gradient-to-br from-[#c9f36c]/[0.04] via-[#a8d94a]/[0.04] to-[#c9f36c]/[0.04] relative overflow-hidden group"
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#c9f36c]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#a8d94a]/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h4 className="text-dark-100 dark:text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Let&apos;s Work Together
                </h4>
                <p className="text-dark-300 text-sm leading-relaxed">
                  I&apos;m currently open to freelance opportunities and full-time roles. Whether you have a project idea or just want to connect, feel free to reach out!
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="card space-y-5 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c9f36c]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#a8d94a]/8 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-dark-100 dark:text-white font-bold text-lg flex items-center gap-2 relative z-10">
                <span className="w-8 h-8 rounded-lg bg-[#c9f36c]/20 flex items-center justify-center">
                  <FiSend className="text-[#c9f36c]" />
                </span>
                Send a Message
              </h3>

              {(["name", "email", "phone", "message"] as const).map((field) => {
                const meta = fieldMeta[field];
                const error = getError(field);
                const hasValue = !!form[field];
                const isFocused = focused === field;
                const Icon = meta.icon;

                return (
                  <div key={field} className="relative z-10">
                    <div className={`relative flex items-start rounded-xl border transition-all duration-300 ${error ? "border-red-500/50 bg-red-500/5" : isFocused ? "border-[#c9f36c] bg-[#c9f36c]/5 shadow-lg shadow-[#c9f36c]/10" : "border-[var(--glass-10)] bg-[var(--glass-5)] hover:border-[var(--glass-20)]"}`}>
                      <div className={`flex items-center justify-center pl-4 pt-3.5 ${isFocused ? "text-[#c9f36c]" : error ? "text-red-500" : "text-dark-500"}`}>
                        <Icon className="text-lg" />
                      </div>
                      <div className="flex-1 relative">
                        {meta.type === "textarea" ? (
                          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} onFocus={() => setFocused("message")} onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add("message")); }} required={meta.required} rows={4} placeholder={meta.placeholder}
                            className="w-full pl-3 pr-4 pt-3.5 pb-3 bg-transparent text-dark-100 dark:text-white placeholder:text-transparent focus:outline-none resize-none text-sm leading-relaxed" />
                        ) : field === "phone" ? (
                          <div className="flex items-center">
                            <span className="pl-3 pt-3.5 text-sm text-[#91a096] font-medium select-none">+91</span>
                            <input type="tel" value={form.phone} onChange={(e) => handlePhoneChange(e.target.value)} onFocus={() => setFocused("phone")} onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add("phone")); }} placeholder={meta.placeholder} maxLength={10}
                              className="w-full pl-2 pr-4 py-3.5 bg-transparent text-dark-100 dark:text-white placeholder:text-transparent focus:outline-none text-sm" />
                          </div>
                        ) : (
                          <input type={meta.type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} onFocus={() => setFocused(field)} onBlur={() => { setFocused(null); setTouched((prev) => new Set(prev).add(field)); }} required={meta.required} placeholder={meta.placeholder}
                            className="w-full pl-3 pr-4 py-3.5 bg-transparent text-dark-100 dark:text-white placeholder:text-transparent focus:outline-none text-sm" />
                        )}
                        <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${isFocused || hasValue ? "text-[10px] -top-2 text-[#c9f36c]" : "text-sm top-3.5 text-dark-500"}`}>
                          {meta.label} {meta.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                      </div>
                      {(isFocused || hasValue) && !error && (
                        <div className="pr-4 pt-3.5"><FiCheck className="text-green-500 text-sm" /></div>
                      )}
                      {error && (
                        <div className="pr-4 pt-3.5"><span className="text-red-500 text-[10px] font-medium">{error}</span></div>
                      )}
                    </div>
                  </div>
                );
              })}

              <motion.button type="submit" disabled={sending}
                className="relative z-10 w-full py-3.5 rounded-xl font-semibold text-[#101412] transition-all duration-300 bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] overflow-hidden group"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-[#c9f36c] via-[#a8d94a] to-[#c9f36c] bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-[var(--glass-30)] border-t-white rounded-full animate-spin" /><span>Sending...</span></>
                  ) : (
                    <><FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" /> Send Message <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" /></>
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
