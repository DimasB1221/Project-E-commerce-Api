import { Router } from "express";
import {
  createProduct, listProducts, getProduct, updateProduct, deleteProduct
} from "../controllers/product.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * Routes Produk
 * -----------------
 * - GET    /api/products       → list semua produk
 * - GET    /api/products/:id   → detail produk
 * - POST   /api/products       → tambah produk (admin)
 * - PATCH  /api/products/:id   → update produk (admin)
 * - DELETE /api/products/:id   → hapus produk (admin)
 */
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, authorize("admin"), createProduct);
router.patch("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
