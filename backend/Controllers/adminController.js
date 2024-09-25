const User = require('../models/User');
const Stock = require('../models/stockModel');

// Get all users (For admin dashboard)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get all stocks (For admin dashboard)
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stocks' });
  }
};

// Update user balance
exports.updateBalance = async (req, res) => {
  const { userId, newBalance } = req.body;
  try {
    const user = await User.findById(userId);
    user.balance = newBalance;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating balance' });
  }
};

// Update stock price
exports.updateStockPrice = async (req, res) => {
  const { stockId, newPrice } = req.body;
  try {
    const stock = await Stock.findById(stockId);
    stock.price = newPrice;
    await stock.save();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Error updating stock price' });
  }
};
