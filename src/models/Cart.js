/**
 * Cart Model
 * -----------------
 * Representasi keranjang belanja user.
 * Field:
 *  - user: referensi ke User
 *  - items: daftar produk dengan quantity
 */

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, min: 1 }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
