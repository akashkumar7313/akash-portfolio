"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import DeliveryPipeline from "./DeliveryPipeline";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiCreditCard,
  FiFileText,
  FiGithub,
  FiLayout,
  FiLifeBuoy,
  FiServer,
  FiShield,
  FiUploadCloud,
} from "react-icons/fi";

const phases = [
  { n: "01", title: "Discovery & scope", output: "Requirement doc, feature list, success metrics", gate: "Scope sign-off" },
  { n: "02", title: "UI/UX & approval", output: "User flows, Figma screens, approved design", gate: "Design approval" },
  { n: "03", title: "Build & integrations", output: "Working build, auth, APIs, payments", gate: "Build demo" },
  { n: "04", title: "QA, security & UAT", output: "QA report, security checklist, sign-off", gate: "UAT sign-off" },
  { n: "05", title: "Launch & support", output: "Store + web release, monitoring, handoff docs", gate: "Release go/no-go" },
];

const deliverables = [
  { icon: FiFileText, title: "Requirement document", desc: "Features, user roles, scope and acceptance criteria." },
  { icon: FiLayout, title: "Design prototype", desc: "Clickable Figma flow approved before development." },
  { icon: FiGithub, title: "Source code", desc: "Clean repository with branches and handoff notes." },
  { icon: FiServer, title: "API integration", desc: "REST or GraphQL, auth, database and Firebase setup." },
  { icon: FiCreditCard, title: "Payments", desc: "Stripe, Razorpay, PayPal and in-app purchases." },
  { icon: FiUploadCloud, title: "Release & deploy", desc: "Play Store, App Store and web deployment, versioning and monitoring." },
  { icon: FiBookOpen, title: "Documentation", desc: "Architecture, setup steps and release checklist." },
  { icon: FiLifeBuoy, title: "Post-launch support", desc: "Post-launch fixes, monitoring and handover help." },
];

const models = [
  {
    title: "Fixed-scope project",
    tag: "Best for new apps",
    desc: "A clear feature list, agreed milestones and clear acceptance criteria. Ideal for MVPs and first releases.",
    points: ["Scope and estimate upfront", "Milestone-based payments", "Defined handoff and support"],
    accent: true,
  },
  {
    title: "Monthly retainer",
    tag: "Best for live products",
    desc: "Ongoing development, improvements and priority support for a product that is already in the market.",
    points: ["Reserved delivery capacity", "Feature roadmap support", "Priority bug fixes"],
  },
  {
    title: "Freelance / contract",
    tag: "Best for extra capacity",
    desc: "Embedded with your team on a sprint or contract basis, with the same delivery and quality gates.",
    points: ["Sprint-based delivery", "Works with your stack", "Clear progress reporting"],
  },
];

const qualityGates = [
  "Requirement and scope signed off",
  "Design approved before build",
  "Code reviewed and merged",
  "Tested on Android, iOS and web",
  "Auth, API and payment flows verified",
  "Security and dependency checks",
  "Store assets and privacy reviewed",
  "UAT sign-off with rollback plan",
];

const faqs = [
  {
    q: "How do you keep a project on track?",
    a: "Work is split into milestones with clear outputs and a demo at each phase. Scope, feedback and integrations decide the pace, and the next steps are agreed in writing before moving on.",
  },
  {
    q: "Can you work with an existing codebase?",
    a: "Yes. I start with a short audit to understand the architecture, release process and biggest risks, then share a remediation or feature plan before making changes.",
  },
  {
    q: "Do you handle store release and web deployment?",
    a: "Yes. That includes build configuration, versioning, store assets, privacy details, Play Store / App Store submission, web deployment, release monitoring and post-launch fixes.",
  },
  {
    q: "Can you build for Android, iOS and web?",
    a: "Yes. Flutter or React Native covers Android and iOS from one shared codebase, while web apps and storefronts are built with modern web tooling. APIs, auth and Firebase can stay shared across surfaces.",
  },
  {
    q: "Who owns the source code?",
    a: "You do, after the final payment. Repository access, documentation and a clean handoff are part of every fixed-scope project.",
  },
  {
    q: "How do payments work?",
    a: "Fixed-scope projects use milestone payments; retainers are billed monthly. The exact split and deliverables are agreed in writing before work starts.",
  },
  {
    q: "Is post-launch support included?",
    a: "Every project includes post-launch support for fixes and stability. Ongoing maintenance and feature work can continue on a retainer.",
  },
  {
    q: "What happens if the scope changes?",
    a: "Changes are handled as a written change request, with the impact on milestones and cost agreed before the work starts.",
  },
];

function SectionIntro({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div className="mb-6 max-w-2xl">
      <span className="bento-label">{kicker}</span>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#101412] sm:text-3xl dark:text-[#f4f7f2]">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096]">{desc}</p>
    </div>
  );
}

export default function ProcessDetails() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section id="pipeline" className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            kicker="Live pipeline"
            title="A build you can watch move."
            desc="The same delivery pipeline runs behind every product — requirement, design, development, testing, security and release."
          />
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <DeliveryPipeline />
            <div className="bento relative h-full overflow-hidden p-5 sm:p-6">
              <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#c9f36c]/[0.12] blur-3xl" />
              <span className="bento-label">Pipeline rules</span>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">No stage moves forward on assumptions.</h3>
              <div className="mt-4 space-y-2.5">
                {[
                  "Scope and design are approved before development.",
                  "Every build is tested on Android, iOS and web.",
                  "Security and UAT sign-off come before release.",
                  "Every release includes monitoring and a rollback plan.",
                ].map((rule) => (
                  <div key={rule} className="flex items-start gap-2.5 rounded-xl border border-[#101412]/6 bg-white/40 px-3 py-2.5 dark:border-[#c9f36c]/8 dark:bg-white/[0.02]">
                    <FiCheck className="mt-0.5 shrink-0 text-[#16a34a] dark:text-[#c9f36c]" />
                    <span className="text-[10px] leading-relaxed text-[#4b5563] dark:text-[#cbd5ce]">{rule}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {["3 platforms", "Mobile + web", "Design sign-off", "Security gate"].map((tag) => (
                  <span key={tag} className="rounded-full border border-[#101412]/8 px-2.5 py-1 text-center text-[9px] text-[#6b7280] dark:border-[#c9f36c]/10 dark:text-[#91a096]">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            kicker="Delivery phases"
            title="Every phase ends with something you can see."
            desc="Each phase has a clear output and a review gate, so nothing moves forward on assumptions."
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bento overflow-hidden"
          >
            <div className="hidden grid-cols-12 gap-3 border-b border-[#101412]/8 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6b7280] dark:border-[#c9f36c]/10 dark:text-[#91a096] md:grid">
              <span className="col-span-3">Phase</span>
              <span className="col-span-5">Output</span>
              <span className="col-span-4">Sign-off</span>
            </div>
            {phases.map((phase) => (
              <div
                key={phase.n}
                className="grid gap-1.5 border-b border-[#101412]/6 px-5 py-4 last:border-0 dark:border-[#c9f36c]/8 md:grid-cols-12 md:items-center md:gap-3"
              >
                <div className="flex items-center gap-2 md:col-span-3">
                  <span className="font-mono text-[10px] text-[#16a34a] dark:text-[#c9f36c]">{phase.n}</span>
                  <span className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{phase.title}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096] md:col-span-5">{phase.output}</p>
                <span className="w-fit rounded-full border border-[#c9f36c]/25 bg-[#c9f36c]/10 px-2 py-0.5 font-mono text-[9px] text-[#16a34a] dark:text-[#c9f36c] md:col-span-4">
                  {phase.gate}
                </span>
              </div>
            ))}
          </motion.div>
          <p className="mt-2 text-[10px] text-[#6b7280] dark:text-[#6b7a70]">Each gate is a decision point — approved, revised or blocked.</p>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            kicker="Deliverables"
            title="Everything needed to ship, not just code."
            desc="Every engagement is built to leave you with a maintainable product, release-ready builds and a clean handoff."
          />
          <div className="bento-grid">
            {deliverables.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="bento bento-hover p-4 md:col-span-6 lg:col-span-3"
              >
                <span className="bento-icon"><item.icon /></span>
                <h3 className="mt-3 text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{item.title}</h3>
                <p className="mt-1 text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionIntro
            kicker="Engagement models"
            title="Work together the way that fits."
            desc="Whether you are starting from zero, improving a live product, or adding capacity to an existing team, there is a clear way to work together."
          />
          <div className="bento-grid">
            {models.map((model, idx) => (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="md:col-span-4"
              >
                <div className={`relative h-full overflow-hidden rounded-[26px] border p-5 sm:p-6 ${model.accent ? "border-[#c9f36c]/45 bg-gradient-to-br from-[#c9f36c]/[0.14] to-transparent" : "border-[#101412]/8 bg-white/45 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]"}`}>
                  {model.accent && (
                    <span className="absolute right-4 top-4 rounded-full bg-[#c9f36c] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#101412]">Most popular</span>
                  )}
                  <span className="bento-chip">{model.tag}</span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">{model.title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">{model.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {model.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-[10px] text-[#4b5563] dark:text-[#cbd5ce]">
                        <FiCheck className="mt-0.5 shrink-0 text-[#16a34a] dark:text-[#c9f36c]" /> {point}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="mt-5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#16a34a] hover:underline dark:text-[#c9f36c]">
                    Discuss this model <FiArrowUpRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <div className="bento-grid">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="md:col-span-7"
            >
              <div className="bento h-full p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="bento-icon"><FiShield /></span>
                  <div>
                    <p className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">Definition of done</p>
                    <p className="text-[10px] text-[#6b7280] dark:text-[#91a096]">Nothing ships until these pass.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {qualityGates.map((gate) => (
                    <div key={gate} className="flex items-center gap-2 rounded-xl border border-[#101412]/6 bg-white/40 px-3 py-2 dark:border-[#c9f36c]/8 dark:bg-white/[0.02]">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c9f36c]/20 text-[8px] text-[#16a34a] dark:text-[#c9f36c]"><FiCheck /></span>
                      <span className="text-[10px] text-[#4b5563] dark:text-[#cbd5ce]">{gate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="md:col-span-5"
            >
              <div className="bento relative h-full overflow-hidden p-5 sm:p-6">
                <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#c9f36c]/[0.12] blur-3xl" />
                <span className="bento-label">How we start</span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">A 20-minute discovery call.</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  Tell me the idea, the users and the deadline. I will map the scope, flag risks and suggest the smallest sensible first release.
                </p>
                <div className="mt-4 space-y-2">
                  {["No commitment", "Clear next steps", "NDA on request"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[10px] text-[#4b5563] dark:text-[#cbd5ce]">
                      <FiCheck className="text-[#16a34a] dark:text-[#c9f36c]" /> {item}
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#c9f36c] px-4 py-2.5 text-xs font-semibold text-[#101412] transition-colors hover:bg-[#d9ff8a]">
                  Book a discovery call <FiArrowUpRight />
                </Link>
                <p className="mt-2 text-center text-[9px] text-[#6b7280] dark:text-[#6b7a70]">Usually replies within 24 hours</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative overflow-hidden px-4 pb-20 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <div className="bento overflow-hidden">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden border-b border-[#101412]/8 p-6 sm:p-8 lg:border-b-0 lg:border-r dark:border-[#c9f36c]/10"
              >
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#c9f36c]/[0.1] blur-[80px]" />
                <span className="bento-kicker">FAQ</span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#101412] sm:text-3xl dark:text-[#f4f7f2]">
                  Questions worth asking before you start.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  Straight answers about scope, ownership, launch and post-launch support.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {["You own the code", "NDA on request", "Android · iOS · Web", "Post-launch support"].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl border border-[#101412]/6 bg-white/40 px-2.5 py-2 dark:border-[#c9f36c]/8 dark:bg-white/[0.02]">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c9f36c]/20 text-[8px] text-[#16a34a] dark:text-[#c9f36c]"><FiCheck /></span>
                      <span className="text-[9px] font-medium text-[#4b5563] dark:text-[#cbd5ce]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-[#c9f36c]/25 bg-[#c9f36c]/[0.08] p-4">
                  <p className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">Still have a question?</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">Tell me about the product and I will answer directly.</p>
                  <Link href="/contact" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#16a34a] hover:underline dark:text-[#c9f36c]">
                    Ask me directly <FiArrowUpRight />
                  </Link>
                </div>
              </motion.div>

              <div className="divide-y divide-[#101412]/6 dark:divide-[#c9f36c]/8">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <motion.div
                      key={faq.q}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.2) }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="group flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[#c9f36c]/[0.04] sm:px-6"
                        aria-expanded={isOpen}
                      >
                        <span className="pt-0.5 font-mono text-[9px] text-[#16a34a] dark:text-[#c9f36c]">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{faq.q}</span>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "border-[#c9f36c] bg-[#c9f36c] text-[#101412]" : "border-[#101412]/10 text-[#16a34a] group-hover:border-[#c9f36c]/40 dark:border-[#c9f36c]/15 dark:text-[#c9f36c]"}`}>
                          <FiChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <p className="px-5 pb-4 pl-[52px] pr-10 text-[11px] leading-relaxed text-[#6b7280] sm:px-6 sm:pl-[58px] dark:text-[#91a096]">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
