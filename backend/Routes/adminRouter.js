const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const StockModel = require('../models/StockModel');

// POST: Update Stock Prices
router.post('/update-stock', async (req, res) => {
    const { stockName, hh, ll } = req.body;

    try {
        const stock = await StockModel.findOneAndUpdate(
            { stockName },
            { hh, ll },
            { new: true, upsert: true }
        );
        res.status(200).json(stock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST: Update User Balance
router.post('/update-balance', async (req, res) => {
    const { userId, newBalance } = req.body;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.balance = newBalance;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
