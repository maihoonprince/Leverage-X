const express = require('express');
const { getUserPnL, sellStock, getStockPrices } = require('../Controllers/pnlController');

const router = express.Router();

// Route to get user's PnL data
router.get('/:userId', getUserPnL);

// Route to sell a stock
router.post('/sell', sellStock);

// Route to fetch real-time stock prices
router.get('/:userId/stock-prices', getStockPrices);

module.exports = router;
