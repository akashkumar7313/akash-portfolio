"use client";

import { useEffect, useRef, useState } from "react";
import { FiTerminal } from "react-icons/fi";

const COMMANDS: Record<string, string> = {
  help: "Available commands: about, skills, projects, contact, clear, echo <text>",
  about: "Er. Akash Kumar Prajapati — Flutter & React Native developer. 4+ years shipping Android, iOS & web.",
  skills: "Flutter · React Native · React.js · Next.js · Laravel · Node.js · Firebase · MongoDB",
  projects: "Visit /projects to see shipped apps (FastFit, Pearlies, DreamShop, ...).",
  contact: "Email: akashkumarprajapati2003@gmail.com · WhatsApp: +91 63933 42727",
};

export default function Terminal() {
  const [history, setHistory] = useState<{ cmd: string; out: string }[]>([
    { cmd: "welcome", out: "Type 'help' to explore. Try: about, skills, projects, contact." },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    if (cmd.startsWith("echo ")) {
      setHistory((h) => [...h, { cmd, out: cmd.slice(5) }]);
      return;
    }
    const out = COMMANDS[cmd] || `command not found: ${cmd}. Type 'help'.`;
    setHistory((h) => [...h, { cmd, out }]);
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative mx-auto max-w-4xl">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <span className="bento-label">Interactive</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2] sm:text-3xl">
              Try the terminal
            </h2>
          </div>
          <span className="bento-chip">Live demo</span>
        </div>
        <div className="bento overflow-hidden rounded-2xl border border-[#101412]/10 bg-[#0b0f0c] font-mono text-sm text-[#c9f36c] dark:border-[#c9f36c]/20">
          <div className="flex items-center gap-2 border-b border-[#c9f36c]/15 px-4 py-2.5">
            <FiTerminal />
            <span className="text-xs text-[#91a096]">akash@portfolio ~ </span>
          </div>
          <div ref={scrollRef} className="max-h-72 overflow-y-auto px-4 py-3 space-y-2">
            {history.map((h, i) => (
              <div key={i}>
                <div className="text-[#f4f7f2]">
                  <span className="text-[#16a34a]">$</span> {h.cmd}
                </div>
                <div className="whitespace-pre-wrap text-[#91a096]">{h.out}</div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput("");
            }}
            className="flex items-center gap-2 border-t border-[#c9f36c]/15 px-4 py-2.5"
          >
            <span className="text-[#16a34a]">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-[#f4f7f2] outline-none placeholder:text-[#6b7280]"
              placeholder="type a command..."
              autoFocus={false}
            />
          </form>
        </div>
      </div>
    </section>
  );
}