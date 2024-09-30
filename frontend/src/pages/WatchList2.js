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
      console.error('Error fetching WatchList2 stocks:', error);
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
      fetchStocks(); // Fetch updated WatchList2 stock prices
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleBuyClick = (option) => {
    const maxQuantity = Math.floor(currentBalance / option.price);
    setSelectedOption(option);
    setQuantity(maxQuantity);
    setInvestedAmount(option.price * maxQuantity);
    setUpdatedBalance(currentBalance - (option.price * maxQuantity));
    setShowPopup(true);
  };

  const handleBuy = async () => {
    if (updatedBalance < 0) {
      alert("Insufficient funds for this purchase.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/watchlist2/buy', {
        stockName: selectedOption.name,
        userId: userId,
        quantity: quantity
      });

      if (response.status === 200) {
        setCurrentBalance(response.data.updatedBalance);
        setUpdatedBalance(response.data.updatedBalance);
        setShowPopup(false);
        navigate('/pnl', {
          state: {
            watchlistType: '2',  // Flag for WatchList2
            selectedOption,
            quantity,
            investedAmount,
            updatedBalance: response.data.updatedBalance,
            currentPrice: selectedOption.price
          }
        });
      } else {
        alert('Error purchasing stock.');
      }
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  };

  return (
    <div className="watchlist-container">
      <div className="sidebar">
        <h2>Forex Exchange Options</h2>
        <div className="options">
          {stocks.map((option, index) => (
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
            <p>Quantity: {quantity}</p>
            <p>Invested: ₹{investedAmount.toFixed(2)}</p>
            <p>Updated Balance: ₹{updatedBalance.toFixed(2)}</p>
            <button onClick={handleBuy}>Confirm Purchase</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
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
