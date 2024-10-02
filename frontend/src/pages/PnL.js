import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PnL.css';

const PnL = () => {
  const [stocks, setStocks] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [updatedStocks, setUpdatedStocks] = useState([]);
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const fetchUserStocks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/stocks/${userId}`);
      setStocks(response.data.stocks);
      setUserBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching user stocks:', error);
    }
  };

  // Fetch real-time price from the watchlist (1 or 2)
  // Modify your fetchRealTimePrices function in PnL.js
  const fetchRealTimePrices = async () => {
    try {
      // First, try to get watchlistType from localStorage
      const storedWatchlistType = localStorage.getItem('watchlistType');
      const watchlistType = storedWatchlistType || location.state?.watchlistType || '1'; // Default to WatchList1 if none is found
  
      const response = await axios.get(`http://localhost:8080/api/watchlist${watchlistType}`);
      setUpdatedStocks(response.data); // Ensure the response data contains the updated prices
    } catch (error) {
      console.error('Error fetching real-time prices:', error);
    }
  };
  

  // Effect to fetch user stocks and real-time prices
  useEffect(() => {
    fetchUserStocks();
    fetchRealTimePrices();
    const interval = setInterval(() => {
      fetchRealTimePrices(); // Update prices every second
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateProfitLoss = (buyPrice, currentPrice, quantity) => {
    return (currentPrice - buyPrice) * quantity;
  };

  const handleSell = async (stockName, quantity) => {
    try {
      const watchlistType = location.state?.watchlistType || localStorage.getItem('watchlistType') || '1'; // Ensure correct watchlistType
      console.log({ userId, stockName, quantity, watchlistType }); // Check data being sent
      
      const response = await axios.post('http://localhost:8080/api/users/sell', {
        userId,
        stockName,
        quantity,
        watchlistType, // Pass this to the backend
      });
  
      if (response.status === 200) {
        // Update user balance and refresh stocks
        setUserBalance(response.data.updatedBalance);
        fetchUserStocks(); // Refresh user stocks after selling
      }
    } catch (error) {
      console.error('Error selling stock:', error);
    }
  };
  
  

  return (
    <div className="pnl-container">
      <h2>Your Portfolio</h2>
      <div className="portfolio">
        {stocks.map((stock, index) => {
          // Find the current price from the updatedStocks array
          const currentStock = updatedStocks.find((s) => s.name === stock.stockName);
          const currentPrice = currentStock ? currentStock.price : stock.buyPrice; // Use buy price if current price is not available
          const profitLoss = calculateProfitLoss(stock.buyPrice, currentPrice, stock.quantity);

          return (
            <div key={index} className="stock-item">
              <span>{stock.stockName}</span>
              <span>Quantity: {stock.quantity}</span>
              <span>Buy Price: ₹{stock.buyPrice.toFixed(2)}</span>
              <span>Current Price: ₹{currentPrice.toFixed(2)}</span>
              <span>Invested Amount: ₹{stock.investedAmount.toFixed(2)}</span>
              <span
                className={profitLoss >= 0 ? 'profit' : 'loss'}
              >
                Profit/Loss: ₹{profitLoss.toFixed(2)}
              </span>
              <button
                onClick={() => handleSell(stock.stockName, stock.quantity)}
                className="sell-btn"
              >
                Sell
              </button>
            </div>
          );
        })}
      </div>
      <div className="balance-section">
        <h3>Current Balance: ₹{userBalance.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default PnL;
