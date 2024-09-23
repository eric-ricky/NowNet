import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, message, subject } = await req.json();

    if (!email || !message)
      return NextResponse.json(
        { error: "No email / message provided" },
        { status: 400 }
      );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 456,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER_EMAIL,
        pass: process.env.GMAIL_PASS_KEY,
      },
    });

    // send mail
    const info = await transporter.sendMail({
      from: "Belinda from NowNet 🚀", // sender address
      to: email, // list of receivers
      subject: subject || "from NowNet",
      html: `<div>
      ${message}
      </div>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ data: info.messageId }, { status: 200 });
  } catch (error) {
    console.log("EMAIL ERROR ====>", error);
    return NextResponse.json(
      { error: "Internal Error", data: error },
      { status: 500 }
    );
  }
}
