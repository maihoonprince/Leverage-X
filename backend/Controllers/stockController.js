// controllers/stockController.js
const Stock = require('../models/stockModel');
const User = require('../models/userModel');

// Get all stocks
const getStocks = async (req, res) => {
    const stocks = await Stock.find({});
    res.json(stocks);
};

// Buy Stock
const buyStock = async (req, res) => {
    const { stockId, quantity, price } = req.body;
    const user = await User.findById(req.user.id);
    const stock = await Stock.findById(stockId);
    
    const totalCost = quantity * stock.currentPrice;
    if (user.balance < totalCost) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.stocks.push({ stockId, quantity, buyPrice: stock.currentPrice });
    user.balance -= totalCost;
    await user.save();

    res.json({ message: 'Stock bought successfully', user });
};

// Sell Stock
const sellStock = async (req, res) => {
    const { stockId } = req.body;
    const user = await User.findById(req.user.id);
    const stock = user.stocks.find(s => s.stockId.equals(stockId));
    const stockPrice = await Stock.findById(stockId).currentPrice;

    user.balance += stock.quantity * stockPrice;
    user.stocks = user.stocks.filter(s => !s.stockId.equals(stockId));
    await user.save();

    res.json({ message: 'Stock sold successfully', user });
};

module.exports = { getStocks, buyStock, sellStock };