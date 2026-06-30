import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "src", "data", "site-data.json");

const projects = [
  {
    id: 1,
    title: "Pearlies",
    description:
      "Healthcare research app developed for NUS Dentistry faculty, focused on early childhood dental care intervention for parents. Features educational content, appointment reminders, and dental health tracking for children.",
    techStack: ["Flutter", "Firebase", "REST API"],
    androidLink:
      "https://play.google.com/store/apps/details?id=com.singsys.dentistry.nus&hl=en_IN",
    iosLink: "https://apps.apple.com/in/app/pearlies/id6739769682",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Child dental health tracking",
      "Educational content & videos",
      "Appointment & reminder system",
      "Parent-child interactive activities",
      "Secure health records management",
    ],
    role: "Built the complete healthcare research app for NUS Dentistry, implementing educational content delivery and parent engagement features.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/BYbvK_T_jYWOHprH5nL_rlHivzD6Ns_9AiB3srCaaCZLQXnaybJPrzbzYNPqgeTR8O-QMjvs5JprhBM2QhneSZw=s512",
  },
  {
    id: 2,
    title: "Boskalis BOSS",
    description:
      "Enterprise mobile solution built for Boskalis, a Netherlands-based dredging and logistics company. Streamlines operations with real-time project tracking, fleet management, and crew coordination tools.",
    techStack: ["Flutter", "REST API", "Firebase"],
    androidLink:
      "https://play.google.com/store/apps/details?id=com.boskalis.boss&hl=en_IN",
    iosLink: "https://apps.apple.com/us/app/boskalis-boss/id6737225022",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Real-time project tracking",
      "Fleet management dashboard",
      "Crew coordination tools",
      "Offline data sync capability",
      "Enterprise-grade security",
    ],
    role: "Developed the enterprise mobile solution for Boskalis, focusing on operational efficiency and real-time data synchronization.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/PAy3oP1xNOFvvPM-qojIxHbkdAdg6vZD6cto92pB8GClXf_mtcA4rcJkiRJJVCBb8UUCV5G-CJ4xm548hqS0=s512",
  },
  {
    id: 3,
    title: "Kimi UAE",
    description:
      "Food ordering app built for the UAE market, designed for a cafe and restaurant ordering experience. Features menu browsing, cart management, order tracking, table reservations, and loyalty rewards.",
    techStack: ["Flutter", "Firebase", "REST API"],
    androidLink:
      "https://play.google.com/store/apps/details?id=com.kimi.cafe&hl=en_IN",
    iosLink: "https://apps.apple.com/us/app/kimi-uae/id6747967998",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Menu browsing & search",
      "Cart management & checkout",
      "Real-time order tracking",
      "Table reservation system",
      "Loyalty rewards program",
    ],
    role: "Built the complete food ordering app for the UAE market with menu management, cart functionality, and order tracking.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/_djjZgDdrLgwF7kjeaEIBBRFAyqVZ_UYxzbn797IDYlGDZk_cAGxfbNz12SsIJN_CCJbnmEHd_vsUv5L7Oo5=s512",
  },
  {
    id: 4,
    title: "Atesplore",
    description:
      "Customer-facing marketplace app for the Atesplore ecosystem. Offers seamless product discovery, real-time order tracking, secure payments, and personalized recommendations for shoppers.",
    techStack: ["Flutter", "Firebase", "REST API", "Stripe"],
    androidLink:
      "https://play.google.com/store/apps/details?id=com.user.atesplore&hl=en_IN",
    iosLink: "https://apps.apple.com/us/app/atesplore/id6740129647",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Product discovery & search",
      "Secure checkout with Stripe",
      "Real-time order tracking",
      "Wishlist management",
      "Personalized recommendations",
    ],
    role: "Developed the customer-facing marketplace app with product browsing, cart, checkout, and order management.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/PxizNSv6zCHrdp72ER3ZX-zoFeYQMWjrr2Qf367JT1oc46xWvo_9edp_5hihjY7yWFFSsUY8Bbh7Z2hKv3AIbA=s512",
  },
  {
    id: 5,
    title: "Atesplore Merchant",
    description:
      "Merchant-facing companion app for the Atesplore marketplace ecosystem. Enables merchants to manage inventory, process orders, track sales analytics, and communicate with customers.",
    techStack: ["Flutter", "Firebase", "REST API"],
    androidLink:
      "https://play.google.com/store/apps/details?id=com.merchant.atesplore&hl=en_IN",
    iosLink: "https://apps.apple.com/us/app/atesplore-merchant/id6740053552",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Inventory management",
      "Order processing dashboard",
      "Sales analytics & reports",
      "Customer communication",
      "Product listing management",
    ],
    role: "Built the merchant companion app for inventory management, order processing, and sales analytics.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/zL24cC9SzYLt3eAyPO9_Hz1LmKL4JfA9tV1gSObHid6X_gf5p3oIgajWpQCFlfRDCDLQdDbu8nwt6FTUS_TUn2U=s512",
  },
  {
    id: 6,
    title: "DreamShop India",
    description:
      "Feature-packed e-marketplace offering rewards, surprise discount coupons, and an engaging shopping experience for Indian consumers with seamless payments and order tracking.",
    techStack: ["Flutter", "Firebase", "REST API", "Razorpay"],
    androidLink:
      "https://play.google.com/store/apps/details?id=com.singsys.dreamshop&hl=en",
    iosLink: "",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Reward points system",
      "Surprise discount coupons",
      "Category-based browsing",
      "Secure payments via Razorpay",
      "Real-time order tracking",
    ],
    role: "Developed the e-marketplace app with reward system, discount coupons, and engaging shopping experience for Indian consumers.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/r_iTRJinVPo6gUKh1ZF-j2HI2pPGCDiwDT-geTlxDt5V-hmN39zCOYCXvWoYt0vgVBG-XZ4gBcRVBeGPgKFH=s512",
  },
  {
    id: 7,
    title: "SalesPulse",
    description:
      "Sales operations app to streamline placing new orders, tracking order status, and managing payments in real time. Empowers sales teams with instant data access and customer management.",
    techStack: ["React Native", "Firebase", "REST API"],
    androidLink:
      "https://play.google.com/store/apps/details?id=com.vibrant.cachetindia&hl=en",
    iosLink: "",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "New order placement",
      "Real-time order status tracking",
      "Payment management dashboard",
      "Customer history & insights",
      "Push notifications & alerts",
    ],
    role: "Built the sales operations app for order placement, real-time tracking, and payment management.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/oY3bTt6fJSpHANJ67L54k7JdUohUKF9QeSAgKOyrpckKnBT8GheHorRUmKsPij2UB1FSSvEOdDAsv1AqKFWV3w=s512",
  },
  {
    id: 8,
    title: "Bajaj MIS",
    description:
      "Reporting app for cane crushing data at Bajaj Hindustan Ltd sugar mills. Provides real-time insights into production metrics, inventory levels, and operational efficiency across mills.",
    techStack: ["React Native", "Firebase", "REST API"],
    androidLink:
      "https://play.google.com/store/apps/details?id=in.co.vibrant.bajajmis&hl=en",
    iosLink: "https://apps.apple.com/in/app/bajaj-mis/id1615612853",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Cane crushing production reports",
      "Real-time metrics dashboard",
      "Inventory level tracking",
      "Historical data analysis",
      "Multi-mill data aggregation",
    ],
    role: "Developed the reporting app for Bajaj Hindustan Ltd sugar mills for cane crushing data monitoring and analysis.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/sAyAtHhNAB96jPOcO_6ExVnVzfTiTc_RotSCWO2ID3M463YXj3UXkEEDNjpnysh1lWEr8jBOF6OzhMJ7DbkO=s512",
  },
  {
    id: 9,
    title: "Dalmia MIS",
    description:
      "App used by farmers and salesmen to track cane position in factory, powered by Dalmia Sugar. Offers crop management insights, queue status, and real-time updates on cane processing.",
    techStack: ["React Native", "Firebase"],
    androidLink: "",
    iosLink: "https://apps.apple.com/in/app/dalmia-mis/id6474722177",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Cane position tracking",
      "Factory queue management",
      "Crop management insights",
      "Real-time status updates",
      "Farmer notification system",
    ],
    role: "Built the app for farmers and salesmen to track cane position in factory for Dalmia Sugar.",
    category: "mobile",
    appIcon: "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/01/5f/b4/015fb4ed-0676-804f-4b52-d6c51433d0d6/AppIcon-0-0-1x_U007emarketing-0-5-0-85-220.png/512x512bb.jpg",
  },
  {
    id: 10,
    title: "Wave MIS",
    description:
      "App used by farmers and salesmen to track cane position in factory, powered by Wave Industries Mills Ltd. Delivers actionable data on cane supply, queue position, and processing status.",
    techStack: ["React Native", "Firebase"],
    androidLink: "",
    iosLink: "https://apps.apple.com/in/app/wave-mis/id6473242854",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Cane position & queue tracking",
      "Factory processing status",
      "Real-time notifications",
      "Supply data reporting",
      "Farmer communication portal",
    ],
    role: "Developed the app for farmers and salesmen to track cane position in factory for Wave Industries.",
    category: "mobile",
    appIcon: "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/46/12/61/46126124-6268-fc5a-7265-420d0b3433a0/AppIcon-0-0-1x_U007emarketing-0-5-0-85-220.png/512x512bb.jpg",
  },
  {
    id: 11,
    title: "UK Cane MIS",
    description:
      "Reporting app for cane crushing data at UK Cane Society. Enables efficient tracking of cane procurement, crushing statistics, payment management, and operational reporting.",
    techStack: ["React Native", "Firebase"],
    androidLink:
      "https://play.google.com/store/apps/details?id=in.co.vibrant.ukmis&hl=en",
    iosLink: "",
    githubLink: "",
    bannerImage: "",
    screenshots: [],
    features: [
      "Cane crushing data reports",
      "Procurement tracking system",
      "Payment management",
      "Statistical data analysis",
      "Offline data synchronization",
    ],
    role: "Built the reporting app for cane crushing data management for UK Cane Society.",
    category: "mobile",
    appIcon: "https://play-lh.googleusercontent.com/EclmHdu9rAJHx1fFOFCbsVvS0f259OQf3yjjKluZOZPOb8l7A3N3iMzhRK2RqVvhlByybqepEx1n_gE7DR9cGw=s512",
  },
];

const filters = [
  { label: "All", value: "all", icon: "🔍" },
  { label: "Mobile", value: "mobile", icon: "📱" },
  { label: "Web", value: "web", icon: "🌐" },
  { label: "Backend", value: "backend", icon: "⚙️" },
];

try {
  const raw = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);
  data.projects = { projects, filters };
  writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✓ Seeded ${projects.length} projects to site-data.json`);
} catch (err) {
  console.error("Failed to seed data:", err);
  process.exit(1);
}
