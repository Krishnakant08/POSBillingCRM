import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  upsertMenu,
  getMenus,
  deleteMenu,
  getMenusWithItems,
} from "../src/controllers/menu.controller.js";

const router = Router();

router.get("/", authMiddleware, getMenus);
router.post("/", authMiddleware, upsertMenu);
router.get("/with-items", authMiddleware, getMenusWithItems);
router.delete("/:menuId", authMiddleware, deleteMenu);

export default router;
