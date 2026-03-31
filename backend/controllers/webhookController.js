const stripe = require("../config/stripe");
const supabase = require("../config/supabaseClient");

module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Log ALL events (important)
    console.log("EVENT TYPE:", event.type);

  } catch (err) {
    console.error(" Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // HANDLE CHECKOUT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Checkout completed:", session);

      // Extract data
      const userId = session.client_reference_id || "test-user";
      const plan = session.metadata?.plan || "basic";

      // Validate
      if (!userId) {
        console.error("Missing userId in session");
        return;
      }

      // Save subscription in Supabase
      const { data, error } = await supabase
        .from("subscriptions")
        .insert([
          {
            user_id: userId,
            plan: plan,
            status: "active",
            start_date: new Date(),
            end_date: null,
          },
        ]);

      if (error) {
        console.error("DB Error:", error);
      } else {
        console.log("Subscription saved!");
      }
    }

  } catch (err) {
    console.error("Handler Error:", err);
  }

  res.json({ received: true });
};