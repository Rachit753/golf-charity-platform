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

    const { data: lastDraw } = await supabase
      .from("draws")
      .select("*")
      .order("draw_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const previousJackpot = lastDraw?.jackpot || 0;

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

      const userScores = scores.map((s) => s.score);
      const matches = userScores.filter((s) => numbers.includes(s)).length;

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

    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "active");

    const totalUsers = subs ? subs.length : 0;

    const basePool = totalUsers * 100;
    const totalPool = basePool + previousJackpot;

    const pool5 = totalPool * 0.4;
    const pool4 = totalPool * 0.35;
    const pool3 = totalPool * 0.25;

    const winners5 = winners.filter((w) => w.match_type === "5");
    const winners4 = winners.filter((w) => w.match_type === "4");
    const winners3 = winners.filter((w) => w.match_type === "3");

    let newJackpot = 0;

    if (winners5.length === 0) {
      newJackpot = pool5;
    } else {
      const amountPerUser = pool5 / winners5.length;
      for (let w of winners5) {
        await supabase
          .from("winners")
          .update({ amount: amountPerUser })
          .eq("user_id", w.user_id)
          .eq("draw_id", drawId);
      }
    }

    const updateWinnerAmounts = async (group, pool) => {
      if (group.length === 0) return;

      const amountPerUser = pool / group.length;

      for (let w of group) {
        await supabase
          .from("winners")
          .update({ amount: amountPerUser })
          .eq("user_id", w.user_id)
          .eq("draw_id", drawId);
      }
    };

    await updateWinnerAmounts(winners4, pool4);
    await updateWinnerAmounts(winners3, pool3);

    await supabase
      .from("draws")
      .update({ jackpot: newJackpot })
      .eq("id", drawId);

    res.json({
      message: "Draw executed & winners calculated",
      numbers,
      winnersCount: winners.length,
      totalPool,
      jackpot: newJackpot,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDrawHistory = async (req, res) => {
  const { data, error } = await supabase
    .from("draws")
    .select(`
      id,
      draw_date,
      numbers,
      winners (
        id,
        match_type,
        amount,
        user_id,
        users ( name )
      )
    `)
    .order("draw_date", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.json(data);
};