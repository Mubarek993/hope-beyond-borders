// server.js - NEW FILE
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51TdtlWASH9g2dCzu9AkddnFScby0JM0r5XgnhEwmvmCrNKnAZpcfkllergy4ebr6I7PVyp9tofeofvqimnc1geto00r433dwKW",
);
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;

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
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000"),
);
