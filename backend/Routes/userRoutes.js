// routes/userRoutes.js
const express = require('express');
const { getUsers, getUserBalance, updateUserBalance } = require('../Controllers/userController');
const router = express.Router();

router.get('/', getUsers);
router.get('/balance/:userId', getUserBalance);
router.put('/balance/:userId', updateUserBalance);

module.exports = router;