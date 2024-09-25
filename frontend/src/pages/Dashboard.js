import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
// import "../styles/AdminDashboard.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [userId, setUserId] = useState(null);
    const [newBalance, setNewBalance] = useState(0);

    useEffect(() => {
        fetchUsers();
        fetchStocks();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            handleError('Error fetching users');
        }
    };

    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/stocks');
            setStocks(response.data);
        } catch (error) {
            handleError('Error fetching stocks');
        }
    };

    const updateStockPrice = async (stockId, newPrice) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/stocks/${stockId}`, { price: newPrice });
            handleSuccess('Stock price updated successfully!');
            fetchStocks();
        } catch (error) {
            handleError('Error updating stock price');
        }
    };

    const updateUserBalance = async (userId, balance) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/users/balance/${userId}`, { balance });
            handleSuccess('User balance updated successfully!');
            fetchUsers();
        } catch (error) {
            handleError('Error updating user balance');
        }
    };

    return (
        <div className="admin-dashboard-container">
            <h1>Admin Dashboard</h1>
            <div className="stocks-section">
                <h2>Manage Stock Prices</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Stock Name</th>
                            <th>Current Price</th>
                            <th>New Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map(stock => (
                            <tr key={stock._id}>
                                <td>{stock.name}</td>
                                <td>₹{stock.price}</td>
                                <td>
                                    <input 
                                        type="number" 
                                        placeholder="New Price" 
                                        onChange={(e) => setSelectedStock({ ...stock, newPrice: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => updateStockPrice(stock._id, selectedStock.newPrice)}>
                                        Update Price
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="users-section">
                <h2>Manage User Balances</h2>
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Current Balance</th>
                            <th>New Balance</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.fullName}</td>
                                <td>₹{user.balance}</td>
                                <td>
                                    <input 
                                        type="number" 
                                        placeholder="New Balance" 
                                        onChange={(e) => setNewBalance(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => updateUserBalance(user._id, newBalance)}>
                                        Update Balance
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdminDashboard;
