import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // To make API requests
import TradingView from '../components/TradingView';
import '../styles/WatchList.css';

const WatchList2 = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0); // Set to 0 initially, will be fetched
  const [quantity, setQuantity] = useState(1);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [stocks, setStocks] = useState([]); // Store fetched stock data
  const navigate = useNavigate();

  // Fetch userId from localStorage or authentication context
  const userId = localStorage.getItem('userId'); // Assuming userId is stored after login

  // Redirect to login if userId is not available (i.e., user not logged in)
  useEffect(() => {
    if (!userId) {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [userId, navigate]);

  // Fetch stocks from the backend
  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/watchlist2'); // Replace with your backend URL
      setStocks(response.data); // Assuming response.data contains the list of stocks
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  // Fetch user's current balance from the backend
  const fetchBalance = async () => {
    if (!userId) return; // Ensure we don't fetch balance if userId is not available

    try {
      const response = await axios.get(`http://localhost:8080/api/users/balance/${userId}`);
      setCurrentBalance(response.data.balance); // Assuming response.data.balance has the user's balance
      setUpdatedBalance(response.data.balance); // Initially updated balance is the same
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  // Price fluctuation logic (Client-side)
  useEffect(() => {
    fetchStocks();
    fetchBalance();
    const interval = setInterval(() => {
      const updatedPrices = stocks.map((stock) => {
        const fluctuation = Math.random() * 40 - 20; // Random fluctuation
        const newPrice = Math.min(stock.HH, Math.max(stock.LL, stock.price + fluctuation));
        return { ...stock, price: newPrice };
      });
      setStocks(updatedPrices);
    }, 2000);
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [stocks]);

  const handleBuyClick = (option) => {
    const maxQuantity = Math.floor(currentBalance / option.price);
    setSelectedOption(option);
    setQuantity(maxQuantity);
    setInvestedAmount(option.price * maxQuantity);
    setUpdatedBalance(currentBalance - option.price * maxQuantity);
    setShowPopup(true);
  };

  const handleBuy = async () => {
    if (updatedBalance < 0) {
      alert("Insufficient funds for this purchase.");
      return;
    }

    try {
      // 1. Post the buy transaction to the backend
      await axios.post('http://localhost:8080/api/stocks/buy', {
        stockId: selectedOption._id, // Use actual stock ID
        userId: userId,              // User ID
        quantity: quantity,
        investedAmount: investedAmount
      });

      // 2. Update the user's balance in the backend
      await axios.put(`http://localhost:8080/api/users/balance/${userId}`, {
        newBalance: updatedBalance
      });

      // 3. Update balance in state and redirect to PnL page
      setCurrentBalance(updatedBalance);
      setShowPopup(false);
      navigate('/pnl', {
        state: {
          selectedOption,
          quantity,
          investedAmount,
          updatedBalance,
          currentPrice: selectedOption.price
        }
      });
    } catch (error) {
      console.error('Error during the buy transaction:', error);
    }
  };

  return (
    <div className="watchlist-container">
      <div className="sidebar">
        <h2>Forex Exchange Option</h2>
        <div className="options">
          {stocks.length > 0 && stocks.map((option, index) => (
            <div key={index} className="option">
              <span>{option.name}</span>
              <span>₹{option.price.toFixed(2)}</span>
              <button className="buy-btn" onClick={() => handleBuyClick(option)}>Buy</button>
            </div>
          ))}
        </div>
        <div className="balance">
          <span>Balance: ₹{currentBalance.toFixed(2)}</span>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Buy {selectedOption.name}</h3>
            <p>Current Balance: ₹{currentBalance.toFixed(2)}</p>
            <div className="quantity-input">
              <label>Quantity: </label>
              <input type="number" value={quantity} disabled />
              <p>Max Quantity: {quantity}</p>
            </div>
            <p>Invested: ₹{investedAmount.toFixed(2)}</p>
            <p>Updated Balance: ₹{updatedBalance.toFixed(2)}</p>
            <div className="popup-buttons">
              <button className="buy-confirm-btn" onClick={handleBuy}>Confirm Purchase</button>
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="main-content">
        <TradingView />
      </div>
    </div>
  );
};

export default WatchList2;
