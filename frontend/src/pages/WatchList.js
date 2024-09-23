import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TradingView from '../components/TradingView';
import '../styles/WatchList.css';

const WatchList = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [quantity, setQuantity] = useState(1);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(10000);
  
  const navigate = useNavigate();

  const options = [
    { name: 'Option 1', price: 1000 },
    { name: 'Option 2', price: 1002 },
    { name: 'Option 3', price: 1020 },
  ];

  const handleBuyClick = (option) => {
    const maxQuantity = Math.floor(currentBalance / option.price);
    setSelectedOption(option);
    setQuantity(maxQuantity);
    setInvestedAmount(option.price * maxQuantity);
    setUpdatedBalance(currentBalance - option.price * maxQuantity);
    setShowPopup(true);
  };

  const handleBuy = () => {
    if (updatedBalance < 0) {
      alert("Insufficient funds for this purchase.");
    } else {
      setCurrentBalance(updatedBalance);
      setShowPopup(false);
      navigate('/pnl', {
        state: {
          selectedOption,
          quantity,
          investedAmount,
          updatedBalance,
          currentPrice: selectedOption.price,
        }
      });
    }
  };

  return (
    <div className="watchlist-container">
      <div className="sidebar">
        <h2>UpperCircuit</h2>
        <div className="options">
          {options.map((option, index) => (
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
        <TradingView /> {/* Ensure there's only one TradingView component here */}
      </div>
    </div>
  );
};

export default WatchList;
