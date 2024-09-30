// routes/userRoutes.js
const express = require('express');
const { getUsers, getUserBalance, updateUserBalance, updateStockPrices, fetchStockPrices, sellStock, getUserStockPrices } = require('../Controllers/userController');
const router = express.Router();


router.get('/', getUsers);
router.get('/balance/:userId', getUserBalance);
router.put('/balance/:userId', updateUserBalance);

// Route to update stock prices
router.post('/stocks/update', updateStockPrices);

// Route to fetch stock prices (for PnL page)
router.get('/stocks/:userId/prices', fetchStockPrices);

// Route to sell stock and remove from database
router.post('/stocks/sell', sellStock);

// Fetch stock prices for both WatchLists
router.get('/:userId/stock-prices', getUserStockPrices);

module.exports = router;