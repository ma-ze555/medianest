const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/media", require("./routes/mediaRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "MediaNest API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
