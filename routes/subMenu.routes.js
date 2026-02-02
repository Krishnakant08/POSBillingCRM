import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  upsertSubMenu,
  getSubMenusByMenu,
  deleteSubMenu,
} from "../src/controllers/subMenu.controller.js";

const router = Router();

// Get submenu items by menu
router.get("/:menuId", authMiddleware, getSubMenusByMenu);

// Add or Update submenu item
router.post("/", authMiddleware, upsertSubMenu);

// Soft delete submenu
router.delete("/:subMenuItemId", authMiddleware, deleteSubMenu);

export default router;
