const supabase = require("../config/supabaseClient");

exports.getCharities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("charities")
      .select("*")

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("CHARITIES FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.selectCharity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { charity_id, percentage } = req.body;

    if (percentage < 10) {
      return res.status(400).json({
        message: "Minimum 10% required",
      });
    }

    const { data, error } = await supabase
      .from("user_charity")
      .upsert(
        [
          {
            user_id: userId,
            charity_id,
            percentage,
          },
        ],
        { onConflict: "user_id" }
      );

    if (error) throw error;

    res.json({ message: "Charity selected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserCharity = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("user_charity")
      .select(`
        percentage,
        charities (
          id,
          name
        )
      `)
      .eq("user_id", userId)
      .single(); 

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("CHARITY FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};