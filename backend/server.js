// Paystack Backend for Hope Beyond Borders Foundation
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

console.log("🚀 Paystack backend starting...");

// Test endpoint
app.get("/", (req, res) => {
  res.json({ status: "✅ Paystack backend is running!" });
});

// Initialize Paystack Payment
app.post("/initialize-payment", async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;

    console.log("📥 Received donation:", { amount, name, email, phone });

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: email,
        amount: amount * 100, // Convert Rands to cents
        currency: "ZAR",
        metadata: {
          donor_name: name,
          donor_phone: phone,
        },
        callback_url:
          "https://mubarek993.github.io/hope-beyond-borders/donate-success.html",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Payment initialized:", response.data.data.reference);
    res.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error(
      "❌ Paystack Error:",
      error.response?.data?.message || error.message,
    );
    res.status(500).json({
      error: error.response?.data?.message || error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("🚀 Paystack backend running on http://localhost:3000");
  console.log("📌 Test endpoint: http://localhost:3000/");
  console.log("📌 Initialize: POST http://localhost:3000/initialize-payment");
});
