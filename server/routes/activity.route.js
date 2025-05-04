const express = require('express');
const router = express.Router();
const { getAllActivities, getActivityById, addActivity, updateActivity, deleteActivity } = require('../controllers/activity.controller');
const { protect, employeeOrAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, employeeOrAdmin, getAllActivities)
    .post(protect, employeeOrAdmin, addActivity);

router.route('/:id')
    .get(protect, employeeOrAdmin, getActivityById)
    .put(protect, employeeOrAdmin, updateActivity)
    .delete(protect, employeeOrAdmin, deleteActivity);

module.exports = router;
