import React from 'react';
import "../styles/PnL.css";

const PnL = ({ selectedOption, currentPrice, quantity, investedAmount, updatedBalance, handleSell }) => {
  return (
    <div className="pnl-container">
      <h1>Profit & Loss</h1>
      
      <div className="pnl-option-card">
        {/* Check if selectedOption exists before trying to access its name */}
        <h3>{selectedOption ? selectedOption.name : 'No stock selected'}</h3>
        <p>Current Price: ₹{currentPrice ? currentPrice.toFixed(2) : 'N/A'}</p>
        <p>Quantity: {quantity !== undefined ? quantity : 'N/A'}</p>
        <p>Invested: ₹{investedAmount ? investedAmount.toFixed(2) : 'N/A'}</p>

        {/* Sell Button */}
        <button className="sell-btn" onClick={handleSell} disabled={!selectedOption}>
          Sell
        </button>
      </div>
      
      <div className="total-balance">
        <h3>Total Balance: ₹{updatedBalance ? updatedBalance.toFixed(2) : 'N/A'}</h3>
      </div>
    </div>
  );
};

export default PnL;
