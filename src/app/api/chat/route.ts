import { NextRequest, NextResponse } from "next/server";

const faq: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["who", "are", "you", "akash", "introduce", "yourself", "about"],
    answer:
      "I'm <strong>Akash Kumar Prajapati</strong> — a Software Engineer with 4+ years of experience building high-performance cross-platform mobile apps using <strong>Flutter</strong> and <strong>React Native</strong>. I specialize in end-to-end mobile development, Firebase backend systems, payment integrations, and App Store & Play Store deployment.",
  },
  {
    keywords: ["skill", "technologies", "tech stack", "tools", "expertise", "know"],
    answer:
      "Here's what I work with:<br><br>📱 <strong>Mobile:</strong> Flutter, Dart, React Native, Android, iOS<br>⚙️ <strong>State Mgmt:</strong> BLoC, Riverpod, Redux, Provider<br>🔥 <strong>Backend:</strong> Firebase, Firestore, FCM, REST APIs, GraphQL<br>💳 <strong>Payments:</strong> Stripe, Razorpay, In-App Purchases<br>🛠️ <strong>Tools:</strong> Git, GitHub, Xcode, Android Studio, VS Code, Jira, Codemagic",
  },
  {
    keywords: ["experience", "work", "job", "company", "employment", "career"],
    answer:
      "I have 3+ years of professional experience:<br><br>🔹 <strong>Software Engineer</strong> at <strong>Singsys</strong> (Current)<br>🔹 <strong>React Native Developer</strong> at <strong>Vibrant IT</strong><br>🔹 <strong>Jr. Web Developer</strong> at <strong>Softpro India</strong><br><br>I've built apps for e-commerce, healthcare, food delivery, fintech, fitness, and task management.",
  },
  {
    keywords: ["project", "portfolio", "work", "built", "build", "app"],
    answer:
      "I've built <strong>6 major projects</strong> showcased in my portfolio:<br><br>🛒 E-Commerce App (Flutter + Firebase)<br>🏥 Healthcare Booking App (React Native + WebRTC)<br>🍕 Food Delivery Platform (Flutter + Google Maps)<br>📋 Task Management SaaS (React Native)<br>💰 Fintech Budget App (Flutter + Charts)<br>🏋️ Social Fitness App (React Native + HealthKit)<br><br>Check them out in the <strong>Projects</strong> section!",
  },
  {
    keywords: ["education", "study", "degree", "college", "university", "qualification"],
    answer:
      "🎓 <strong>B.Tech in Computer Science & Engineering</strong><br>📍 Major in CSE<br><br>🎓 <strong>Diploma in Computer Science & Engineering</strong><br><br>I continuously upskill through online courses, developer communities, and hands-on project experience.",
  },
  {
    keywords: ["contact", "hire", "freelance", "opportunity", "reach", "email"],
    answer:
      "You can reach me through:<br><br>📧 <strong>Email:</strong> akashkumarprajapati2003@gmail.com<br>💼 <strong>LinkedIn:</strong> /in/akash-kumarprajapati<br>📱 <strong>WhatsApp:</strong> Click the WhatsApp button on this page!<br><br>I'm open to freelance opportunities, full-time roles, and collaborations!",
  },
  {
    keywords: ["resume", "cv", "download", "hire"],
    answer:
      "You can download my resume by clicking the <strong>Download Resume</strong> button in the Hero section at the top of the page. It includes my full work history, education, skills, and project details.",
  },
  {
    keywords: ["flutter", "react native", "cross platform", "mobile"],
    answer:
      "I have deep expertise in both <strong>Flutter</strong> (Dart, BLoC, Riverpod) and <strong>React Native</strong> (Redux, Firebase). I build cross-platform apps that run smoothly on both Android and iOS with shared codebases, native performance, and beautiful UIs.",
  },
  {
    keywords: ["payment", "stripe", "razorpay", "gateway"],
    answer:
      "I've integrated <strong>Stripe</strong> and <strong>Razorpay</strong> in multiple production apps, handling payment flows, webhooks, refund processing, and subscription management. I also have experience with in-app purchases on both stores.",
  },
  {
    keywords: ["firebase", "backend", "server", "database"],
    answer:
      "I'm proficient with the full Firebase ecosystem: <strong>Firestore</strong> (real-time DB), <strong>Authentication</strong>, <strong>Cloud Functions</strong>, <strong>FCM</strong> (push notifications), <strong>Cloud Storage</strong>, and <strong>Firebase Analytics</strong>. I also work with REST APIs and GraphQL.",
  },
  {
    keywords: ["deploy", "play store", "app store", "release", "publish"],
    answer:
      "I've published multiple apps to both <strong>Google Play Store</strong> and <strong>Apple App Store</strong>. I handle the full deployment pipeline: code signing, app store metadata, screenshots, review process, and post-release monitoring.",
  },
  {
    keywords: ["hi", "hello", "hey", "good morning", "good evening"],
    answer:
      "👋 Hello! Welcome to my portfolio. I'm Akash, a mobile app developer. Feel free to ask me about my skills, projects, experience, or anything else. How can I help you today?",
  },
  {
    keywords: ["thanks", "thank", "bye", "goodbye"],
    answer:
      "You're welcome! 😊 If you have more questions, feel free to ask. You can also reach out via the contact form or WhatsApp. Have a great day!",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const msg = message.toLowerCase().trim();

    // If OpenAI key is set, use GPT for intelligent responses
    if (apiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful portfolio assistant for Akash Kumar Prajapati, a Software Engineer specializing in Flutter and React Native. Answer questions about his skills, experience, projects, and background. Be friendly, concise, and use emojis occasionally. If asked something you don't know, politely say so.",
              },
              { role: "user", content: message },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ reply });
        }
      } catch {
        // Fallback to FAQ on API error
        console.log("OpenAI API error, falling back to FAQ");
      }
    }

    // FAQ mode: find best matching answer
    let bestMatch = { score: 0, answer: faq[faq.length - 1].answer };

    for (const item of faq) {
      let score = 0;
      for (const keyword of item.keywords) {
        if (msg.includes(keyword) || keyword.includes(msg)) {
          score += 2;
        }
      }
      // Bonus for matching multiple keywords
      const words = msg.split(/\s+/);
      for (const word of words) {
        if (word.length > 2 && item.keywords.some((k) => k.includes(word) || word.includes(k))) {
          score += 1;
        }
      }
      if (score > bestMatch.score) {
        bestMatch = { score, answer: item.answer };
      }
    }

    return NextResponse.json({ reply: bestMatch.answer });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble responding right now. Please try again later." }
    );
  }
}
