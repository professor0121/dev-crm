const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');
const { protect, admin, employeeOrAdmin } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, admin, getAllCustomers)
    .post(protect, employeeOrAdmin, addCustomer);

router.route('/:id')
    .get(protect, employeeOrAdmin, getCustomerById)
    .put(protect, employeeOrAdmin, updateCustomer)
    .delete(protect, admin, deleteCustomer);

module.exports = router;
