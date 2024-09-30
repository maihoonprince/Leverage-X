import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PnL.css';

const PnL = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if state exists in location, otherwise retrieve from localStorage
  const { state } = location;
  const initialState = state || JSON.parse(localStorage.getItem('pnlData')) || {};

  const { watchlistType, selectedOption, quantity, investedAmount, updatedBalance } = initialState;

  const [currentPrice, setCurrentPrice] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(updatedBalance || 0);
  const [isTradeRunning, setIsTradeRunning] = useState(true);
  const userId = localStorage.getItem('userId');

  // Persist data to localStorage when state changes
  useEffect(() => {
    if (state) {
      localStorage.setItem('pnlData', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const fetchStockPrice = async () => {
    try {
      if (watchlistType && selectedOption) {
        const response = await axios.get(`http://localhost:8080/api/stock-price/${watchlistType}/${selectedOption.name}`);
        setCurrentPrice(response.data.price);
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      fetchStockPrice();
      const interval = setInterval(fetchStockPrice, 2000);
      return () => clearInterval(interval);
    }
  }, [watchlistType, selectedOption]);

  const handleSell = async () => {
    try {
      if (selectedOption) {
        const response = await axios.post('http://localhost:8080/api/pnl/sell', {
          userId,
          stockName: selectedOption.name,
          quantity,
          sellPrice: currentPrice,
        });

        if (response.status === 200) {
          setRemainingBalance(response.data.updatedBalance);
          setIsTradeRunning(false); // Trade complete, allow withdrawal
          alert('Stock sold successfully!');
        }
      }
    } catch (error) {
      console.error('Error selling stock:', error);
    }
  };

  const handleWithdraw = async () => {
    if (isTradeRunning) return; // Prevent withdraw if trade is running

    try {
      const response = await axios.post('http://localhost:8080/api/pnl/withdraw', {
        userId,
        amount: remainingBalance,
      });

      if (response.status === 200) {
        alert('Withdraw successful!');
        setRemainingBalance(0); // Set balance to zero after withdrawal
      }
    } catch (error) {
      console.error('Error during withdrawal:', error);
    }
  };

  // If the required data is missing, show loading
  if (!selectedOption) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pnl-container">
      <h2>Profit and Loss (PnL) Page</h2>

      <div className="stock-details">
        <div className="detail-row">
          <span>Stock Name:</span>
          <span>{selectedOption.name}</span>
        </div>
        <div className="detail-row">
          <span>Quantity:</span>
          <span>{quantity}</span>
        </div>
        <div className="detail-row">
          <span>Buy Price:</span>
          <span>₹{selectedOption.price?.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span>Current Price:</span>
          <span>₹{currentPrice?.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span>Invested Amount:</span>
          <span>₹{investedAmount?.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span>Remaining Balance:</span>
          <span>₹{remainingBalance?.toFixed(2)}</span>
        </div>
      </div>

      <div className="actions">
        <button onClick={handleSell} className="sell-btn">Sell</button>
        <button 
          onClick={handleWithdraw} 
          className="withdraw-btn" 
          disabled={isTradeRunning}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default PnL;
