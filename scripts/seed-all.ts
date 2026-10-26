import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { DEFAULTS } from "../src/lib/defaults";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "portfolio";

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  const siteDataPath = path.join(process.cwd(), "src/data/site-data.json");
  const siteData = JSON.parse(fs.readFileSync(siteDataPath, "utf-8"));

  const sections = [
    "settings", "hero", "about", "skills", "experience", "education",
    "projects", "testimonials", "stats", "contact", "socialLinks",
    "marquee", "explore", "navbar", "footer", "featured", "process",
  ];

  for (const section of sections) {
    let payload: any = null;
    if (siteData[section]) {
      payload = siteData[section];
    } else if (DEFAULTS[section]) {
      payload = DEFAULTS[section];
    }
    if (!payload) {
      console.log(`⏭️  ${section}: no data, skip`);
      continue;
    }

    let doc: any = { slug: "main" };
    if (section === "projects") {
      doc = { slug: "main", projects: payload.projects || payload, filters: payload.filters || [] };
    } else if (section === "stats") {
      doc = { slug: "main", stats: payload.stats || payload };
    } else if (section === "socialLinks") {
      const arr = Array.isArray(payload) ? payload : payload.socialLinks || [];
      await db.collection(section).updateOne({ slug: "main" }, { $set: { slug: "main", socialLinks: arr } }, { upsert: true });
      console.log(`✅ ${section} seeded`);
      continue;
    } else {
      doc = { ...payload, slug: "main" };
    }

    await db.collection(section).updateOne({ slug: "main" }, { $set: doc }, { upsert: true });
    console.log(`✅ ${section} seeded`);
  }

  await client.close();
  console.log("\n🎉 All data seeded to MongoDB!");
}

seed().catch((e) => { console.error(e); process.exit(1); });
