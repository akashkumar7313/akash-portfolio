import { connectToDatabase } from "@/lib/mongodb";

export const DEFAULT_ADMIN_EMAIL = "akashkumarprajapati2003@gmail.com";
export const DEFAULT_ADMIN_PASSWORD = "Akumar@1234";

export async function getCredentials(): Promise<{ email: string; password: string }> {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection("credentials").findOne({ slug: "main" });
    if (doc?.email && doc?.password) {
      return { email: doc.email, password: doc.password };
    }
  } catch {
    /* fall through to defaults */
  }
  return { email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD };
}

export async function setPassword(newPassword: string): Promise<void> {
  const { db } = await connectToDatabase();
  const current = await db.collection("credentials").findOne({ slug: "main" });
  await db.collection("credentials").updateOne(
    { slug: "main" },
    {
      $set: {
        slug: "main",
        email: current?.email || DEFAULT_ADMIN_EMAIL,
        password: newPassword,
      },
    },
    { upsert: true }
  );
}
