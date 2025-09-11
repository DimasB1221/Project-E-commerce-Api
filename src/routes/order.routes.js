/**
 * src/routes/order.routes.js
 *
 * Routes:
 *  - POST   /api/orders      -> buat order dari cart (user/admin)
 *  - GET    /api/orders/mine -> daftar order user
 *  - GET    /api/orders/all  -> admin lihat semua order
 */

import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import { createOrderFromCart, myOrders, allOrders } from "../controllers/order.controller.js";

const router = Router();

// Semua route butuh login
router.use(protect);

router.post("/", authorize("user", "admin"), createOrderFromCart);
router.get("/mine", authorize("user", "admin"), myOrders);
router.get("/all", authorize("admin"), allOrders);

export default router;
