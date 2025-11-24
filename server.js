import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Static hosting
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ENV
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE = process.env.EMAILJS_SERVICE;
const EMAILJS_TEMPLATE = process.env.EMAILJS_TEMPLATE;

app.post("/send-email", async (req, res) => {
  const { template_params } = req.body;

  console.log("📩 Data:", template_params);
  console.log("🧪 Template:", EMAILJS_TEMPLATE);

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: EMAILJS_PUBLIC_KEY,
        service_id: EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        template_params
      })
    });

    const data = await response.text();
    console.log("📨 EmailJS Response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: "EmailJS failed", details: data });
    }

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: "Server crashed", details: error });
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("🚀 Server running...");
});

