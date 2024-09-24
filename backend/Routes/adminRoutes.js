// routes/adminRoutes.js
const express = require('express');
const { updateStockPrice, updateUserBalance } = require('../controllers/adminController');
const router = express.Router();

router.post('/update-stock', updateStockPrice);
router.post('/update-user-balance', updateUserBalance);

module.exports = router;