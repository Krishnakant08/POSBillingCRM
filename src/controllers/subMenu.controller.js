import ApiResponse from "../utils/apiResponse.js";
import {
  upsertSubMenuService,
  getSubMenusByMenuService,
  deleteSubMenuService,
} from "../services/subMenu.service.js";

export const upsertSubMenu = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;

    const {
      subMenuItemId, // 👈 for update
      menuId,
      itemName,
      isVeg,
      basePrice,
    } = req.body;

    if (!menuId || !itemName || basePrice == null) {
      throw new Error("Required fields missing");
    }

    const result = await upsertSubMenuService(
      hotelId,
      subMenuItemId,
      menuId,
      itemName,
      isVeg,
      basePrice,
    );

    return res.json(
      ApiResponse.success(
        subMenuItemId ? "SubMenu updated" : "SubMenu created",
        result,
      ),
    );
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};

export const getSubMenusByMenu = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const { menuId } = req.params;

    const items = await getSubMenusByMenuService(hotelId, menuId);

    return res.json(ApiResponse.success("Items fetched", items));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};

export const deleteSubMenu = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const { subMenuItemId } = req.params;

    await deleteSubMenuService(hotelId, subMenuItemId);

    return res.json(ApiResponse.success("SubMenu deleted"));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};
