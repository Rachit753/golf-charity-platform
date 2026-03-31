const express = require("express");
const cors = require("cors");

const supabase = require("./config/supabaseClient");

const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());

// ✅ Webhook MUST be before express.json()
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    require("./controllers/webhookController")
);

// ✅ Then JSON parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Root
app.get("/", (req, res) => {
    res.send("Backend is running ");
});

// Test DB
app.get("/test-db", async (req, res) => {
    try {
    const { data, error } = await supabase
        .from("users")
        .select("*");

    if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
    } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
    }
});

// Protected route
app.get("/protected", authMiddleware, (req, res) => {
    res.json({
    message: "Protected route accessed",
    user: req.user,
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});