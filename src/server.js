import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "../routes/auth.routes.js";
import menuRoutes from "../routes/menu.routes.js";
import subMenuRoutes from "../routes/subMenu.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

await connectDB(); // ✅ WORKS NOW

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/submenus", subMenuRoutes);

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
