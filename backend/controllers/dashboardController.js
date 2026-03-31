const supabase = require("../config/supabaseClient");

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    const { data: scores } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(5);

    const { data: winnings } = await supabase
      .from("winners")
      .select("*")
      .eq("user_id", userId);

    const totalWinnings =
      winnings?.reduce((sum, w) => sum + (w.amount || 0), 0) || 0;

    const { data: charity } = await supabase
      .from("user_charity")
      .select("*, charities(*)")
      .eq("user_id", userId)
      .maybeSingle();

    res.json({
      subscription,
      scores,
      totalWinnings,
      charity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const { data: users } = await supabase.from("users").select("*");
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "active");

    const { data: winners } = await supabase.from("winners").select("*");
    const { data: charities } = await supabase.from("charities").select("*");

    const totalUsers = users.length;
    const activeSubscriptions = subs.length;
    const totalWinners = winners.length;
    const totalCharities = charities.length;

    res.json({
      totalUsers,
      activeSubscriptions,
      totalWinners,
      totalCharities,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};