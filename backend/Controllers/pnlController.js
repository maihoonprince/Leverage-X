const User = require('../models/User');
const Watchlist1 = require('../models/watchList1Model');
const Watchlist2 = require('../models/watchList2Model');

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

        // Normalize stock name for consistency
        const normalizedStockName = stockName.trim().toLowerCase();

        // Find the stock in the user's stocks array
        const stock = user.stocks.find(s => s.stockName.trim().toLowerCase() === normalizedStockName);
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        // Calculate the amount to be added to user's balance
        const sellAmount = stock.currentPrice * stock.quantity;
        user.balance += sellAmount;

        // Remove the stock from user's portfolio
        user.stocks = user.stocks.filter(s => s.stockName.trim().toLowerCase() !== normalizedStockName);

        await user.save();

        res.status(200).json({ message: 'Stock sold successfully', newBalance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Error selling stock', error });
    }
};

// Fetch Stock Prices from Watchlists
const getStockPrices = async (req, res) => {
    try {
        // Fetch prices from both watchlists
        const watchList1Prices = await Watchlist1.find({}).select('stockName price');
        const watchList2Prices = await Watchlist2.find({}).select('stockName price');

        // Normalize stock names for consistency in the response
        const normalizedWatchList1Prices = watchList1Prices.reduce((acc, stock) => {
            const normalizedStockName = stock.stockName.trim().toLowerCase();
            acc[normalizedStockName] = stock.price;
            return acc;
        }, {});

        const normalizedWatchList2Prices = watchList2Prices.reduce((acc, stock) => {
            const normalizedStockName = stock.stockName.trim().toLowerCase();
            acc[normalizedStockName] = stock.price;
            return acc;
        }, {});

        res.status(200).json({
            watchList1Prices: normalizedWatchList1Prices,
            watchList2Prices: normalizedWatchList2Prices
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock prices', error });
    }
};

module.exports = {
    getUserPnL,
    sellStock,
    getStockPrices
};
