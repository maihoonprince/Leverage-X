// routes/stockRoutes.js
const express = require('express');
const { getStocks, buyStock, updateStockPrice } = require('../Controllers/stockController');
const router = express.Router();

router.get('/', getStocks);
router.post('/buy', buyStock);
router.put('/:stockId', updateStockPrice);

module.exports = router;