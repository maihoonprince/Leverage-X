const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

// POST: Buy Stock
router.post('/buy', async (req, res) => {
    try {
        const { userId, stockName, buyPrice, quantity } = req.body;
        
        // Find the user
        const user = await UserModel.findById(userId);
        
        // Ensure user has enough balance
        const totalPrice = buyPrice * quantity;
        if (user.balance < totalPrice) {
            return res.status(400).json({ msg: 'Insufficient balance!' });
        }

        // Deduct from balance and add stock to user portfolio
        user.balance -= totalPrice;
        user.stocks.push({ stockName, buyPrice, quantity });
        await user.save();

        res.status(200).json({ msg: 'Stock purchased successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
