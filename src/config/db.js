import mongoose from "mongoose";

/**
 * connectDB()
 * -----------------
 * Fungsi untuk menghubungkan aplikasi ke MongoDB.
 * - Ambil URL dari process.env.MONGO_URI
 * - Kalau berhasil → tampilkan host MongoDB
 * - Kalau gagal → matikan process dengan error
 */
const connectDB = async () => {
  try {
    // Coba konek ke MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Jika sukses, tampilkan nama host
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    // Jika gagal, tampilkan error & hentikan app
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
