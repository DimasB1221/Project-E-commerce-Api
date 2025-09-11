import Product from "../models/Product.js";

/**
 * @route   GET /api/products
 * @desc    Ambil semua produk
 * @access  Public
 */
export const listProducts = async (_req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Ambil detail produk
 * @access  Public
 */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/products
 * @desc    Tambah produk baru (hanya admin)
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, image } = req.body;
    const product = await Product.create({ name, description, price, stock, image });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PATCH /api/products/:id
 * @desc    Update produk
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Hapus produk
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
};
