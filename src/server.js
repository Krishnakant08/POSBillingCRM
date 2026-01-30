import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

await connectDB(); // 👈 IMPORTANT

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
