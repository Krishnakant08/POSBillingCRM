import ApiResponse from "../utils/apiResponse.js";
import {
  upsertMenuService,
  getMenusService,
  deleteMenuService,
  getMenusWithItemsService,
} from "../services/menu.service.js";

export const upsertMenu = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const { menuId, menuName } = req.body;

    if (!menuName) {
      throw new Error("Menu name is required");
    }

    const result = await upsertMenuService(hotelId, menuId, menuName);

    return res.json(
      ApiResponse.success(menuId ? "Menu updated" : "Menu created", result),
    );
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};

export const getMenus = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;

    const menus = await getMenusService(hotelId);

    return res.json(ApiResponse.success("Menus fetched", menus));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const { menuId } = req.params;

    await deleteMenuService(hotelId, menuId);

    return res.json(ApiResponse.success("Menu deleted"));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};

export const getMenusWithItems = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;

    if (!hotelId) throw new Error("Hotel not linked with user");

    const data = await getMenusWithItemsService(hotelId);

    return res.json(ApiResponse.success("Menus with items fetched", data));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};
