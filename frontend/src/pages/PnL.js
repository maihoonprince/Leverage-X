import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PnL.css';

const PnL = () => {
  const [stocks, setStocks] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [updatedStocks, setUpdatedStocks] = useState([]);
  const [withdrawalBalance, setWithdrawalBalance] = useState(null); // State for withdrawal balance
  const [showWithdrawalPopup, setShowWithdrawalPopup] = useState(false); // State for popup visibility
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    accountHolderName: '',
    accountNo: '',
    ifscCode: '',
    panCardNo: '',
    upiId: '',
    withdrawalId: ''
  }); // State for withdrawal form details
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const fetchUserStocks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/stocks/${userId}`);
      setStocks(response.data.stocks);
      setUserBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching user stocks:', error);
    }
  };

  const fetchRealTimePrices = async () => {
    try {
      const storedWatchlistType = localStorage.getItem('watchlistType');
      const watchlistType = storedWatchlistType || location.state?.watchlistType || '1';
      const response = await axios.get(`http://localhost:8080/api/watchlist${watchlistType}`);
      setUpdatedStocks(response.data);
    } catch (error) {
      console.error('Error fetching real-time prices:', error);
    }
  };

  const calculateProfitLoss = (buyPrice, currentPrice, quantity) => {
    return (currentPrice - buyPrice) * quantity;
  };

  const handleSell = async (stockName, quantity, autoSell = false) => {
    try {
      const watchlistType = location.state?.watchlistType || localStorage.getItem('watchlistType') || '1';
      const response = await axios.post('http://localhost:8080/api/users/sell', {
        userId,
        stockName,
        quantity,
        watchlistType,
        autoSell,
      });

      if (response.status === 200) {
        setUserBalance(response.data.updatedBalance);
        fetchUserStocks();
      }
    } catch (error) {
      console.error('Error selling stock:', error.message || error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      // Calculate withdrawal balance before showing the popup
      const response = await axios.post('http://localhost:8080/api/users/withdraw', {
        userId,
        ...withdrawalDetails // Include withdrawal details in the request
      });
      if (response.status === 200) {
        setWithdrawalBalance(response.data.withdrawalBalance);
        setShowWithdrawalPopup(true); // Show the popup after calculating balance
      }
    } catch (error) {
      console.error('Error calculating withdrawal balance:', error.message || error);
    }
  };

  const handleSubmitWithdrawal = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/withdraw', {
        userId,
        ...withdrawalDetails // Include withdrawal details in the request
      });
      if (response.status === 200) {
        setUserBalance(0); // Reset balance after withdrawal
        alert(`Withdrawal successful! Your withdrawal balance is ₹${response.data.withdrawalBalance}`);
        setShowWithdrawalPopup(false); // Close the popup after submission
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error.message || error);
    }
  };

  const handleCancelWithdrawal = () => {
    setShowWithdrawalPopup(false); // Close the popup on cancel
  };

  const handleInputChange = (e) => {
    setWithdrawalDetails({ ...withdrawalDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchUserStocks();
    fetchRealTimePrices();
    const interval = setInterval(() => fetchRealTimePrices(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pnl-container">
      <h2>Your Portfolio</h2>
      <div className="portfolio">
        {stocks.map((stock, index) => {
          const currentStock = updatedStocks.find((s) => s.name === stock.stockName);
          const currentPrice = currentStock ? currentStock.price : stock.buyPrice;
          const profitLoss = calculateProfitLoss(stock.buyPrice, currentPrice, stock.quantity);

          return (
            <div key={index} className="stock-item">
              <span>{stock.stockName}</span>
              <span>Quantity: {stock.quantity}</span>
              <span>Buy Price: ₹{stock.buyPrice.toFixed(2)}</span>
              <span>Current Price: ₹{currentPrice.toFixed(2)}</span>
              <span>Invested Amount: ₹{stock.investedAmount.toFixed(2)}</span>
              <span className={profitLoss >= 0 ? 'profit' : 'loss'}>
                Profit/Loss: ₹{profitLoss.toFixed(2)}
              </span>
              <button onClick={() => handleSell(stock.stockName, stock.quantity)} className="sell-btn">
                Sell
              </button>
            </div>
          );
        })}
      </div>
      <div className="balance-section">
        <h3>Current Balance: ₹{userBalance.toFixed(2)}</h3>
        {withdrawalBalance !== null && (
          <h4>Withdrawal Amount: ₹{withdrawalBalance.toFixed(2)}</h4>
        )}
        
        <button onClick={handleWithdrawal} className="withdraw-btn">
          Withdraw Balance
        </button>
      </div>

      {showWithdrawalPopup && (
        <div className="overlay">
          <div className="popup">
            <h3>Withdrawal Details</h3>
            {/* Display the calculated withdrawal balance */}
            <h4>Withdrawal Amount: ₹{withdrawalBalance ? withdrawalBalance.toFixed(2) : 'Calculating...'}</h4>

            <input
              type="text"
              name="accountHolderName"
              placeholder="Account Holder Name"
              value={withdrawalDetails.accountHolderName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="accountNo"
              placeholder="Account No."
              value={withdrawalDetails.accountNo}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="ifscCode"
              placeholder="IFSC Code"
              value={withdrawalDetails.ifscCode}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="panCardNo"
              placeholder="Pan Card No."
              value={withdrawalDetails.panCardNo}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="upiId"
              placeholder="UPI ID"
              value={withdrawalDetails.upiId}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="withdrawalId"
              placeholder="Withdrawal ID"
              value={withdrawalDetails.withdrawalId}
              onChange={handleInputChange}
            />
            <div className="popup-buttons">
              <button onClick={handleSubmitWithdrawal}>Submit</button>
              <button onClick={handleCancelWithdrawal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div> 
  );
};

export default PnL;
