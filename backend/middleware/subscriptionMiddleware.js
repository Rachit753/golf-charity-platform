const supabase = require("../config/supabaseClient");

const subscriptionMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;

    console.log("Checking subscription for:", userId);

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle(); 

    console.log("Subscription data:", data);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (!data) {
      return res.status(403).json({
        message: "Subscription required",
      });
    }

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = subscriptionMiddleware;