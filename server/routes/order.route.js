const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, addOrder, updateOrder, deleteOrder } = require('../controllers/order.controller');
const { protect, admin, employeeOrAdmin } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, admin, getAllOrders)
    .post(protect, employeeOrAdmin, addOrder);

router.route('/:id')
    .get(protect, employeeOrAdmin, getOrderById)
    .put(protect, employeeOrAdmin, updateOrder)
    .delete(protect, admin, deleteOrder);

module.exports = router;
