import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

import "../styles/Admin.css"

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [newStock, setNewStock] = useState({ name: '', price: '' });
    const [newStockPrice, setNewStockPrice] = useState({});
    const [newUserBalance, setNewUserBalance] = useState({});

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

    const handleStockPriceChange = (stockId, value) => {
        setNewStockPrice((prevState) => ({
            ...prevState,
            [stockId]: value,
        }));
    };

    const handleBalanceChange = (userId, value) => {
        setNewUserBalance((prevState) => ({
            ...prevState,
            [userId]: value,
        }));
    };

    const updateStockPrice = async (stockId) => {
        const newPrice = newStockPrice[stockId];
        if (!newPrice) {
            handleError('Please enter a valid price.');
            return;
        }
        try {
            await axios.put(`http://localhost:8080/api/stocks/${stockId}`, { price: newPrice });
            handleSuccess('Stock price updated successfully!');
            fetchStocks(); // Refresh the stock data
        } catch (error) {
            handleError('Error updating stock price');
        }
    };

    const updateUserBalance = async (userId) => {
        const balance = newUserBalance[userId];
        if (!balance) {
            handleError('Please enter a valid balance.');
            return;
        }
        try {
            await axios.put(`http://localhost:8080/api/users/balance/${userId}`, { balance });
            handleSuccess('User balance updated successfully!');
            fetchUsers(); // Refresh the user data
        } catch (error) {
            handleError('Error updating user balance');
        }
    };

    const handleNewStockChange = (e) => {
        const { name, value } = e.target;
        setNewStock({ ...newStock, [name]: value });
    };

    const addNewStock = async () => {
        if (!newStock.name || !newStock.price) {
            handleError('Please enter valid stock details.');
            return;
        }
        try {
            await axios.post('http://localhost:8080/api/stocks', newStock);
            handleSuccess('New stock added successfully!');
            setNewStock({ name: '', price: '' }); // Reset form
            fetchStocks(); // Refresh the stock data
        } catch (error) {
            handleError('Error adding new stock');
        }
    };

    return (
        <div className="admin-dashboard-container">
            <h1>Admin Dashboard</h1>

            {/* Add New Stock */}
            <div className="add-stock-section">
                <h2>Add New Stock</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Stock Name"
                    value={newStock.name}
                    onChange={handleNewStockChange}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Initial Price"
                    value={newStock.price}
                    onChange={handleNewStockChange}
                />
                <button onClick={addNewStock}>Add Stock</button>
            </div>

            {/* Manage Stock Prices */}
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
                                        value={newStockPrice[stock._id] || ''}
                                        onChange={(e) => handleStockPriceChange(stock._id, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => updateStockPrice(stock._id)}>
                                        Update Price
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manage User Balances */}
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
                                        value={newUserBalance[user._id] || ''}
                                        onChange={(e) => handleBalanceChange(user._id, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => updateUserBalance(user._id)}>
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
