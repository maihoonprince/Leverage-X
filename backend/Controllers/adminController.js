// controllers/adminController.js
const Stock = require('../models/stockModel');
const User = require('../models/userModel');

// Update Stock Price (A/B values)
const updateStockPrice = async (req, res) => {
    const { stockId, newA, newB } = req.body;
    const stock = await Stock.findById(stockId);
    stock.fluctuationRange.A = newA;
    stock.fluctuationRange.B = newB;
    await stock.save();
    res.json({ message: 'Stock price updated', stock });
};

// Update User Balance
const updateUserBalance = async (req, res) => {
    const { userId, newBalance } = req.body;
    const user = await User.findById(userId);
    user.balance = newBalance;
    await user.save();
    res.json({ message: 'User balance updated', user });
};

module.exports = { updateStockPrice, updateUserBalance };