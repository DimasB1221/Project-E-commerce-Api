import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * protect()
 * -----------------
 * Middleware untuk melindungi route private.
 * - Ambil token dari header Authorization: Bearer <token>
 * - Verifikasi token pakai JWT_SECRET
 * - Simpan user yang sudah terverifikasi ke req.user
 */
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const err = new Error("Not authorized, no token");
    err.status = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

/**
 * authorize(...roles)
 * -----------------
 * Middleware role-based authorization.
 * - Terima parameter roles (misal: ["admin"])
 * - Hanya izinkan user dengan role tersebut
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new Error("Not authorized as " + req.user.role);
      err.status = 403;
      return next(err);
    }
    next();
  };
};
