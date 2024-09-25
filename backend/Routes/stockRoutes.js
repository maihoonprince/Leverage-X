// routes/stockRoutes.js
const express = require('express');
const { getStocks, buyStock, updateStockPrice, addStock } = require('../Controllers/stockController');
const router = express.Router();

router.get('/', getStocks);
router.post('/buy', buyStock);
router.put('/:stockId', updateStockPrice);

// Add new route for adding stocks
router.post('/', addStock);

module.exports = router;