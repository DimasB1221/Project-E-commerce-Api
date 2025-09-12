/**
 * seed.js
 *
 * File ini digunakan untuk mengisi data awal ke database.
 * Misalnya: buat akun admin default dan beberapa produk contoh.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Import model
import User from "./models/User.js";
import Product from "./models/Product.js";

// Load .env
dotenv.config();

// Koneksi ke database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding..."))
  .catch((err) => console.error(err));

// Data awal
const seedUsers = [
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "123456", // nanti di-hash
    role: "admin",
  },
  {
    name: "Normal User",
    email: "user@test.com",
    password: "123456",
    role: "user",
  },
];

const seedProducts = [
  {
    name: "Laptop Gaming",
    price: 15000000,
    stock: 5,
  },
  {
    name: "Keyboard Mechanical",
    price: 750000,
    stock: 20,
  },
];

// Fungsi seeding
const seedData = async () => {
  try {
    // Bersihin data lama
    await User.deleteMany();
    await Product.deleteMany();

    // Hash password untuk user
    const usersWithHashedPassword = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Simpan data
    await User.insertMany(usersWithHashedPassword);
    await Product.insertMany(seedProducts);

    console.log("Data seeding berhasil 🚀");
    process.exit();
  } catch (error) {
    console.error("Error saat seeding:", error);
    process.exit(1);
  }
};

seedData();
