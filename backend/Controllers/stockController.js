const Stock = require('../models/stockModel');
const User = require('../models/User');

const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks' });
  }
};

const buyStock = async (req, res) => {
  const { userId, stockId, price } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= price;
    user.stocks.push(stockId);
    await user.save();

    res.status(200).json({ message: 'Stock purchased successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing stock' });
  }
};

const updateStockPrice = async (req, res) => {
  const { stockId } = req.params;
  const { price } = req.body;

  try {
    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    stock.price = price;
    await stock.save();

    res.status(200).json({ message: 'Stock price updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock price' });
  }
};

const addStock = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
      return res.status(400).json({ message: 'Stock name and price are required.' });
  }

  try {
      const newStock = new Stock({ name, price });
      await newStock.save();
      res.status(201).json(newStock);
  } catch (error) {
      res.status(500).json({ message: 'Error adding stock.', error });
  }
};

module.exports = {
  getStocks,
  buyStock,
  updateStockPrice,
  addStock,
};