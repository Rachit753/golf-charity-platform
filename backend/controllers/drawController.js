const supabase = require("../config/supabaseClient");

// 🎲 Generate Draw
exports.runDraw = async (req, res) => {
  try {
    // Generate 5 random numbers (1–45)
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }

    // Save draw in DB
    const { data, error } = await supabase
      .from("draws")
      .insert([
        {
          draw_date: new Date(),
          numbers: numbers,
          status: "published",
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      message: "Draw executed successfully",
      numbers,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};