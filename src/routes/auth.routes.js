/**
 * src/routes/auth.routes.js
 *
 * Endpoints:
 *  - POST /api/auth/register  -> register (public)
 *  - POST /api/auth/login     -> login (public)
 *  - POST /api/auth/logout    -> logout (protected)
 *  - GET  /api/auth/me        -> current user (protected)
 */

import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout); // butuh token untuk dimasukkan ke blacklist
router.get("/me", protect, getMe);

export default router;
