import fs from "fs";
import path from "path";
import defaultData from "@/data/site-data.json";

const DATA_FILE = process.env.VERCEL
  ? "/tmp/site-data.json"
  : path.join(process.cwd(), "src/data/site-data.json");

let dataCache: SiteData | null = null;

export interface HeroData {
  name: string;
  surname: string;
  roles: string[];
  tagline: string;
  availableText: string;
  playStoreUrl: string;
  appStoreUrl: string;
  resumeUrl: string;
  techStack: { text: string; top: number; side: string; offset: number; icon: string; bg: string; border: string; textColor: string }[];
  badges: { icon: string; text: string; color: string }[];
  reviews: { name: string; date: string; text: string; rating: number; likes: number }[];
  flutterCode: string;
  rnCode: string;
  phoneAppName: string;
  phoneDeveloper: string;
  phoneRating: number;
  phoneReviewCount: number;
  phoneSize: string;
}

export interface AboutData {
  paragraphs: string[];
  highlights: { icon: string; title: string; desc: string; iconColor: string }[];
  achievements: { icon: string; text: string }[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  color: string;
  skills: string[];
  description: string[];
}

export interface ExperienceData {
  experiences: ExperienceItem[];
}

export interface EducationItem {
  degree: string;
  school: string;
  period: string;
  icon: string;
}

export interface AchievementItem {
  icon: string;
  text: string;
  gradient: string;
  accent: string;
}

export interface EducationData {
  education: EducationItem[];
  achievements: AchievementItem[];
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  androidLink: string;
  iosLink: string;
  githubLink?: string;
  bannerImage?: string;
  screenshots?: string[];
  features: string[];
  role: string;
  category: string;
  appIcon?: string;
}

export interface ProjectsData {
  projects: ProjectItem[];
  filters: { label: string; value: string; icon: string }[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface TestimonialsData {
  testimonials: TestimonialItem[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  desc: string;
}

export interface StatsData {
  stats: StatItem[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  keywords: string[];
  particles: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SiteData {
  settings: SiteSettings;
  hero: HeroData;
  about: AboutData;
  skills: SkillsData;
  experience: ExperienceData;
  education: EducationData;
  projects: ProjectsData;
  testimonials: TestimonialsData;
  stats: StatsData;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  adminPassword: string;
}

function readData(): SiteData {
  if (dataCache) return dataCache;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      dataCache = JSON.parse(raw);
      return dataCache!;
    }
    if (process.env.VERCEL) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData), "utf-8");
      dataCache = JSON.parse(JSON.stringify(defaultData));
      return dataCache!;
    }
  } catch {
    console.warn("Failed to read data file, using defaults");
  }
  return JSON.parse(JSON.stringify(defaultData));
}

function writeData(data: SiteData): void {
  dataCache = data;
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write data file:", err);
  }
}

export function initData(): void {
  if (!fs.existsSync(DATA_FILE)) {
    writeData(defaultData);
  }
}

export function getData(): SiteData {
  return JSON.parse(JSON.stringify(readData()));
}

export function updateData(section: string, data: unknown): SiteData {
  const current = readData();
  (current as unknown as Record<string, unknown>)[section] = data;
  writeData(current);
  return JSON.parse(JSON.stringify(current));
}

export function addItemToArray<K extends keyof SiteData>(
  section: K,
  arrayName: string,
  item: any
): SiteData {
  const current = readData();
  const sectionData = current[section] as Record<string, any>;
  if (sectionData && Array.isArray(sectionData[arrayName])) {
    const newItem = { id: Date.now(), ...item };
    (sectionData[arrayName] as any[]).push(newItem);
    writeData(current);
  }
  return JSON.parse(JSON.stringify(current));
}

export function updateItemInArray<K extends keyof SiteData>(
  section: K,
  arrayName: string,
  itemId: number,
  updatedItem: any
): SiteData {
  const current = readData();
  const sectionData = current[section] as Record<string, any>;
  if (sectionData && Array.isArray(sectionData[arrayName])) {
    const array = sectionData[arrayName] as any[];
    let index = array.findIndex((item: any) => item.id === itemId);
    if (index === -1 && typeof itemId === "number") {
      index = itemId < array.length ? itemId : -1;
    }
    if (index !== -1) {
      array[index] = { ...array[index], ...updatedItem };
      writeData(current);
    }
  }
  return JSON.parse(JSON.stringify(current));
}

export function deleteItemFromArray<K extends keyof SiteData>(
  section: K,
  arrayName: string,
  itemId: number
): SiteData {
  const current = readData();
  const sectionData = current[section] as Record<string, any>;
  if (sectionData && Array.isArray(sectionData[arrayName])) {
    const arr = sectionData[arrayName] as any[];
    let index = arr.findIndex((item: any) => item.id === itemId);
    if (index === -1 && typeof itemId === "number") {
      index = itemId < arr.length ? itemId : -1;
    }
    if (index !== -1) {
      sectionData[arrayName] = arr.filter((_: any, i: number) => i !== index);
      writeData(current);
    }
  }
  return JSON.parse(JSON.stringify(current));
}

export function updateSection<K extends keyof SiteData>(section: K, data: SiteData[K]): SiteData {
  return updateData(section, data);
}

export function verifyPassword(password: string): boolean {
  const data = readData();
  return data.adminPassword === password;
}

export function updatePassword(oldPassword: string, newPassword: string): boolean {
  const data = readData();
  if (data.adminPassword !== oldPassword) return false;
  data.adminPassword = newPassword;
  writeData(data);
  return true;
}
