const express = require('express');
const router = express.Router();
let products = require('../data/products');

// GET  /api/ products => ambil semua product
router.get('/',(req,res) => {
    res.json(products);
});

// GET /api/products/:id → ambil product berdasarkan id
router.get('/:id',(req,res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if(!product) {
        return res.status(404).json({message : 'Product tidak ditemukan'})
    }
    res.json(product);
});

// POST /api/products => tambah product baru
router.post('/',(req,res) => {
    const {name, price} = req.body;
    const newProduct = {
        id: products.length + 1,
        name,
        price,
    };
    products.push(newProduct)
    res.status(201).json(newProduct);
});

// PUT /api/products/:id → update product
router.put('/:id',(req,res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if(!product) {
        return res.status(404).json({message : 'Product tidak ditemukan'})
    };
    const {name, price} = req.body;
    product.name = name || product.name;
    product.price = price || product.price;
    res.json(product);
});

// DELETE /api/products/:id → hapus product
router.delete('/:id',(req,res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.json({message : 'Product berhasil dihapus'});
});

module.exports = router;
