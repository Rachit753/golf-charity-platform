const supabase = require("../config/supabaseClient");

exports.runDraw = async (req, res) => {
  try {
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }

    const { data: drawData, error: drawError } = await supabase
      .from("draws")
      .insert([
        {
          draw_date: new Date(),
          numbers,
          status: "published",
        },
      ])
      .select()
      .single();

    if (drawError) throw drawError;

    const drawId = drawData.id;

    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*");

    if (userError) throw userError;

    let winners = [];

    for (let user of users) {
      const { data: scores } = await supabase
        .from("scores")
        .select("score")
        .eq("user_id", user.id);

      if (!scores || scores.length === 0) continue;

      const userScores = scores.map(s => s.score);

      const matches = userScores.filter(s => numbers.includes(s)).length;

      if (matches >= 3) {
        winners.push({
          user_id: user.id,
          draw_id: drawId,
          match_type: matches.toString(),
          amount: 0,
          status: "pending",
        });
      }
    }

    if (winners.length > 0) {
      await supabase.from("winners").insert(winners);
    }

    res.json({
      message: "Draw executed & winners calculated",
      numbers,
      winnersCount: winners.length,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};