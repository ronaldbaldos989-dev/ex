import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// EMAILJS ENV VALUES (galing sa Render Dashboard)
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE = process.env.EMAILJS_SERVICE;
const EMAILJS_TEMPLATE = process.env.EMAILJS_TEMPLATE;

app.post("/send-email", async (req, res) => {
  const { template_params } = req.body;

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log("❌ EmailJS Error:", errorData);
      return res.status(500).json({ error: "EmailJS failed", details: errorData });
    }

    console.log("✅ Email sent!");
    res.json({ success: true });

  } catch (error) {
    console.log("❌ Server Error:", error);
    res.status(500).json({ error: "Server crashed", details: error });
  }
});

// RENDER PORT
app.listen(process.env.PORT || 10000, () => {
  console.log("🚀 Server running...");
});
