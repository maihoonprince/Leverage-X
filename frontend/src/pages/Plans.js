import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import "../styles/Plans.css";

function Plans() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [userPlan, setUserPlan] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        
        // if (!userId) {
        //     console.error("User is not logged in. Redirecting to login page.");
        //     navigate('/login'); // Redirect if no userId found
        //     return; // Stop further execution if user is not logged in
        // }

        setLoggedInUser(localStorage.getItem('loggedInUser') || '');

        const fetchUserPlan = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/plans/user-plan/${userId}`);
                if (response.data.plan) {
                    setUserPlan(response.data.plan); 
                }
            } catch (error) {
                console.error("Error fetching user plan:", error);
            }
        };

        fetchUserPlan();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const buyPlan = (plan) => {
        if (userPlan === plan) {
            alert('You already used this Plan');
        } else {
            setSelectedPlan(plan);
            setShowPopup(true);
        }
    };

    const handlePayment = async () => {
        try {
            const userId = localStorage.getItem('userId'); 
            const response = await axios.post('http://localhost:8080/api/plans/purchase', { userId, plan: selectedPlan });

            if (response.status === 200) {
                handleSuccess(response.data.msg);
                setShowPopup(false);
                navigate('/watchlist'); 
            }
        } catch (error) {
            handleError(error.response?.data?.msg || 'Payment failed');
        }
    };

    return (
        <div className="plans-container">
            <h1 className="plans-title">Membership Plans</h1>
            <table className="plans-table">
                <thead>
                    <tr>
                        <th>Plan's</th>
                        <th>Trading Balance</th>
                        <th>Minimum Trading Days</th>
                        <th>Margin</th>
                        <th>Plan Cost</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {['Plan1', 'Plan2', 'Plan3'].map((plan, index) => (
                        <tr key={index}>
                            <td>{plan}</td>
                            <td>{plan === 'Plan1' ? '10,000' : plan === 'Plan2' ? '50,000' : '1,00,000'}</td>
                            <td>5 Days</td>
                            <td>10X</td>
                            <td>{plan === 'Plan1' ? '1000' : plan === 'Plan2' ? '5000' : '10,000'}</td>
                            <td>
                                <button
                                    className={userPlan === plan ? "disabled-btn" : "buy-now-btn"}
                                    onClick={() => buyPlan(plan)}
                                    disabled={userPlan === plan}
                                >
                                    {userPlan === plan ? 'Plan Used' : 'Buy Now'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Popup Overlay */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Pay for {selectedPlan}</h2>
                        <p>You Have to Pay: {selectedPlan === 'Plan1' ? '1000' : selectedPlan === 'Plan2' ? '5000' : '10,000'}</p>
                        <img src="/assets/payment-qr.png" alt="QR Code" className="qr-image" />
                        <div className="popup-actions">
                            <button className="done-btn" onClick={handlePayment}>Done</button>
                            <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default Plans;
