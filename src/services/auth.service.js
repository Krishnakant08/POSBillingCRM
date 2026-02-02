import { getPool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

export const loginService = async (email, password) => {
  const pool = getPool();

  const result = await pool.request().input("Email", email).query(`
      SELECT UserId, HotelId, FullName, Phone, Email, PasswordHash, Role, IsActive
      FROM Users
      WHERE Email = @Email
    `);

  const user = result.recordset[0];

  if (!user) throw new Error("Invalid email or password");
  if (!user.IsActive) throw new Error("User account is inactive");
  if (user.PasswordHash !== password)
    throw new Error("Invalid email or password");

  // 🔐 JWT payload (DO NOT put password)
  const tokenPayload = {
    userId: user.UserId,
    email: user.Email,
    role: user.Role,
    hotelId: user.HotelId,
  };

  const token = generateToken(tokenPayload);

  return {
    userId: user.UserId,
    hotelId: user.HotelId,
    fullName: user.FullName,
    email: user.Email,
    phone: user.Phone,
    role: user.Role,
    hasHotel: user.HotelId !== null,
    token, // 👈 JWT returned
  };
};

/* ================= REGISTER ================= */
export const registerService = async (data) => {
  const { fullName, email, phone, password, role = "NA" } = data;

  const pool = getPool();

  // 🔎 Check if email exists
  const exists = await pool
    .request()
    .input("Email", email)
    .query(`SELECT UserId FROM Users WHERE Email = @Email`);

  if (exists.recordset.length > 0) {
    throw new Error("Email already registered");
  }

  // 📝 Insert user
  const result = await pool
    .request()
    .input("FullName", fullName)
    .input("Email", email)
    .input("Phone", phone)
    .input("PasswordHash", password)
    .input("Role", role).query(`
      INSERT INTO Users (FullName, Email, Phone, PasswordHash, Role, IsActive)
      OUTPUT 
        INSERTED.UserId,
        INSERTED.FullName,
        INSERTED.Email,
        INSERTED.Phone,
        INSERTED.Role,
        INSERTED.HotelId
      VALUES (@FullName, @Email, @Phone, @PasswordHash, @Role, 1)
    `);

  const user = result.recordset[0];

  // 🔐 Generate JWT immediately (auto-login)
  const token = generateToken({
    userId: user.UserId,
    email: user.Email,
    role: user.Role,
    hotelId: user.HotelId,
  });

  return {
    userId: user.UserId,
    fullName: user.FullName,
    email: user.Email,
    phone: user.Phone,
    role: user.Role,
    hasHotel: user.HotelId !== null,
    token,
  };
};
