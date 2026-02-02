import { getPool } from "../config/db.js";

export const upsertSubMenuService = async (
  hotelId,
  subMenuItemId,
  menuId,
  itemName,
  isVeg,
  basePrice,
) => {
  const pool = getPool();

  // UPDATE
  if (subMenuItemId) {
    await pool
      .request()
      .input("SubMenuItemId", subMenuItemId)
      .input("HotelId", hotelId)
      .input("MenuId", menuId)
      .input("ItemName", itemName)
      .input("IsVeg", isVeg)
      .input("BasePrice", basePrice).query(`
        UPDATE SubMenuItems
        SET
          MenuId = @MenuId,
          ItemName = @ItemName,
          IsVeg = @IsVeg,
          BasePrice = @BasePrice
        WHERE
          SubMenuItemId = @SubMenuItemId
          AND HotelId = @HotelId
      `);

    return { subMenuItemId, itemName };
  }

  // INSERT
  const result = await pool
    .request()
    .input("HotelId", hotelId)
    .input("MenuId", menuId)
    .input("ItemName", itemName)
    .input("IsVeg", isVeg)
    .input("BasePrice", basePrice).query(`
      INSERT INTO SubMenuItems
      (HotelId, MenuId, ItemName, IsVeg, BasePrice, IsAvailable)
      OUTPUT INSERTED.SubMenuItemId, INSERTED.ItemName
      VALUES
      (@HotelId, @MenuId, @ItemName, @IsVeg, @BasePrice, 1)
    `);

  return result.recordset[0];
};

export const getSubMenusByMenuService = async (hotelId, menuId) => {
  const pool = getPool();

  const result = await pool
    .request()
    .input("HotelId", hotelId)
    .input("MenuId", menuId).query(`
      SELECT
        SubMenuItemId,
        MenuId,
        ItemName,
        IsVeg,
        BasePrice
      FROM SubMenuItems
      WHERE
        HotelId = @HotelId
        AND MenuId = @MenuId
        AND IsAvailable = 1
      ORDER BY ItemName
    `);

  return result.recordset;
};

export const deleteSubMenuService = async (hotelId, subMenuItemId) => {
  const pool = getPool();

  await pool
    .request()
    .input("SubMenuItemId", subMenuItemId)
    .input("HotelId", hotelId).query(`
      UPDATE SubMenuItems
      SET IsAvailable = 0
      WHERE SubMenuItemId = @SubMenuItemId
        AND HotelId = @HotelId
    `);
};
