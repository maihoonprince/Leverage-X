import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import "../styles/Plans.css";

function Plans() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [userPlan, setUserPlan] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Fetch userId here
        
        if (!token) {
            console.error("User is not logged in. Redirecting to login page.");
            navigate('/login');
            return;
        }

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
            const userId = localStorage.getItem('userId'); // Fetch userId here again for payment
            const response = await axios.post('http://localhost:8080/api/plans/purchase', { userId, plan: selectedPlan });

            if (response.status === 200) {
                handleSuccess(response.data.msg);
                setShowPopup(false);

                // Redirect to the appropriate watchlist page based on the selected plan
                if (selectedPlan === 'Rapid') {
                    navigate('/watchlist1');  // Redirect to Watchlist 1 for Rapid plan
                } else if (selectedPlan === 'Evolution' || selectedPlan === 'Prime') {
                    navigate('/watchlist2');  // Redirect to Watchlist 2 for Evolution and Prime plans
                }
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
                    {['Rapid', 'Evolution', 'Prime'].map((plan, index) => (
                        <tr key={index}>
                            <td>{plan}</td>
                            <td>{plan === 'Rapid' ? '10,000' : plan === 'Evolution' ? '50,000' : '1,00,000'}</td>
                            <td>5 Days</td>
                            <td>10X</td>
                            <td>{plan === 'Rapid' ? '1000' : plan === 'Evolution' ? '5000' : '10,000'}</td>
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
                        <p>You Have to Pay: {selectedPlan === 'Rapid' ? '1000' : selectedPlan === 'Evolution' ? '5000' : '10,000'}</p>
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
