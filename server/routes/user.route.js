const express = require('express');
const router = express.Router();
const { registerUser, authUser,getUser } = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get("/me",getUser)

module.exports = router;
