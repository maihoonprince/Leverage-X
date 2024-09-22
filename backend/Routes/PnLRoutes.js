// routes/pnl.js
const express = require('express');
const router = express.Router();
const PnL = require('../Models/PnLModel');

// Save or update PnL data for a user
router.post('/save', async (req, res) => {
    const { userId, stocks, totalBalance } = req.body;

    try {
        let pnl = await PnL.findOne({ userId });

        if (pnl) {
            // Update existing PnL data
            pnl.stocks = stocks;
            pnl.totalBalance = totalBalance;
            pnl.timestamp = Date.now();
        } else {
            // Create new PnL entry
            pnl = new PnL({ userId, stocks, totalBalance });
        }

        await pnl.save();
        res.json({ success: true, pnl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get PnL data for a user
router.get('/:userId', async (req, res) => {
    try {
        const pnl = await PnL.findOne({ userId: req.params.userId });

        if (!pnl) {
            return res.status(404).json({ success: false, message: 'No PnL data found' });
        }

        res.json({ success: true, pnl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
