// controllers/pnlController.js
const User = require('../models/User');
const Watchlist1 = require('../models/watchList1Model');
const Watchlist2 = require('../models/watchList2Model');

// Fetch the user's purchased stock data
exports.getPnLData = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.stocks); // Assuming 'stocks' field holds purchased stocks
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch stock price based on watchlistType
exports.getStockPrice = async (req, res) => {
  const { watchlistType, stockName } = req.params;
  try {
    let stock;
    if (watchlistType === '1') {
      stock = await Watchlist1.findOne({ name: stockName });
    } else if (watchlistType === '2') {
      stock = await Watchlist2.findOne({ name: stockName });
    }

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json({ price: stock.price });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Sell a stock and update the user's balance
exports.sellStock = async (req, res) => {
  const { userId, stockName, quantity, sellPrice } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the stock in the user's stocks list
    const stockIndex = user.stocks.findIndex(stock => stock.name === stockName);
    if (stockIndex === -1) {
      return res.status(404).json({ message: 'Stock not found in user portfolio' });
    }

    // Update stock data
    const stock = user.stocks[stockIndex];
    const investedBalance = stock.quantity * stock.buyPrice;
    const profitLoss = (sellPrice - stock.buyPrice) * quantity;
    const updatedBalance = user.balance + profitLoss;

    // Remove stock after selling
    user.stocks.splice(stockIndex, 1);
    user.balance = updatedBalance;

    // Save updated user data
    await user.save();

    res.json({ updatedBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error selling stock', error });
  }
};

// Withdraw user's balance
exports.withdraw = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Withdraw the balance
    user.balance -= amount;
    await user.save();

    res.json({ message: 'Withdrawal successful', remainingBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error during withdrawal', error });
  }
};
