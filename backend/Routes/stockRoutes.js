// routes/stockRoutes.js
const express = require('express');
const { buyStock, sellStock, getStocks } = require('../controllers/stockController');
const router = express.Router();

router.get('/', getStocks);
router.post('/buy', buyStock);
router.post('/sell', sellStock);

module.exports = router;