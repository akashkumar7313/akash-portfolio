"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiTrash2, FiEye, FiEyeOff, FiExternalLink, FiMessageSquare, FiPhone, FiUser } from "react-icons/fi";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const WHATSAPP_NUMBER = "916393342727";

export default function MessagesView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = () => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id: string) => {
    await fetch("/api/admin/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#c9f36c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f4f7f2] flex items-center gap-2">
            <FiMessageSquare className="text-[#25d366]" />
            Contact Messages
          </h2>
          <p className="text-sm text-[#91a096]">
            {messages.length} total, {unreadCount} unread
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-[#151b17]/50 border border-[#c9f36c]/5">
          <FiMail className="w-12 h-12 text-[#91a096]/30 mx-auto mb-4" />
          <p className="text-[#91a096]">No messages yet</p>
          <p className="text-[#91a096]/50 text-xs mt-1">Messages from contact form will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => {
              const isExpanded = expandedId === msg._id;
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    msg.read
                      ? "bg-[#151b17]/30 border-[#c9f36c]/5"
                      : "bg-[#151b17] border-[#c9f36c]/20 shadow-lg shadow-[#c9f36c]/5"
                  }`}
                >
                  {/* Header - Always visible */}
                  <div
                    className="p-4 cursor-pointer hover:bg-[#c9f36c]/5 transition-colors"
                    onClick={() => {
                      setExpandedId(isExpanded ? null : msg._id);
                      if (!msg.read) markRead(msg._id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center text-[#101412] font-bold text-sm flex-shrink-0">
                          {msg.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {!msg.read && (
                              <span className="w-2 h-2 rounded-full bg-[#c9f36c] animate-pulse" />
                            )}
                            <span className="font-semibold text-[#f4f7f2] text-sm">{msg.name}</span>
                          </div>
                          <p className="text-[#91a096] text-xs">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Quick action buttons */}
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi ${msg.name},\n\nThanks for reaching out! Your message: "${msg.message}"`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366]/20 transition-all"
                          title="Reply on WhatsApp"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${msg.email}?subject=Re: Your Portfolio Message&body=Hi ${msg.name},\n\nThanks for reaching out!`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg bg-[#c9f36c]/10 text-[#c9f36c] hover:bg-[#c9f36c]/20 transition-all"
                          title="Reply via Email"
                        >
                          <FiMail className="w-4 h-4" />
                        </a>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 border-t border-[#c9f36c]/5">
                          {/* Contact info cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 mb-4">
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#101412] border border-[#c9f36c]/5">
                              <FiUser className="w-4 h-4 text-[#c9f36c]" />
                              <div>
                                <p className="text-[10px] text-[#91a096] uppercase">Name</p>
                                <p className="text-[#f4f7f2] text-sm font-medium">{msg.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#101412] border border-[#c9f36c]/5">
                              <FiMail className="w-4 h-4 text-[#a8d94a]" />
                              <div>
                                <p className="text-[10px] text-[#91a096] uppercase">Email</p>
                                <p className="text-[#f4f7f2] text-sm font-medium">{msg.email}</p>
                              </div>
                            </div>
                            {msg.phone && (
                              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#101412] border border-[#c9f36c]/5">
                                <FiPhone className="w-4 h-4 text-[#25d366]" />
                                <div>
                                  <p className="text-[10px] text-[#91a096] uppercase">Phone</p>
                                  <p className="text-[#f4f7f2] text-sm font-medium">{msg.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Message */}
                          <div className="p-4 rounded-xl bg-[#101412] border border-[#c9f36c]/5">
                            <p className="text-[10px] text-[#91a096] uppercase mb-2">Message</p>
                            <p className="text-[#f4f7f2] text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          </div>

                          {/* Reply buttons */}
                          <div className="flex gap-3 mt-4">
                            <a
                              href={`mailto:${msg.email}?subject=Re: Your Portfolio Message&body=Hi ${msg.name},\n\nThanks for reaching out!`}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] text-[#101412] font-semibold text-sm hover:shadow-lg hover:shadow-[#c9f36c]/20 transition-all"
                            >
                              <FiMail className="w-4 h-4" />
                              Reply via Email
                            </a>
                            <a
                              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi ${msg.name},\n\nThanks for reaching out! Your message: "${msg.message}"`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#25d366]/20 transition-all"
                            >
                              <FiExternalLink className="w-4 h-4" />
                              Reply via WhatsApp
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
