import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import nodemailer from "nodemailer";

function contactDevPlugin(env: Record<string, string>) {
  return {
    name: "dev-contact-endpoint",
    configureServer(server: any) {
      server.middlewares.use("/api/contact", async (req: any, res: any, next: any) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let raw = "";
        req.on("data", (chunk: Buffer) => {
          raw += chunk.toString();
        });

        req.on("end", async () => {
          try {
            const { name, email, message } = JSON.parse(raw || "{}");
            if (!name || !email || !message) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid payload" }));
              return;
            }

            if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.TO_EMAIL) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "SMTP env vars missing in dev server" }));
              return;
            }

            const transporter = nodemailer.createTransport({
              host: env.SMTP_HOST,
              port: Number(env.SMTP_PORT || 587),
              secure: Number(env.SMTP_PORT || 587) === 465,
              auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
              },
            });

            await transporter.verify();
            await transporter.sendMail({
              from: `"Portfolio Contact" <${env.SMTP_USER}>`,
              to: env.TO_EMAIL,
              replyTo: email,
              subject: `New message from ${name}`,
              text: message,
              html: `<p><strong>Name:</strong> ${name}</p>
                     <p><strong>Email:</strong> ${email}</p>
                     <p><strong>Message:</strong></p>
                     <p>${message.replace(/\n/g, "<br/>")}</p>`,
            });

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err?.message || "Failed to send" }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), contactDevPlugin(env)],
  };
});
