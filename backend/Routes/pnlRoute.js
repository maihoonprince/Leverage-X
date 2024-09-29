// pnlRoutes.js
const express = require('express');
const { getUserPnL, sellStock } = require('../Controllers/pnlController');

const router = express.Router();

// Route to get user's PnL data
router.get('/:userId', getUserPnL);

// Route to sell a stock
router.post('/sell', sellStock);

module.exports = router;
