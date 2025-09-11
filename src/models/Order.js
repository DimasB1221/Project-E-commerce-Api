/**
 * Order Model
 * -----------------
 * Representasi pesanan user.
 * Field:
 *  - user: siapa yang pesan
 *  - items: produk + jumlah
 *  - total: jumlah harga
 *  - status: state pesanan
 */

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, min: 1 }
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "shipped"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
