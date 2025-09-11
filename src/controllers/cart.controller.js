/**
 * src/controllers/cart.controller.js
 *
 * Fungsi:
 *  - getCart: ambil (atau buat kalau belum ada) cart user
 *  - addToCart: tambah produk (jika sudah ada produk -> tambah qty)
 *  - updateCartItem: ganti qty suatu item (qty <= 0 -> hapus)
 *  - removeCartItem: hapus item by itemId
 *  - clearCart: kosongkan cart
 *
 * Catatan:
 *  - Semua endpoint ini bersifat protected: harus ada req.user
 *  - Populate items.product untuk menampilkan detail produk
 */

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/** Helper: ambil atau buat cart user, sudah populate items.product */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    if (!productId) {
      const e = new Error("productId is required");
      e.status = 400;
      throw e;
    }
    if (qty <= 0) {
      const e = new Error("qty must be >= 1");
      e.status = 400;
      throw e;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const e = new Error("Product not found");
      e.status = 404;
      throw e;
    }

    const cart = await getOrCreateCart(req.user._id);

    // cari apakah item sudah ada di cart
    const idx = cart.items.findIndex((i) => i.product.equals(product._id));
    if (idx >= 0) {
      // jika ada, tambah qty
      cart.items[idx].qty += qty;
    } else {
      // jika belum ada, push item baru
      cart.items.push({ product: product._id, qty });
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { qty } = req.body;
    const itemId = req.params.itemId;
    const cart = await getOrCreateCart(req.user._id);

    const item = cart.items.id(itemId);
    if (!item) {
      const e = new Error("Item not found in cart");
      e.status = 404;
      throw e;
    }

    if (typeof qty !== "number") {
      const e = new Error("qty must be a number");
      e.status = 400;
      throw e;
    }

    if (qty <= 0) {
      // hapus item jika qty <= 0
      item.remove();
    } else {
      item.qty = qty;
    }

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const cart = await getOrCreateCart(req.user._id);

    const item = cart.items.id(itemId);
    if (!item) {
      const e = new Error("Item not found in cart");
      e.status = 404;
      throw e;
    }

    item.remove();
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};
