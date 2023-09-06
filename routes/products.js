const express = require('express');
const router = express.Router();
const path = require('path');
const ProductManager = require('../ProductManager');


const productosFilePath = path.join(__dirname, '../productos.json');

const productManager = new ProductManager(productosFilePath);

//////
router.get('/', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
    } else {
        res.json(products);
    }
});

///////
router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

////
router.post('/', (req, res) => {
    const productData = req.body;
    try {
        const newProduct = productManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/////
router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    try {
        const updatedProduct = productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const deletedProduct = productManager.deleteProduct(productId);
        res.json(deletedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
