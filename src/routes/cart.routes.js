/**
 * src/routes/cart.routes.js
 *
 * Routes:
 *  - GET    /api/cart            -> lihat cart (login required)
 *  - POST   /api/cart/add        -> tambah produk ke cart { productId, qty }
 *  - PATCH  /api/cart/item/:itemId -> update qty
 *  - DELETE /api/cart/item/:itemId -> hapus item
 *  - POST   /api/cart/clear      -> kosongkan cart
 *
 * Semua routes pakai middleware protect + optional authorize (user/admin)
 */

import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cart.controller.js";

const router = Router();

// Semua route di sini membutuhkan user yang login
router.use(protect, authorize("user", "admin"));

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/item/:itemId", updateCartItem);
router.delete("/item/:itemId", removeCartItem);
router.post("/clear", clearCart);

export default router;
