import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../styles/PnL.css";
import { savePnLDataToBackend, loadPnLDataFromBackend } from '../services/pnlService'; // Import the service

const PnL = ({ currentUser }) => {
  const location = useLocation();
  const { selectedOption, currentPrice, quantity, investedAmount, updatedBalance } = location.state || {}; // Access passed state

  // State to hold PnL data and total balance
  const [pnl, setPnL] = useState({
    stocks: [],
    totalBalance: updatedBalance || 0
  });
  const [loading, setLoading] = useState(false); // To manage the loading state during stock selling
  const [error, setError] = useState(null); // To handle errors

  // Load PnL data from the backend when the component mounts
  useEffect(() => {
    const fetchPnLData = async () => {
      if (currentUser && currentUser._id) {
        try {
          const pnlData = await loadPnLDataFromBackend(currentUser._id);
          if (pnlData) {
            setPnL(pnlData);
          }
        } catch (err) {
          console.error('Error loading PnL data', err);
          setError('Failed to load PnL data.');
        }
      }
    };
    fetchPnLData();
  }, [currentUser]);

  // Handle selling stock (updating the PnL data)
  const handleSellStock = async () => {
    if (!selectedOption || !quantity) {
      setError('No stock selected or quantity is invalid.');
      return;
    }

    setLoading(true);
    setError(null);

    const soldStock = {
      name: selectedOption.name,
      currentPrice: currentPrice,
      quantity: quantity,
      investedAmount: investedAmount,
    };

    const updatedStocks = [...pnl.stocks, soldStock];
    const updatedTotalBalance = calculateNewBalance(updatedStocks);

    const updatedPnL = {
      stocks: updatedStocks,
      totalBalance: updatedTotalBalance
    };

    setPnL(updatedPnL);

    try {
      await savePnLDataToBackend({
        userId: currentUser._id,
        stocks: updatedStocks,
        totalBalance: updatedTotalBalance
      });
    } catch (err) {
      console.error('Error saving PnL data', err);
      setError('Failed to update PnL data.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the new total balance after buying/selling
  const calculateNewBalance = (stocks) => {
    return stocks.reduce((acc, stock) => acc + (stock.quantity * stock.currentPrice), 0);
  };

  return (
    <div className="pnl-container">
      <h1>Profit & Loss</h1>

      {error && <p className="error">{error}</p>} {/* Display error messages */}

      <div className="pnl-option-card">
        <h3>{selectedOption ? selectedOption.name : 'No stock selected'}</h3>
        <p>Current Price: ₹{currentPrice ? currentPrice.toFixed(2) : 'N/A'}</p>
        <p>Quantity: {quantity !== undefined ? quantity : 'N/A'}</p>
        <p>Invested: ₹{investedAmount ? investedAmount.toFixed(2) : 'N/A'}</p>

        {/* Sell Button */}
        <button className="sell-btn" onClick={handleSellStock} disabled={!selectedOption || loading}>
          {loading ? 'Processing...' : 'Sell'}
        </button>
      </div>

      <div className="total-balance">
        <h3>Total Balance: ₹{pnl.totalBalance ? pnl.totalBalance.toFixed(2) : 'N/A'}</h3>
      </div>
    </div>
  );
};

export default PnL;
