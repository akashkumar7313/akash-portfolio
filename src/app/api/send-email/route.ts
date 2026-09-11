import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916393342727";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection("messages").insertOne({
        name,
        email,
        phone: phone || "",
        message,
        read: false,
        createdAt: new Date().toISOString(),
      });
      console.log("Message saved to MongoDB");
    } catch (e) {
      console.error("Failed to save message to DB:", e);
    }

    // Generate WhatsApp link
    const whatsappMsg = encodeURIComponent(`Hi ${name},\n\nThanks for reaching out through my portfolio!\n\nYour message: "${message}"\n\nBest regards,\nAkash Kumar Prajapati`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

    // Send email
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_EMAIL || user;

    if (host && user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port: Number(port) || 587,
          secure: false,
          auth: { user, pass },
          tls: { rejectUnauthorized: false },
        });

        const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
        const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
        const escName = name.replace(/'/g, "\\'");
        const escEmail = email.replace(/'/g, "\\'");
        const escPhone = phone ? phone.replace(/'/g, "\\'") : "";
        const escMessage = message.replace(/'/g, "\\'");
        const mailtoLink = `mailto:${escEmail}?subject=Re%3A%20Your%20Portfolio%20Message&body=Hi%20${encodeURIComponent(name)}%2C%0A%0AThanks%20for%20reaching%20out%20through%20my%20portfolio.`;

        await transporter.sendMail({
          from: `"Portfolio Contact" <${user}>`,
          replyTo: email,
          to,
          subject: `New message from ${name} — Portfolio Contact`,
          html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a0f;">
<tr><td align="center" style="padding:24px 16px;">
<table cellpadding="0" cellspacing="0" border="0" width="560" style="background:#0f172a;border-radius:20px;border:1px solid #1e293b;">
<tr><td style="padding:36px 32px 28px;text-align:center;border-bottom:1px solid #1e293b;">
<table cellpadding="0" cellspacing="0" border="0" align="center">
<tr><td style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#c9f36c,#a8d94a);text-align:center;font-size:24px;line-height:56px;color:#101412;font-weight:bold;">&#9993;</td></tr>
</table>
<h1 style="color:#fff;font-size:22px;font-weight:700;margin:16px 0 4px;">New Portfolio Contact</h1>
<p style="color:#94a3b8;font-size:13px;margin:0;">Someone just reached out to you</p>
</td></tr>
<tr><td style="padding:24px 32px 0;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;">
<tr><td style="padding:20px 24px;">
<table cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td width="52" style="vertical-align:middle;">
<table cellpadding="0" cellspacing="0" border="0">
<tr><td style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#c9f36c,#a8d94a);text-align:center;font-size:18px;font-weight:700;line-height:44px;color:#101412;">${initials}</td></tr>
</table>
</td>
<td style="padding-left:14px;vertical-align:middle;">
<p style="color:#94a3b8;font-size:10px;margin:0 0 1px;text-transform:uppercase;letter-spacing:0.5px;">Name</p>
<p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 6px;">${escName}</p>
<p style="color:#94a3b8;font-size:10px;margin:0 0 1px;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
<p style="color:#c9f36c;font-size:13px;margin:0;">${escEmail}</p>
</td>
${escPhone ? `<td style="padding-left:14px;vertical-align:middle;">
<p style="color:#94a3b8;font-size:10px;margin:0 0 1px;text-transform:uppercase;letter-spacing:0.5px;">Phone</p>
<p style="color:#a8d94a;font-size:13px;font-weight:500;margin:0;">${escPhone}</p>
</td>` : ""}
</tr>
</table>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:24px 32px 8px;">
<p style="color:#c9f36c;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin:0 0 10px;">&#9679; Message</p>
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a0f;border:1px solid #1e293b;border-radius:12px;">
<tr><td style="padding:20px;">
<p style="color:#e2e8f0;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${escMessage}</p>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:8px 32px 32px;">
<table cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td style="border-radius:12px;background:linear-gradient(135deg,#c9f36c,#a8d94a);text-align:center;width:48%;">
<a href="${mailtoLink}" style="display:block;padding:14px 24px;color:#101412;font-size:14px;font-weight:600;text-decoration:none;">&#9993; Reply via Email</a>
</td>
<td style="width:4%;"></td>
<td style="border-radius:12px;background:linear-gradient(135deg,#25d366,#128c7e);text-align:center;width:48%;">
<a href="${whatsappLink}" style="display:block;padding:14px 24px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">&#128172; Reply via WhatsApp</a>
</td>
</tr>
</table>
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #1e293b;text-align:center;">
<p style="color:#475569;font-size:11px;margin:0;">
<span style="color:#64748b;">${dateStr}</span>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`,
        });

        console.log("Email sent successfully to", to);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    } else {
      console.log("SMTP not configured, skipping email");
    }

    // Send SMS in background (non-blocking)
    fetch(`${req.nextUrl.origin}/api/send-sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Message saved, email & SMS sent",
      whatsappLink,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process. Please try again later." },
      { status: 500 }
    );
  }
}
