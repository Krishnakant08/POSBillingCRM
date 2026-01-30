import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  server: "localhost", // 👈 IMPORTANT
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("✅ SQL Server Connected using SQL Authentication");
  } catch (error) {
    console.error("❌ SQL Server Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
