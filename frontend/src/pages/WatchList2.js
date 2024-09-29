import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import TradingView from '../components/TradingView';
import '../styles/WatchList.css';

const WatchList2 = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/watchlist2');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchBalance = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8080/api/users/balance/${userId}`);
      setCurrentBalance(response.data.balance);
      setUpdatedBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchBalance();
    const interval = setInterval(() => {
      fetchStocks(); // Fetch new prices every few seconds
    }, 2000);
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
      await axios.post('http://localhost:8080/api/watchlist2/buy', {
        stockName: selectedOption.name,
        userId: userId,
        quantity: quantity,
        investedAmount: investedAmount
      });

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

      <div className="trading-view">
        <TradingView />
      </div>
    </div>
  );
};

export default WatchList2;
