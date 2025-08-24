// File : index.js
// Deksripsi : Entry point aplikasi, setup server Express

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware agar bisa membaca JSON di request body
app.use(express.json());


// Import route user
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); // Semua routes user di awali dengan /api/users

// Route dasar (cek server)
app.get('/',(req,res) => {
    res.send('Selamat datang di Project belajar api user saya');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

