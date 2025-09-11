import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config(); // Load variabel dari .env

connectDB(); // Jalankan koneksi DB

const app = express();

// Middleware
app.use(express.json()); // Parsing JSON body request
app.use(morgan("dev"));  // Logger (lihat request di console)

// Routes utama
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Error handler (taruh terakhir)
app.use(errorHandler);

export default app;
