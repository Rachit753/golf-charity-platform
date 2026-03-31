const supabase = require("../config/supabaseClient");

exports.addScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { score, date } = req.body;

    if (score < 1 || score > 45) {
      return res.status(400).json({
        message: "Score must be between 1 and 45",
      });
    }

    const { data: existingScores, error: fetchError } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (fetchError) throw fetchError;

    if (existingScores.length >= 5) {
      const oldestScore = existingScores[0];

      await supabase
        .from("scores")
        .delete()
        .eq("id", oldestScore.id);
      }

    const { data, error } = await supabase
      .from("scores")
      .insert([
        {
          user_id: userId,
          score,
          date,
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      message: "Score added successfully",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};