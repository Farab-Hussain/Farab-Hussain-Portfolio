import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

/**
 * Serverless mailer for the contact form.
 * Expects POST JSON: { name, email, message }
 *
 * Required env vars:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};
  if (
    !name ||
    !email ||
    !message ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Contact error", err.message);
    } else {
      console.error("Contact error", err);
    }
    return res
      .status(500)
      .json({ error: "Failed to send message. Please try again later." });
  }
}
