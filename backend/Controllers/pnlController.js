// pnlController.js
const User = require('../models/User');

// Fetch User PnL Data (stocks, balance, etc.)
const getUserPnL = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await User.findById(userId).select('balance stocks');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
};

// Sell Stock
const sellStock = async (req, res) => {
    const { userId, stockName } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the stock in the user's stocks array
        const stock = user.stocks.find(s => s.stockName === stockName);
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        // Calculate the amount to be added to user's balance
        const sellAmount = stock.currentPrice * stock.quantity;
        user.balance += sellAmount;

        // Remove the stock from user's portfolio
        user.stocks = user.stocks.filter(s => s.stockName !== stockName);

        await user.save();

        res.status(200).json({ message: 'Stock sold successfully', newBalance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Error selling stock', error });
    }
};

module.exports = {
    getUserPnL,
    sellStock
};
