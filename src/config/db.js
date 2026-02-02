import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

export const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log("✅ SQL Server Connected using SQL Authentication");
  } catch (error) {
    console.error("❌ SQL Server Connection Failed:", error);
    process.exit(1);
  }
};

export const getPool = () => pool;
