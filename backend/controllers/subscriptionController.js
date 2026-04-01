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

      
      client_reference_id: req.user.id, 
      metadata: {
        plan: priceId, 
      },

      success_url: "https://golf-charity-platform-snowy-six.vercel.app/success",
      cancel_url: "https://golf-charity-platform-snowy-six.vercel.app/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Stripe error" });
  }
};