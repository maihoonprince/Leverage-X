import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TradingView from '../components/TradingView';
import '../styles/WatchList.css';

const WatchList = () => {

  const options = [
    { name: 'EUR USD.opt', price: 1000 },
    { name: 'USD JPY.opt', price: 1002 },
    { name: 'GBP USD.opt', price: 1020 },
    { name: 'AUD USD.opt', price: 1020 },
  ];

  return (
    <div className="watchlist-container">
      <div className="sidebar">
        <h2>Forex Exchange Option</h2>
        <div className="options">
          {options.map((option, index) => (
            <div key={index} className="option">
              <span>{option.name}</span>
              <span>₹{option.price.toFixed(2)}</span>
              {/* <button className="buy-btn" onClick={() => handleBuyClick(option)}>Buy</button> */}
            </div>
          ))}
        </div>
        <div className="balance">
          <span>Balance: ₹0.00</span>
        </div>
      </div>

      <div className="main-content">
        <TradingView /> {/* Ensure there's only one TradingView component here */}
      </div>
    </div>
  );
};

export default WatchList;
