// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <p>Welcome, {userData.name}</p>
            <p>Your Balance: {userData.balance}</p>
            <p>Your Plan: {userData.plan}</p>
        </div>
    );
};

export default Dashboard;
