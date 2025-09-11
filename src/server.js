import app from "./app.js";

const PORT = process.env.PORT || 3000;

/**
 * Jalankan Express server.
 * - Dengarkan port dari .env (default 3000)
 * - Tampilkan log kalau berhasil
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
