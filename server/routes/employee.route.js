const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee.controller');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllEmployees)
    .post(protect, admin, addEmployee);

router.route('/:id')
    .get(protect, admin, getEmployeeById)
    .put(protect, admin, updateEmployee)
    .delete(protect, admin, deleteEmployee);

module.exports = router;
