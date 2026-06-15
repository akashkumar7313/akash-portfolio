export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  androidLink: string;
  iosLink: string;
  githubLink?: string;
  bannerImage: string;
  screenshots: string[];
  features: string[];
  role: string;
  category: "mobile" | "web" | "backend";
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Mobile App",
    description:
      "A full-featured e-commerce platform with real-time inventory management, secure payment processing, and an intuitive shopping experience. Supports multiple vendors, order tracking, and push notifications.",
    techStack: ["Flutter", "Firebase", "Stripe", "REST API"],
    androidLink: "https://play.google.com",
    iosLink: "https://apps.apple.com",
    githubLink: "https://github.com/akashkumarprajapati",
    bannerImage: "/images/project-1.jpg",
    screenshots: [
      "/images/screen-1.jpg",
      "/images/screen-2.jpg",
      "/images/screen-3.jpg",
    ],
    features: [
      "Real-time inventory management",
      "Secure Stripe & Razorpay payments",
      "Push notifications via FCM",
      "Multi-vendor architecture",
      "Order tracking with live updates",
    ],
    role: "Led end-to-end mobile development, designed the architecture, integrated payment gateways, and managed Play Store deployment.",
    category: "mobile",
  },
  {
    id: 2,
    title: "Healthcare Booking App",
    description:
      "A comprehensive healthcare platform connecting patients with doctors. Features appointment scheduling, video consultations, prescription management, and health record storage.",
    techStack: ["React Native", "Firebase", "WebRTC", "GraphQL"],
    androidLink: "https://play.google.com",
    iosLink: "https://apps.apple.com",
    githubLink: "https://github.com/akashkumarprajapati",
    bannerImage: "/images/project-2.jpg",
    screenshots: [
      "/images/screen-4.jpg",
      "/images/screen-5.jpg",
      "/images/screen-6.jpg",
    ],
    features: [
      "Video consultations using WebRTC",
      "AI-powered doctor recommendation",
      "Secure health record vault",
      "Real-time appointment scheduling",
      "Medicine reminder system",
    ],
    role: "Built the cross-platform app from scratch, implemented video calling, integrated GraphQL APIs, and optimized performance.",
    category: "mobile",
  },
  {
    id: 3,
    title: "Food Delivery Platform",
    description:
      "A scalable food delivery application with real-time order tracking, smart routing, and an analytics dashboard for restaurant partners.",
    techStack: ["Flutter", "Firebase", "Google Maps API", "Node.js"],
    androidLink: "https://play.google.com",
    githubLink: "https://github.com/akashkumarprajapati",
    bannerImage: "/images/project-3.jpg",
    screenshots: [
      "/images/screen-7.jpg",
      "/images/screen-8.jpg",
      "/images/screen-9.jpg",
    ],
    features: [
      "Real-time GPS order tracking",
      "Smart delivery routing algorithm",
      "Partner analytics dashboard",
      "Multi-language support",
      "Rating & review system",
    ],
    role: "Architected the entire mobile app, implemented real-time tracking with WebSockets, and integrated Google Maps for routing.",
    iosLink: "",
    category: "mobile",
  },
  {
    id: 4,
    title: "Task Management SaaS",
    description:
      "A productivity SaaS platform with Kanban boards, team collaboration, time tracking, and automated workflow management.",
    techStack: ["React Native", "Firebase", "Redux", "FCM"],
    androidLink: "https://play.google.com",
    iosLink: "https://apps.apple.com",
    githubLink: "https://github.com/akashkumarprajapati",
    bannerImage: "/images/project-4.jpg",
    screenshots: [
      "/images/screen-10.jpg",
      "/images/screen-11.jpg",
      "/images/screen-12.jpg",
    ],
    features: [
      "Drag-and-drop Kanban boards",
      "Real-time team collaboration",
      "Integrated time tracking",
      "Automated workflow triggers",
      "Cross-platform sync",
    ],
    role: "Developed the mobile client, implemented real-time sync with Firestore, and built the Kanban board interaction system.",
    category: "mobile",
  },
  {
    id: 5,
    title: "Fintech Budget App",
    description:
      "A personal finance management app with AI-powered budgeting, expense tracking, investment portfolio monitoring, and financial insights.",
    techStack: ["Flutter", "Firebase", "REST API", "Charts"],
    androidLink: "https://play.google.com",
    iosLink: "https://apps.apple.com",
    githubLink: "https://github.com/akashkumarprajapati",
    bannerImage: "/images/project-5.jpg",
    screenshots: [
      "/images/screen-13.jpg",
      "/images/screen-14.jpg",
      "/images/screen-15.jpg",
    ],
    features: [
      "AI-powered spending insights",
      "Investment portfolio tracker",
      "Custom budget categories",
      "Bank-grade security",
      "Export to CSV/PDF",
    ],
    role: "Designed the app architecture, implemented charts for financial data visualization, and integrated Plaid for bank connectivity.",
    category: "mobile",
  },
  {
    id: 6,
    title: "Social Fitness App",
    description:
      "A community-driven fitness app with workout tracking, social challenges, trainer booking, and personalized AI workout plans.",
    techStack: ["React Native", "Firebase", "WebRTC", "HealthKit"],
    androidLink: "https://play.google.com",
    iosLink: "https://apps.apple.com",
    bannerImage: "/images/project-6.jpg",
    screenshots: [
      "/images/screen-16.jpg",
      "/images/screen-17.jpg",
      "/images/screen-18.jpg",
    ],
    features: [
      "AI-generated workout plans",
      "Live workout challenges",
      "Integrated HealthKit/Google Fit",
      "One-on-one trainer booking",
      "Social feed with achievements",
    ],
    role: "Led the mobile development team, integrated HealthKit and Google Fit APIs, and built the social features infrastructure.",
    category: "mobile",
  },
];
