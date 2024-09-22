import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import TradingView from '../components/TradingView';
import '../styles/WatchList.css';

const WatchList = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(10000); // User's initial balance
  const [quantity, setQuantity] = useState(1); // Default quantity for purchasing stocks
  const [investedAmount, setInvestedAmount] = useState(0); // Amount invested in the stock
  const [updatedBalance, setUpdatedBalance] = useState(10000); // User's updated balance after purchasing
  const [selectedSymbol, setSelectedSymbol] = useState("BINANCE:BTCUSD"); // Default symbol for chart
  
  const navigate = useNavigate(); // Initialize navigate

  const options = [
    { name: 'Option 1', price: 1000, symbol: 'BINANCE:BTCUSD' }, // Bitcoin
    { name: 'Option 2', price: 1002, symbol: 'BINANCE:SOLUSDT' }, // Solana
    { name: 'Option 3', price: 1020, symbol: 'BINANCE:ETHUSD' }, // Ethereum
  ];

  const handleBuyClick = (option) => {
    const maxQuantity = Math.floor(currentBalance / option.price); // Calculate max quantity the user can buy
    setSelectedOption(option);
    setSelectedSymbol(option.symbol); // Set the selected symbol for the TradingView chart
    setQuantity(maxQuantity); // Set quantity to maximum value the user can afford
    setInvestedAmount(option.price * maxQuantity); // Set invested amount based on price and max quantity
    setUpdatedBalance(currentBalance - option.price * maxQuantity); // Update balance after purchasing
    setShowPopup(true); // Show the purchase popup modal
  };

  const handleBuy = () => {
    if (updatedBalance < 0) {
      alert("Insufficient funds for this purchase.");
    } else {
      setCurrentBalance(updatedBalance); // Deduct the invested amount from current balance
      setShowPopup(false); // Close the popup after purchasing

      // Redirect to PnL page with the required data
      navigate('/pnl', {
        state: {
          selectedOption: selectedOption,
          quantity: quantity,
          investedAmount: investedAmount,
          updatedBalance: updatedBalance,
          currentPrice: selectedOption.price, // Pass the current price
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

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Buy {selectedOption.name}</h3>
            <p>Current Balance: ₹{currentBalance.toFixed(2)}</p>
            <div className="quantity-input">
              <label>Quantity: </label>
              <input
                type="number"
                value={quantity}
                disabled // Disable input so user can't change the quantity
              />
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

      {/* Main content for the chart */}
      <div className="main-content">
        <TradingView symbol={selectedSymbol} />
      </div>
    </div>
  );
};

export default WatchList;
