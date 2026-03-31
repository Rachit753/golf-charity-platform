const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from("users")
        .insert([
        { name, email, password: hashedPassword, role: "user" }
        ])
        .select();

    if (error) return res.status(400).json(error);

    const token = jwt.sign(
    { id: data[0].id, email, role: data[0].role },
    "SECRET_KEY",
    { expiresIn: "7d" }
);

    res.json({ user: data[0], token });
    } catch (err) {
    res.status(500).json(err);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !data) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

        const token = jwt.sign(
            { id: data[0].id, email, role: data[0].role },
            "SECRET_KEY",
            { expiresIn: "7d" });

    res.json({ user: data, token });
    } catch (err) {
    res.status(500).json(err);
    }
};