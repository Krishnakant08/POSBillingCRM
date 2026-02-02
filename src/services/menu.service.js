import { getPool } from "../config/db.js";

/**
 * CREATE or UPDATE menu
 */
export const upsertMenuService = async (hotelId, menuId, menuName) => {
  const pool = getPool();

  if (!hotelId) throw new Error("HotelId is required");

  // UPDATE
  if (menuId) {
    const result = await pool
      .request()
      .input("MenuId", menuId)
      .input("HotelId", hotelId)
      .input("MenuName", menuName).query(`
        UPDATE Menus
        SET MenuName = @MenuName
        WHERE MenuId = @MenuId
          AND HotelId = @HotelId
          AND IsActive = 1
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error("Menu not found or unauthorized");
    }

    return { menuId, menuName };
  }

  // INSERT
  const result = await pool
    .request()
    .input("HotelId", hotelId)
    .input("MenuName", menuName).query(`
      INSERT INTO Menus (HotelId, MenuName, IsActive)
      OUTPUT INSERTED.MenuId, INSERTED.MenuName
      VALUES (@HotelId, @MenuName, 1)
    `);

  return result.recordset[0];
};

/**
 * GET menus only
 */
export const getMenusService = async (hotelId) => {
  const pool = getPool();

  const result = await pool.request().input("HotelId", hotelId).query(`
      SELECT MenuId, MenuName
      FROM Menus
      WHERE HotelId = @HotelId AND IsActive = 1
      ORDER BY MenuName
    `);

  return result.recordset;
};

/**
 * 🔥 MOST IMPORTANT SERVICE
 * GET menus WITH submenu items
 */
export const getMenusWithItemsService = async (hotelId) => {
  const pool = getPool();

  const result = await pool.request().input("HotelId", hotelId).query(`
      SELECT 
        m.MenuId,
        m.MenuName,
        s.SubMenuItemId,
        s.ItemName,
        s.IsVeg,
        s.BasePrice
      FROM Menus m
      LEFT JOIN SubMenuItems s
        ON m.MenuId = s.MenuId
        AND s.IsAvailable = 1
      WHERE m.HotelId = @HotelId
        AND m.IsActive = 1
      ORDER BY m.MenuName, s.ItemName
    `);

  const menuMap = {};

  for (const row of result.recordset) {
    if (!menuMap[row.MenuId]) {
      menuMap[row.MenuId] = {
        menuId: row.MenuId,
        menuName: row.MenuName,
        items: [],
      };
    }

    if (row.SubMenuItemId) {
      menuMap[row.MenuId].items.push({
        subMenuItemId: row.SubMenuItemId,
        itemName: row.ItemName,
        isVeg: row.IsVeg,
        basePrice: row.BasePrice,
      });
    }
  }

  return Object.values(menuMap);
};

/**
 * SOFT DELETE menu
 */
export const deleteMenuService = async (hotelId, menuId) => {
  const pool = getPool();

  const result = await pool
    .request()
    .input("MenuId", menuId)
    .input("HotelId", hotelId).query(`
      UPDATE Menus
      SET IsActive = 0
      WHERE MenuId = @MenuId
        AND HotelId = @HotelId
        AND IsActive = 1
    `);

  if (result.rowsAffected[0] === 0) {
    throw new Error("Menu not found or already deleted");
  }

  return true;
};
