const express = require("express");
const cors = require("cors");

const supabase = require("./config/supabaseClient");

const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const drawRoutes = require("./routes/drawRoutes");
const winnerRoutes = require("./routes/winnerRoutes");
const charityRoutes = require("./routes/charityRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const subscriptionMiddleware = require("./middleware/subscriptionMiddleware");


const app = express();

app.use(cors());

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    require("./controllers/webhookController")
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/charities", charityRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running ");
});

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

app.get("/protected", authMiddleware, (req, res) => {
    res.json({
    message: "Protected route accessed",
    user: req.user,
    });
});

app.get(
    "/premium",
    require("./middleware/authMiddleware"),
    subscriptionMiddleware,
    (req, res) => {
    res.json({
        message: "Welcome to premium features 🎉",
    });
    }
);


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});