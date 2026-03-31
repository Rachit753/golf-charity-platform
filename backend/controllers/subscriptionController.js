const stripe = require("../config/stripe");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // ✅ IMPORTANT FIXES
      client_reference_id: req.user.id, // 👈 link user
      metadata: {
        plan: priceId, // 👈 store plan
      },

      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Stripe error" });
  }
};