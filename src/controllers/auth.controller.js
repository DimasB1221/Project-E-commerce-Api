import jwt from "jsonwebtoken";
import User from "../models/User.js";
import TokenBlacklist from "../models/TokenBlacklist.js";

/**
 * generateToken()
 * -----------------
 * Utility function untuk membuat JWT.
 * - Payload: { id: user._id }
 * - Secret: JWT_SECRET dari .env
 * - Expire: JWT_EXPIRES_IN dari .env
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Registrasi user baru
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const exists = await User.findOne({ email });
    if (exists) {
      const err = new Error("Email already registered");
      err.status = 400;
      throw err;
    }

    // Buat user baru
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user dan return JWT
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user → simpan token ke blacklist
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.decode(token);
      await TokenBlacklist.create({ token, expAt: new Date(decoded.exp * 1000) });
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Ambil data profil user saat ini
 * @access  Private
 */
export const getMe = (req, res) => {
  res.json(req.user);
};
