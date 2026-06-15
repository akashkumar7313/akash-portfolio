import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_EMAIL || user;

    if (!host || !user || !pass) {
      console.log("[DEV] Contact form submission:", { name, email, phone, message });
      return NextResponse.json({
        success: true,
        message: "Message received (dev mode — SMTP not configured)",
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      replyTo: email,
      to,
      subject: `New message from ${name} — Portfolio Contact`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; margin-bottom: 20px;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;">${email}</td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">Phone</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;">${phone}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top: 20px; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">Sent from akash-portfolio.vercel.app</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
