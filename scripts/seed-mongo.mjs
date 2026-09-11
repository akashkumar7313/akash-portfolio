import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "portfolio";

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  // Read site-data.json
  const dataPath = path.join(process.cwd(), "src/data/site-data.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(rawData);

  // Seed settings
  await db.collection("settings").updateOne(
    { slug: "main" },
    { $set: { ...data.settings, slug: "main" } },
    { upsert: true }
  );
  console.log("✅ Settings seeded");

  // Seed hero
  await db.collection("hero").updateOne(
    { slug: "main" },
    { $set: { ...data.hero, slug: "main" } },
    { upsert: true }
  );
  console.log("✅ Hero seeded");

  // Seed about
  await db.collection("about").updateOne(
    { slug: "main" },
    { $set: { ...data.about, slug: "main" } },
    { upsert: true }
  );
  console.log("✅ About seeded");

  // Seed skills
  await db.collection("skills").updateOne(
    { slug: "main" },
    { $set: { ...data.skills, slug: "main" } },
    { upsert: true }
  );
  console.log("✅ Skills seeded");

  // Seed experience
  await db.collection("experience").updateOne(
    { slug: "main" },
    { $set: { ...data.experience, slug: "main" } },
    { upsert: true }
  );
  console.log("✅ Experience seeded");

  // Seed education
  await db.collection("education").updateOne(
    { slug: "main" },
    { $set: { ...data.education, slug: "main" } },
    { upsert: true }
  );
  console.log("✅ Education seeded");

  // Seed projects
  await db.collection("projects").updateOne(
    { slug: "main" },
    { $set: { slug: "main", projects: data.projects.projects || data.projects, filters: data.projects.filters || [] } },
    { upsert: true }
  );
  console.log("✅ Projects seeded");

  // Seed testimonials
  await db.collection("testimonials").updateOne(
    { slug: "main" },
    { $set: { ...data.testimonials, slug: "main" } },
    { upsert: true }
  );
  console.log("✅ Testimonials seeded");

  // Seed stats
  await db.collection("stats").updateOne(
    { slug: "main" },
    { $set: { slug: "main", stats: data.stats.stats || data.stats } },
    { upsert: true }
  );
  console.log("✅ Stats seeded");

  await client.close();
  console.log("\n🎉 All data seeded to MongoDB!");
}

seed().catch(console.error);
