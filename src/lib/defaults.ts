export const HERO_DEFAULTS = {
  name: "Akash Kumar",
  surname: "Prajapati",
  prefix: "Er.",
  photoUrl: "",
  availableText: "Available for work",
  workMode: "Remote / On-site / Hybrid",
  location: "Lucknow, India · IST",
  portfolioTag: "Portfolio / 26",
  kicker: "Software engineer · Mobile + Web",
  roles: [
    "Software Engineer",
    "Flutter Developer",
    "React Native Developer",
    "Mobile & Web Developer",
    "Mobile App Architect",
  ],
  experienceLine: "4+ years · Android · iOS · Web",
  tagline:
    "I turn complex product ideas into fast, polished mobile apps and web storefronts. 4+ years shipping production Android, iOS and web experiences with Flutter, React Native, and modern web tooling.",
  badges: [
    { icon: "🏆", text: "Best Developer of the Year" },
    { icon: "⭐", text: "Employee of the Month" },
  ],
  statusLine: "Open to select projects",
  platforms: "Android · iOS · Web",
  ctaProjects: "View projects",
  ctaResume: "Resume",
  resumeUrl: "",
  flutterFile: "home_screen.dart",
  rnFile: "HomeScreen.tsx",
  flutterCode: `class FlutterApp {
  final String name = "Cross-Platform App";
  final String framework = "Flutter + Firebase";
  final String backend = "Firebase + Cloud Functions";

  void build() {
    var app = MobileApp(
      platform: "Android & iOS",
      stateMgmt: "BLoC + Riverpod",
      payments: "Stripe & Razorpay",
      auth: "Firebase Auth",
    );

    app.configure(debug: false);

    // ship to Play Store & App Store
    app.deploy();
    app.ship();
  }
}`,
  rnCode: `class ReactNativeApp {
  final name = "Cross-Platform App";
  final framework = "React Native + Firebase";
  final backend = "Firebase + Cloud Functions";

  void build() {
    var app = MobileApp(
      platform: "Android & iOS",
      stateMgmt: "Redux + Context",
      payments: "Stripe & Razorpay",
      auth: "Firebase Auth",
    );

    app.configure(debug: false);

    // ship to Play Store & App Store
    app.deploy();
    app.ship();
  }
}`,
  card1Title: "Mobile + web, one partner",
  card1Desc: "Flutter, React Native & web",
  card2Value: "4.9",
  card2Suffix: "/ 5",
  card2Title: "Client rating",
  card2Desc: "Across shipped products",
};

export const MARQUEE_DEFAULTS = {
  tools: [
    "Flutter",
    "React Native",
    "Dart",
    "TypeScript",
    "Firebase",
    "REST APIs",
    "GraphQL",
    "Stripe",
    "Razorpay",
    "PayPal",
    "BLoC",
    "Riverpod",
    "Redux Toolkit",
    "GetX",
    "Fastlane",
    "App Store",
    "Play Store",
    "CI/CD",
  ],
};

export const EXPLORE_DEFAULTS = {
  label: "Keep exploring",
  title: "The full picture, one tap away.",
  linkText: "See projects",
  linkHref: "/projects",
  pages: [
    { title: "About", desc: "The person behind the apps and how I work.", href: "/about", icon: "FiUser", n: "01" },
    { title: "Skills", desc: "Flutter, React Native, Firebase, and the rest of the toolbox.", href: "/skills", icon: "FiCpu", n: "02" },
    { title: "Experience", desc: "Teams and products shipped across four years.", href: "/experience", icon: "FiBriefcase", n: "03" },
    { title: "Education", desc: "Computer science foundations and recognition.", href: "/education", icon: "FiAward", n: "04" },
    { title: "Testimonials", desc: "What founders and managers say about working with me.", href: "/testimonials", icon: "FiMessageCircle", n: "05" },
    { title: "Contact", desc: "Have a product in mind? Let's scope it together.", href: "/contact", icon: "FiMail", n: "06" },
  ],
};

export const NAVBAR_DEFAULTS = {
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Skills", href: "/skills" },
    { label: "Experience", href: "/experience" },
    { label: "Process", href: "/process" },
    { label: "Education", href: "/education" },
    { label: "Projects", href: "/projects" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  ctaLabel: "Let's talk",
  ctaHref: "/contact",
  mobileCtaLabel: "Start a project",
};

export const FOOTER_DEFAULTS = {
  brand: "Akash",
  bio: "Software engineer specializing in Flutter, React Native and web. I design and ship high-performance mobile and web products.",
  location: "Lucknow, India",
  phone: "+91 63933 42727",
  years: 4,
  yearsLabel: "+ years shipping apps",
  ctaKicker: "Next project",
  ctaBefore: "Let's build something",
  ctaAccent: "remarkable",
  ctaAfter: "together.",
  ctaDesc: "Open to freelance projects and full-time roles. Tell me what you are building — I reply within 24 hours.",
  ctaButton: "Start a conversation",
  navigateLabel: "Navigate",
  connectLabel: "Connect",
  availabilityTitle: "Available for work",
  availabilityDesc: "Freelance and full-time opportunities.",
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Skills", href: "/skills" },
    { label: "Experience", href: "/experience" },
    { label: "Process", href: "/process" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
  bottomLeft: "Akash Kumar Prajapati. All rights reserved.",
  bottomRight: "Designed & built with care",
};

export const FEATURED_DEFAULTS = {
  kicker: "Selected work",
  title: "Apps people actually use.",
  linkText: "All projects",
  linkHref: "/projects",
  statTitle: "20+ production apps",
  statDesc: "4 countries · 5 industries",
  statTag: "Live",
};

export const PROCESS_DEFAULTS = {
  titleHome: "From idea to launch, without surprises.",
  titleFull: "The process behind every shipped product.",
  subtitleHome:
    "A clear, milestone-based flow for mobile and web products — from the first requirement to production release.",
  subtitleFull:
    "A transparent, milestone-based delivery system covering requirement, design approval, development, security, testing, and release.",
  flowLabel: "Delivery flow",
  flowMeta: "9 stages · one loop",
  flowLink: "Full playbook",
  flowLinkHref: "/process",
  steps: [
    { n: "01", title: "Requirement", phase: "Discover", deliverable: "Requirement doc", desc: "Goals, users, features and constraints — documented before anything is built.", icon: "FiSearch" },
    { n: "02", title: "Planning", phase: "Discover", deliverable: "Scope & milestones", desc: "Scope, milestones and tech stack mapped to a clear delivery plan.", icon: "FiClipboard" },
    { n: "03", title: "UI/UX Design", phase: "Design", deliverable: "Figma screens", desc: "User flows, wireframes and a pixel-perfect interface for every screen.", icon: "FiPenTool" },
    { n: "04", title: "Design Approval", phase: "Design", deliverable: "Signed-off design", desc: "You review and sign off the design before production code is written.", icon: "FiCheckCircle" },
    { n: "05", title: "Development", phase: "Build", deliverable: "Working build", desc: "Features with login, roles, APIs, payments and third-party integrations.", icon: "FiCode" },
    { n: "06", title: "QA & Bug Fixes", phase: "Build", deliverable: "QA report", desc: "Android, iOS and web testing, edge cases and performance fixes.", icon: "FiAlertTriangle" },
    { n: "07", title: "Security Testing", phase: "Secure", deliverable: "Security checklist", desc: "Auth checks, API hardening, data safety and dependency review.", icon: "FiShield" },
    { n: "08", title: "UAT & Final Fixes", phase: "Secure", deliverable: "UAT sign-off", desc: "Your team tests the build; feedback is fixed and re-verified.", icon: "FiUserCheck" },
    { n: "09", title: "Production Deploy", phase: "Launch", deliverable: "Live release", desc: "Store + web release, deployment and post-launch monitoring.", icon: "FiUploadCloud" },
  ],
  stats: [
    { value: "9", label: "stages" },
    { value: "Scope", label: "based plan" },
    { value: "3", label: "platforms" },
    { value: "Included", label: "post-launch support" },
  ],
  surfacesLabel: "Delivery surfaces",
  surfacesHeadline: "Mobile + Web",
  surfacesSub: "Flutter · React Native · Web",
  surfacesNote: "shared API & Firebase backend",
  surfacesFooter: "One team. Mobile and web.",
  platforms: [
    { label: "Android", icon: "FaAndroid" },
    { label: "iOS", icon: "FaApple" },
    { label: "Web", icon: "FiGlobe" },
  ],
  freelanceKicker: "Open for freelance",
  freelanceTitle: "Have a product in mind?",
  freelanceDesc:
    "I take projects from requirement to launch — fixed scope, clear milestones, clean handoff.",
  freelanceBullets: [
    "Milestone-based delivery",
    "Progress demos at each stage",
    "Post-launch support",
  ],
  freelanceCta: "Start a project",
  freelanceNote: "Usually replies within 24 hours",
  pipeKicker: "Live pipeline",
  pipeTitle: "A build you can watch move.",
  pipeDesc:
    "The same delivery pipeline runs behind every product — requirement, design, development, testing, security and release.",
  pipelineSteps: [
    { label: "Requirement", desc: "Goals, scope & success metrics", icon: "FiSearch" },
    { label: "Design", desc: "Flows, UI and approval", icon: "FiPenTool" },
    { label: "Development", desc: "Features, auth & integrations", icon: "FiCode" },
    { label: "Test & secure", desc: "QA, bug fixes & threat testing", icon: "FiShield" },
    { label: "Ship", desc: "Store & web release, monitoring", icon: "FiUploadCloud" },
  ],
  pipelineFootTitle: "Android · iOS · Web",
  pipelineFootDesc: "Release-ready in every cycle",
  rulesTitle: "No stage moves forward on assumptions.",
  rules: [
    "Scope and design are approved before development.",
    "Every build is tested on Android, iOS and web.",
    "Security and UAT sign-off come before release.",
    "Every release includes monitoring and a rollback plan.",
  ],
  ruleTags: ["3 platforms", "Mobile + web", "Design sign-off", "Security gate"],
  phasesKicker: "Delivery phases",
  phasesTitle: "Every phase ends with something you can see.",
  phasesDesc:
    "Each phase has a clear output and a review gate, so nothing moves forward on assumptions.",
  phases: [
    { n: "01", title: "Discovery & scope", output: "Requirement doc, feature list, success metrics", gate: "Scope sign-off" },
    { n: "02", title: "UI/UX & approval", output: "User flows, Figma screens, approved design", gate: "Design approval" },
    { n: "03", title: "Build & integrations", output: "Working build, auth, APIs, payments", gate: "Build demo" },
    { n: "04", title: "QA, security & UAT", output: "QA report, security checklist, sign-off", gate: "UAT sign-off" },
    { n: "05", title: "Launch & support", output: "Store + web release, monitoring, handoff docs", gate: "Release go/no-go" },
  ],
  delKicker: "Deliverables",
  delTitle: "Everything needed to ship, not just code.",
  delDesc:
    "Every engagement is built to leave you with a maintainable product, release-ready builds and a clean handoff.",
  deliverables: [
    { icon: "FiFileText", title: "Requirement document", desc: "Features, user roles, scope and acceptance criteria." },
    { icon: "FiLayout", title: "Design prototype", desc: "Clickable Figma flow approved before development." },
    { icon: "FiGithub", title: "Source code", desc: "Clean repository with branches and handoff notes." },
    { icon: "FiServer", title: "API integration", desc: "REST or GraphQL, auth, database and Firebase setup." },
    { icon: "FiCreditCard", title: "Payments", desc: "Stripe, Razorpay, PayPal and in-app purchases." },
    { icon: "FiUploadCloud", title: "Release & deploy", desc: "Play Store, App Store and web deployment, versioning and monitoring." },
    { icon: "FiBookOpen", title: "Documentation", desc: "Architecture, setup steps and release checklist." },
    { icon: "FiLifeBuoy", title: "Post-launch support", desc: "Post-launch fixes, monitoring and handover help." },
  ],
  modKicker: "Engagement models",
  modTitle: "Work together the way that fits.",
  modDesc:
    "Whether you are starting from zero, improving a live product, or adding capacity to an existing team, there is a clear way to work together.",
  models: [
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
      accent: false,
    },
    {
      title: "Freelance / contract",
      tag: "Best for extra capacity",
      desc: "Embedded with your team on a sprint or contract basis, with the same delivery and quality gates.",
      points: ["Sprint-based delivery", "Works with your stack", "Clear progress reporting"],
      accent: false,
    },
  ],
  qualityTitle: "Definition of done",
  qualitySub: "Nothing ships until these pass.",
  qualityGates: [
    "Requirement and scope signed off",
    "Design approved before build",
    "Code reviewed and merged",
    "Tested on Android, iOS and web",
    "Auth, API and payment flows verified",
    "Security and dependency checks",
    "Store assets and privacy reviewed",
    "UAT sign-off with rollback plan",
  ],
  startKicker: "How we start",
  startTitle: "A 20-minute discovery call.",
  startDesc:
    "Tell me the idea, the users and the deadline. I will map the scope, flag risks and suggest the smallest sensible first release.",
  startPoints: ["No commitment", "Clear next steps", "NDA on request"],
  startCta: "Book a discovery call",
  startNote: "Usually replies within 24 hours",
  faqKicker: "FAQ",
  faqTitle: "Questions worth asking before you start.",
  faqDesc: "Straight answers about scope, ownership, launch and post-launch support.",
  faqTags: ["You own the code", "NDA on request", "Android · iOS · Web", "Post-launch support"],
  faqStillTitle: "Still have a question?",
  faqStillDesc: "Tell me about the product and I will answer directly.",
  faqStillCta: "Ask me directly",
  faqs: [
    { q: "How do you keep a project on track?", a: "Work is split into milestones with clear outputs and a demo at each phase. Scope, feedback and integrations decide the pace, and the next steps are agreed in writing before moving on." },
    { q: "Can you work with an existing codebase?", a: "Yes. I start with a short audit to understand the architecture, release process and biggest risks, then share a remediation or feature plan before making changes." },
    { q: "Do you handle store release and web deployment?", a: "Yes. That includes build configuration, versioning, store assets, privacy details, Play Store / App Store submission, web deployment, release monitoring and post-launch fixes." },
    { q: "Can you build for Android, iOS and web?", a: "Yes. Flutter or React Native covers Android and iOS from one shared codebase, while web apps and storefronts are built with modern web tooling. APIs, auth and Firebase can stay shared across surfaces." },
    { q: "Who owns the source code?", a: "You do, after the final payment. Repository access, documentation and a clean handoff are part of every fixed-scope project." },
    { q: "How do payments work?", a: "Fixed-scope projects use milestone payments; retainers are billed monthly. The exact split and deliverables are agreed in writing before work starts." },
    { q: "Is post-launch support included?", a: "Every project includes post-launch support for fixes and stability. Ongoing maintenance and feature work can continue on a retainer." },
    { q: "What happens if the scope changes?", a: "Changes are handled as a written change request, with the impact on milestones and cost agreed before the work starts." },
  ],
};

export const DEFAULTS: Record<string, Record<string, unknown>> = {
  hero: HERO_DEFAULTS,
  marquee: MARQUEE_DEFAULTS,
  explore: EXPLORE_DEFAULTS,
  navbar: NAVBAR_DEFAULTS,
  footer: FOOTER_DEFAULTS,
  featured: FEATURED_DEFAULTS,
  process: PROCESS_DEFAULTS,
};
