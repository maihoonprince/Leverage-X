import React, { useState } from 'react';
import TradingViewWidget from '../components/TradingView';
import '../styles/WatchList.css';

const WatchList = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(10000); // User's initial balance
  const [quantity, setQuantity] = useState(1); // Default quantity for purchasing stocks
  const [investedAmount, setInvestedAmount] = useState(0); // Amount invested in the stock
  const [updatedBalance, setUpdatedBalance] = useState(10000); // User's updated balance after purchasing
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL"); // Default symbol for chart

  const options = [
    { name: 'Option 1', price: 1000, symbol: 'NASDAQ:AAPL' }, // Apple stock
    { name: 'Option 2', price: 1002, symbol: 'BINANCE:BTCUSD' }, // Bitcoin
    { name: 'Option 3', price: 1020, symbol: 'BINANCE:ETHUSD' }, // Ethereum
  ];

  const handleBuyClick = (option) => {
    setSelectedOption(option);
    setSelectedSymbol(option.symbol); // Set the selected symbol for the TradingView chart
    setQuantity(1); // Default quantity to 1 when a stock is selected
    setInvestedAmount(option.price); // Set invested amount based on price and quantity
    setUpdatedBalance(currentBalance - option.price); // Update balance after purchasing
    setShowPopup(true); // Show the purchase popup modal
  };

  const handleQuantityChange = (e) => {
    const qty = Number(e.target.value);
    setQuantity(qty);
    setInvestedAmount(selectedOption.price * qty); // Update invested amount when quantity changes
    setUpdatedBalance(currentBalance - selectedOption.price * qty); // Update balance based on quantity
  };

  const handleBuy = () => {
    if (updatedBalance < 0) {
      alert("Insufficient funds for this purchase.");
    } else {
      setCurrentBalance(updatedBalance); // Deduct the invested amount from current balance
      setShowPopup(false); // Close the popup after purchasing
    }
  };

  const handleSell = () => {
    const sellAmount = selectedOption.price * quantity;
    setCurrentBalance(currentBalance + sellAmount); // Add the sale amount back to current balance
    alert(`Sold ${quantity} of ${selectedOption.name} for ₹${sellAmount.toFixed(2)}`);
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
                min="1"
                max={Math.floor(currentBalance / selectedOption.price)}
                onChange={handleQuantityChange}
              />
              <p>Max: {Math.floor(currentBalance / selectedOption.price)}</p>
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
        <TradingViewWidget symbol={selectedSymbol} />
      </div>

      {/* PnL Section */}
      {/* {selectedOption && (
        <div className="pnl-section">
          <h3>Profit & Loss</h3>
          <p>Selected Stock: {selectedOption.name}</p>
          <p>Invested: ₹{investedAmount.toFixed(2)}</p>
          <p>Quantity: {quantity}</p>
          <p>Current Price: ₹{selectedOption.price.toFixed(2)}</p>
          <p>Total Balance: ₹{currentBalance.toFixed(2)}</p>
          <button className="sell-btn" onClick={handleSell}>Sell Stock</button>
        </div>
      )} */}
    </div>
  );
};

export default WatchList;
