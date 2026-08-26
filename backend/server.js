// server.js
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

console.log("🚀 Stripe backend starting...");

// Test endpoint
app.get("/", (req, res) => {
  res.json({ status: "✅ Stripe backend is running!" });
});

// Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;

    console.log("📥 Received donation:", { amount, name, email, phone });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "zar",
            product_data: {
              name: "Hope Beyond Borders Foundation Donation",
              description:
                "Supporting education, healthcare, and technology in Southern Africa",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "https://mubarek993.github.io/hope-beyond-borders/donate-success.html",
      cancel_url:
        "https://mubarek993.github.io/hope-beyond-borders/donate.html",
      customer_email: email,
      metadata: {
        donor_name: name,
        donor_phone: phone,
      },
    });

    console.log("✅ Session created:", session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
  console.log("📌 Test endpoint: http://localhost:3000/");
  console.log(
    "📌 Create session: POST http://localhost:3000/create-checkout-session",
  );
});
