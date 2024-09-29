import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To get navigation state
import axios from 'axios';

const PnLPage = () => {
    
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem('userId');

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

    const handleSell = async (stockName) => {
        try {
            const response = await axios.post('http://localhost:8080/api/pnl/sell', { userId, stockName });
            alert(response.data.message);
            // Update the remaining balance
            setUserData(prevData => ({
                ...prevData,
                balance: response.data.newBalance,
                stocks: prevData.stocks.filter(stock => stock.stockName !== stockName)
            }));
        } catch (error) {
            console.error('Error selling stock:', error);
        }
    };

    return (
        <div>
            <h2>Profit & Loss</h2>
            {userData && userData.stocks.length > 0 ? (
                userData.stocks.map(stock => (
                    <div key={stock.stockName}>
                        <p>Stock Name: {stock.stockName}</p>
                        <p>Quantity: {stock.quantity}</p>
                        <p>Buy Price: ₹{stock.buyPrice}</p>
                        <p>Current Price: ₹{stock.currentPrice}</p>
                        <p>Invested Amount: ₹{stock.investedAmount}</p>
                        <p>Profit/Loss: ₹{(stock.quantity * stock.currentPrice) - stock.investedAmount}</p>
                        <button onClick={() => handleSell(stock.stockName)}>Sell</button>
                    </div>
                ))
            ) : (
                <p>No stocks available.</p>
            )}
            <h3>Remaining Balance: ₹{userData?.balance}</h3>
            <button>Withdraw</button>
        </div>
    );
};

export default PnLPage;
