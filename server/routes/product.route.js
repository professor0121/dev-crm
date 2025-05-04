const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllProducts)
    .post(protect, admin, addProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
