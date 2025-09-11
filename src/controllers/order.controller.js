/**
 * src/controllers/order.controller.js
 *
 * Fungsi:
 *  - createOrderFromCart: buat order dari cart user (cek stok, snapshot produk, kurangi stok)
 *  - myOrders: daftar order user
 *  - allOrders: admin lihat semua order
 *
 * Catatan penting:
 *  - Untuk produksi, prefer menggunakan transaksi mongo (session) saat:
 *     * memvalidasi stok, mengurangi stok, membuat order, dan mengosongkan cart
 *    agar operasi atomik. Di contoh ini implementasi sederhana tanpa session.
 */

import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrderFromCart = async (req, res, next) => {
  try {
    // Ambil cart dan populate product detail
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      const e = new Error("Cart is empty");
      e.status = 400;
      throw e;
    }

    // Validasi stok untuk semua item
    for (const it of cart.items) {
      if (it.qty > it.product.stock) {
        const e = new Error(`Insufficient stock for ${it.product.name}`);
        e.status = 400;
        throw e;
      }
    }

    // Susun items snapshot dan total
    const items = cart.items.map((it) => {
      const price = it.product.price ?? 0;
      const subtotal = price * it.qty;
      return {
        product: it.product._id,
        name: it.product.name,
        price,
        qty: it.qty,
        subtotal
      };
    });
    const total = items.reduce((acc, it) => acc + (it.subtotal || 0), 0);

    // Kurangi stok produk
    for (const it of cart.items) {
      await Product.findByIdAndUpdate(it.product._id, { $inc: { stock: -it.qty } });
    }

    // Buat order
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      status: "pending"
    });

    // Kosongkan cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const allOrders = async (_req, res, next) => {
  try {
    // Admin overview: populasi nama email user
    const orders = await Order.find().populate("user", "name email role").sort("-createdAt");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
