"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiTrash2, FiEye, FiEyeOff, FiExternalLink } from "react-icons/fi";

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
          <h2 className="text-xl font-bold text-[#f4f7f2]">Messages</h2>
          <p className="text-sm text-[#91a096]">
            {messages.length} total, {unreadCount} unread
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20">
          <FiMail className="w-12 h-12 text-[#91a096]/30 mx-auto mb-4" />
          <p className="text-[#91a096]">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`rounded-xl border p-4 transition-all duration-300 ${
                  msg.read
                    ? "bg-[#151b17]/50 border-[#c9f36c]/5"
                    : "bg-[#151b17] border-[#c9f36c]/20 shadow-lg shadow-[#c9f36c]/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-[#c9f36c] animate-pulse" />
                      )}
                      <span className="font-semibold text-[#f4f7f2] text-sm">{msg.name}</span>
                      <span className="text-[#91a096] text-xs">•</span>
                      <span className="text-[#c9f36c] text-xs">{msg.email}</span>
                      {msg.phone && (
                        <>
                          <span className="text-[#91a096] text-xs">•</span>
                          <span className="text-[#a8d94a] text-xs">{msg.phone}</span>
                        </>
                      )}
                    </div>
                    <p className="text-[#91a096] text-xs mb-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[#f4f7f2] text-sm leading-relaxed">{msg.message}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi ${msg.name},\n\nThanks for reaching out! Your message: "${msg.message}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366]/20 transition-all"
                      title="Reply on WhatsApp"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${msg.email}?subject=Re: Your Portfolio Message&body=Hi ${msg.name},\n\nThanks for reaching out!`}
                      className="p-2 rounded-lg bg-[#c9f36c]/10 text-[#c9f36c] hover:bg-[#c9f36c]/20 transition-all"
                      title="Reply via Email"
                    >
                      <FiMail className="w-4 h-4" />
                    </a>

                    {/* Mark read/unread */}
                    <button
                      onClick={() => msg.read ? {} : markRead(msg._id)}
                      className="p-2 rounded-lg bg-[#91a096]/10 text-[#91a096] hover:bg-[#91a096]/20 transition-all"
                      title={msg.read ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.read ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
