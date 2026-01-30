import pool from "../config/db.js";

export const loginService = async (email, password) => {
  const result = await pool.request().input("Email", email).query(`
      SELECT UserId, HotelId, FullName, Email, PasswordHash, Role, IsActive
      FROM Users
      WHERE Email = @Email
    `);

  const user = result.recordset[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.IsActive) {
    throw new Error("User account is inactive");
  }

  // Plain password comparison (temporary)
  if (user.PasswordHash !== password) {
    throw new Error("Invalid email or password");
  }

  return {
    userId: user.UserId,
    hotelId: user.HotelId,
    fullName: user.FullName,
    email: user.Email,
    role: user.Role,
  };
};
