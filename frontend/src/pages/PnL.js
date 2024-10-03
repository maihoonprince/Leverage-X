import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PnL.css';

const PnL = () => {
  const [stocks, setStocks] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [updatedStocks, setUpdatedStocks] = useState([]);
  const [withdrawalBalance, setWithdrawalBalance] = useState(null); // State for withdrawal balance
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

  // Fetch real-time prices from the watchlist (1 or 2)
  const fetchRealTimePrices = async () => {
    try {
      const storedWatchlistType = localStorage.getItem('watchlistType');
      const watchlistType = storedWatchlistType || location.state?.watchlistType || '1'; // Default to WatchList1 if none is found
      const response = await axios.get(`http://localhost:8080/api/watchlist${watchlistType}`);
      setUpdatedStocks(response.data);
    } catch (error) {
      console.error('Error fetching real-time prices:', error);
    }
  };

  const calculateProfitLoss = (buyPrice, currentPrice, quantity) => {
    return (currentPrice - buyPrice) * quantity;
  };

  const handleSell = async (stockName, quantity, autoSell = false) => {
    try {
      const watchlistType = location.state?.watchlistType || localStorage.getItem('watchlistType') || '1';
      const response = await axios.post('http://localhost:8080/api/users/sell', {
        userId,
        stockName,
        quantity,
        watchlistType,
        autoSell, // Pass the auto-sell flag
      });
  
      if (response.status === 200) {
        setUserBalance(response.data.updatedBalance);
        if (response.data.updatedBalance === 0) {
          alert("Your balance has dropped below 90% of your plan's cost. Setting balance to ₹0.");
        }
        fetchUserStocks();
      }
    } catch (error) {
      console.error('Error selling stock:', error.message || error);
    }
  };

  const autoSellIfNeeded = (stock, currentPrice) => {
    if (stock.quantity === 0) return;

    const profitLoss = calculateProfitLoss(stock.buyPrice, currentPrice, stock.quantity);
    const threshold = 0.1 * ((stock.quantity * stock.buyPrice) + userBalance); // 10% of (quantity * stock buy price + current balance)
    
    if (profitLoss <= -threshold) {
      if (stock.isBeingSold) return;
      stock.isBeingSold = true;
  
      handleSell(stock.stockName, stock.quantity, true)
        .then(() => setUserBalance(0))
        .catch((error) => console.error('Auto-sell error:', error.message || error))
        .finally(() => stock.isBeingSold = false);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/withdraw', { userId });
      if (response.status === 200) {
        setWithdrawalBalance(response.data.withdrawalBalance);
        setUserBalance(0); // Set user balance to zero after withdrawal
        alert(`Withdrawal successful! Your withdrawal balance is ₹${response.data.withdrawalBalance}`);
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error.message || error);
    }
  };

  useEffect(() => {
    fetchUserStocks();
    fetchRealTimePrices();
    const interval = setInterval(() => fetchRealTimePrices(), 1000); // Update prices every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pnl-container">
      <h2>Your Portfolio</h2>
      <div className="portfolio">
        {stocks.map((stock, index) => {
          const currentStock = updatedStocks.find((s) => s.name === stock.stockName);
          const currentPrice = currentStock ? currentStock.price : stock.buyPrice;
          const profitLoss = calculateProfitLoss(stock.buyPrice, currentPrice, stock.quantity);

          autoSellIfNeeded(stock, currentPrice);

          return (
            <div key={index} className="stock-item">
              <span>{stock.stockName}</span>
              <span>Quantity: {stock.quantity}</span>
              <span>Buy Price: ₹{stock.buyPrice.toFixed(2)}</span>
              <span>Current Price: ₹{currentPrice.toFixed(2)}</span>
              <span>Invested Amount: ₹{stock.investedAmount.toFixed(2)}</span>
              <span className={profitLoss >= 0 ? 'profit' : 'loss'}>
                Profit/Loss: ₹{profitLoss.toFixed(2)}
              </span>
              <button onClick={() => handleSell(stock.stockName, stock.quantity)} className="sell-btn">
                Sell
              </button>
            </div>
          );
        })}
      </div>
      <div className="balance-section">
        <h3>Current Balance: ₹{userBalance.toFixed(2)}</h3>
        {withdrawalBalance !== null && (
          <h4>Withdrawal Amount: ₹{withdrawalBalance.toFixed(2)}</h4>
        )}
        <button onClick={handleWithdrawal} className="withdraw-btn">
          Withdraw Balance
        </button>
      </div>
    </div>
  );
};

export default PnL;
