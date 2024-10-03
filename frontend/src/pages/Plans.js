import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import "../styles/Plans.css";

import qrcode from "../Assets/WhatsApp Image 2024-10-03 at 18.58.39_5c2012ec.jpg";

function Plans() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [hasBoughtRapid, setHasBoughtRapid] = useState(false); // Track Rapid plan status
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
            console.error("User is not logged in. Redirecting to login page.");
            navigate('/login');
            return;
        }

        // Fetch the user's plan status (for Rapid plan)
        const fetchUserPlanStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/plans/user-plan/${userId}`);
                if (response.data) {
                    setHasBoughtRapid(response.data.hasBoughtRapidPlan); // Set Rapid plan status
                }
            } catch (error) {
                console.error("Error fetching user plan status:", error);
            }
        };

        fetchUserPlanStatus();
    }, [navigate]);

    const buyPlan = (plan) => {
        if (plan === 'Rapid' && hasBoughtRapid) {
            alert('You cannot buy the Rapid plan again!');
        } else {
            setSelectedPlan(plan);
            setShowPopup(true);
        }
    };

    const handlePayment = async () => {
        try {
            const userId = localStorage.getItem('userId');
            
            if (selectedPlan === 'Rapid') {
                // Store Rapid plan in the database
                const response = await axios.post('http://localhost:8080/api/plans/purchase', { userId, plan: selectedPlan });

                if (response.status === 200) {
                    handleSuccess(response.data.msg);
                    setShowPopup(false);
                    setHasBoughtRapid(true); // Mark Rapid plan as bought
                    navigate('/watchlist1');
                }
            } else if (selectedPlan === 'Evolution' || selectedPlan === 'Prime') {
                // Simply redirect for Evolution or Prime
                handleSuccess("Plan selected successfully");
                setShowPopup(false);
                navigate('/watchlist2');
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
                        <th>Life Cycle</th>
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
                            <td>{plan === 'Rapid' ? '1 Time' : 'Unlimited'}</td>
                            <td>
                                <button
                                    className={hasBoughtRapid && plan === 'Rapid' ? "disabled-btn" : "buy-now-btn"}
                                    onClick={() => buyPlan(plan)}
                                    disabled={hasBoughtRapid && plan === 'Rapid'}
                                >
                                    {hasBoughtRapid && plan === 'Rapid' ? 'Plan Used' : 'Buy Now'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Pay for {selectedPlan}</h2>
                        <p>You Have to Pay: {selectedPlan === 'Rapid' ? '1000' : selectedPlan === 'Evolution' ? '5000' : '10,000'}</p>
                        <img src={qrcode} alt="QR Code" className="qr-image" />
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
