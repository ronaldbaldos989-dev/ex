import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const __dirname = path.resolve();

// 👉 STATIC FILES DITO
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// EMAILJS API ENDPOINT
app.post("/send-email", async (req, res) => {
  const { template_params } = req.body;

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE,
        template_id: process.env.EMAILJS_TEMPLATE,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params,
      }),
    });

    const data = await response.text();
    console.log("EmailJS Response:", data);

    res.json({ success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PORT
app.listen(process.env.PORT || 10000, () => {
  console.log("🚀 Server running...");
});
