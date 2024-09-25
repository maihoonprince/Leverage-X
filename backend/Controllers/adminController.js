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
  const { userId, balance } = req.body;

  // Validate request body
  if (!userId || balance === undefined) {
    return res.status(400).json({ error: 'User ID and balance are required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.balance = balance;
    await user.save();

    res.json({ message: 'User balance updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user balance' });
  }
};

// Update stock price
exports.updateStockPrice = async (req, res) => {
  const { stockId, price } = req.body;

  // Validate request body
  if (!stockId || price === undefined) {
    return res.status(400).json({ error: 'Stock ID and price are required' });
  }

  try {
    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    stock.price = price;
    await stock.save();

    res.json({ message: 'Stock price updated successfully', stock });
  } catch (error) {
    res.status(500).json({ error: 'Error updating stock price' });
  }
};

// Create a new stock
exports.createStock = async (req, res) => {
  const { name, currentPrice, fluctuationRange } = req.body;
  try {
    const newStock = new Stock({
      name,
      currentPrice,
      fluctuationRange
    });
    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(500).json({ error: 'Error creating new stock' });
  }
};
