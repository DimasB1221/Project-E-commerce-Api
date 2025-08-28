// File: routes/userRoutes.js
// Deskripsi: Routing dasar untuk resource "users"

const express = require('express');
const router = express.Router();
let users = require('../data/users');

// GET  /api/ users => ambil semua user
router.get('/',(req,res) => {
    res.json(users);
});

// GET /api/users/:id → ambil user berdasarkan id
router.get('/:id',(req,res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({message: "User tidak ditemukan"});
    }
    res.json(user);
});

// POST /api/users → tambah user baru
router.post('/',(req,res) => {
    const {name, email} = req.body;
    const newUsers = {
        id: users.length + 1,
        name,
        email,
    };
    users.push(newUsers);
    res.status(201).json(newUsers);
});

// PUT /api/users/:id → update user
router.put('/:id',(req,res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(!user) {
        return res.status(404).json({message: 'User tidak ditemukan'});
    }

    const { name, email } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;

    res.json(user);
});

// DELETE /api/users/:id → hapus user
router.delete('/:id',(req,res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));

    if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // update data users
    users = users.filter(u => u.id !== parseInt(req.params.id));

    res.json({ message: 'User berhasil dihapus'});
});

module.exports = router;