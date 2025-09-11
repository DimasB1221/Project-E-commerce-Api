/**
 * TokenBlacklist Model
 * -----------------
 * Simpan JWT yang sudah di-logout.
 * Field:
 *  - token: string JWT
 *  - expAt: kapan token kadaluarsa
 */

import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expAt: { type: Date }
});

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);
