import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // To make API requests
import TradingView from '../components/TradingView';
import '../styles/WatchList.css';

const WatchList1 = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Currently selected stock
  const [currentBalance, setCurrentBalance] = useState(0); // User's current balance
  const [quantity, setQuantity] = useState(1); // Quantity of stock the user wants to buy
  const [investedAmount, setInvestedAmount] = useState(0); // Total amount invested
  const [updatedBalance, setUpdatedBalance] = useState(0); // Balance after the purchase
  const [stocks, setStocks] = useState([]); // List of stocks
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Fetch userId from localStorage (assuming user is logged in)

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  // Fetch the list of stocks from the backend
  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/watchlist1');
      setStocks(response.data); // Assuming response.data is the array of stocks
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  // Fetch user's current balance from the backend
  const fetchBalance = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8080/api/users/balance/${userId}`);
      setCurrentBalance(response.data.balance); // Assuming the balance is in response.data.balance
      setUpdatedBalance(response.data.balance); // Initially set updated balance to current balance
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  // Fetch stocks and user balance on component mount
  useEffect(() => {
    fetchStocks();
    fetchBalance();
    const interval = setInterval(fetchStocks, 1000); // Fetch updated stock prices every 2 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Handle buy button click - calculate quantity and show the popup
  const handleBuyClick = (option) => {
    const maxQuantity = Math.floor(currentBalance / option.price); // Calculate how much stock the user can afford
    setSelectedOption(option); // Set the selected stock
    setQuantity(maxQuantity); // Set the max quantity the user can buy
    setInvestedAmount(option.price * maxQuantity); // Set the invested amount
    setUpdatedBalance(currentBalance - (option.price * maxQuantity)); // Set updated balance after purchase
    setShowPopup(true); // Show the confirmation popup
  };

  // Handle stock purchase
  const handleBuy = async () => {
    if (updatedBalance < 0) {
      alert("Insufficient funds for this purchase.");
      return;
    }

    try {
      // 1. Send the buy transaction to the backend
      const buyResponse = await axios.post('http://localhost:8080/api/watchlist1/buy', {
        stockName: selectedOption.name,  // Name of the stock
        userId: userId,                  // User ID
        quantity: quantity               // Quantity bought
      });

      // Check if the buy transaction was successful and balance is updated
      if (buyResponse.status === 200) {
        const newBalance = buyResponse.data.updatedBalance;

        // 2. Update local balance and redirect to the PnL page
        setCurrentBalance(newBalance); // Update balance in the UI
        setUpdatedBalance(newBalance);

        setShowPopup(false); // Close the popup

        // 3. Navigate to PnL page with updated details
        navigate('/pnl', {
          state: {
            selectedOption,                // Selected stock details
            quantity,                      // Quantity bought
            investedAmount,                // Amount invested
            updatedBalance: newBalance,    // Updated balance
            currentPrice: selectedOption.price // Current stock price
          }
        });
      } else {
        alert('Error purchasing stock. Please try again.');
      }
    } catch (error) {
      console.error('Error during the buy transaction:', error);
    }
  };


  return (
    <div className="watchlist-container">
      <div className="sidebar">
        <h2>Forex Exchange Options</h2>
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

export default WatchList1;
