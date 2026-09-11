import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const fromNumber = process.env.TWILIO_PHONE_NUMBER || "";
const toNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  ? `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
  : "+916393342727";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!accountSid || !authToken || !fromNumber) {
      console.log("[DEV] Twilio not configured, skipping SMS");
      return NextResponse.json({ success: true, message: "SMS skipped (dev mode)" });
    }

    const client = twilio(accountSid, authToken);

    const smsBody = `New Portfolio Message!\n\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\n\nMessage: ${message}`;

    await client.messages.create({
      body: smsBody,
      from: fromNumber,
      to: toNumber,
    });

    return NextResponse.json({ success: true, message: "SMS sent" });
  } catch (error) {
    console.error("SMS error:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
