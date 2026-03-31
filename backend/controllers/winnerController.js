const supabase = require("../config/supabaseClient");

exports.uploadProof = async (req, res) => {
  try {
    const userId = req.user.id;
    const { winnerId, proof_url } = req.body;

    const { data, error } = await supabase
      .from("winners")
      .update({ proof_url })
      .eq("id", winnerId)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ message: "Proof uploaded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyWinner = async (req, res) => {
  try {
    const { winnerId } = req.body;

    const { error } = await supabase
      .from("winners")
      .update({
        verified: true,
        status: "paid",
      })
      .eq("id", winnerId);

    if (error) throw error;

    res.json({ message: "Winner verified & marked as paid" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};