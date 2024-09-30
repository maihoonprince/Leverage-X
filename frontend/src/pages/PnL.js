import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PnLPage = () => {
    const location = useLocation();
    const { watchlistType } = location.state || {};  // Get the watchlist type (1 or 2)
    const [userData, setUserData] = useState(null);
    const [stockPrices, setStockPrices] = useState({ watchList1: {}, watchList2: {} });
    const userId = localStorage.getItem('userId');  // Get the logged-in user's ID

    // Fetch user data when the page loads
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pnl/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        console.log('Watchlist type:', watchlistType); // Debugging watchlistType value
    }, [watchlistType]);

    // Fetch stock prices from backend for both WatchLists
    useEffect(() => {
        const fetchStockPrices = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pnl/${userId}/stock-prices`);
                console.log('Fetched stock prices:', response.data);  // Debug here
                setStockPrices({
                    watchList1: response.data.watchList1Prices,
                    watchList2: response.data.watchList2Prices
                });
            } catch (error) {
                console.error('Error fetching stock prices:', error);  // Error logging
            }
        };

        fetchStockPrices();
    }, [userId]);

    // Handle the selling of a stock
    const handleSell = async (stockName) => {
        try {
            const response = await axios.post('http://localhost:8080/api/pnl/sell', { userId, stockName });
            alert(response.data.message);
            // Update the remaining balance and remove the sold stock
            setUserData(prevData => ({
                ...prevData,
                balance: response.data.newBalance,
                stocks: prevData.stocks.filter(stock => stock.stockName !== stockName)
            }));

            // Remove sold stock from stockPrices state
            setStockPrices(prevPrices => {
                const updatedPrices = { ...prevPrices };
                delete updatedPrices[watchlistType === '1' ? 'watchList1' : 'watchList2'][stockName];
                return updatedPrices;
            });
        } catch (error) {
            console.error('Error selling stock:', error);
        }
    };

    // Function to get stock prices from watchlist and fallback to current stock price or 0
    const getStockPrice = (stockName, watchlistType) => {
        const stockList = watchlistType === '1' ? stockPrices.watchList1 : stockPrices.watchList2;
        const normalizedStockName = stockName.trim().toLowerCase();
        const priceKey = Object.keys(stockList).find(key => key.trim().toLowerCase() === normalizedStockName);
        return stockList[priceKey] || 0;
    };

    return (
        <div>
            <h2>Profit & Loss</h2>
            {userData && userData.stocks.length > 0 ? (
                userData.stocks.map(stock => {
                    const currentPrice = getStockPrice(stock.stockName, watchlistType) || stock.currentPrice || 0;
                    const profitLoss = ((stock.quantity || 0) * currentPrice) - (stock.investedAmount || 0);

                    return (
                        <div key={stock.stockName}>
                            <p>Stock Name: {stock.stockName}</p>
                            <p>Quantity: {stock.quantity || 0}</p>
                            <p>Buy Price: ₹{stock.buyPrice || 0}</p>
                            <p>Current Price: ₹{currentPrice.toFixed(2)}</p>
                            <p>Invested Amount: ₹{stock.investedAmount || 0}</p>
                            <p>Profit/Loss: ₹{profitLoss.toFixed(2)}</p>
                            <button onClick={() => handleSell(stock.stockName)}>Sell</button>
                        </div>
                    );
                })
            ) : (
                <p>No stocks available.</p>
            )}
            <h3>Remaining Balance: ₹{userData?.balance?.toFixed(2) || 0}</h3>
            <button>Withdraw</button>
        </div>
    );
};

export default PnLPage;
