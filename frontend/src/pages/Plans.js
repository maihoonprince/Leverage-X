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

                // Save selected plan to localStorage
                localStorage.setItem('selectedPlan', selectedPlan);

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
                            <td>{plan === 'Rapid' ? '1 Times' : plan === 'Evolution' ? 'Unlimited' : 'Umlimited'}</td>
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
            <section className='section-plan'>
                <h2>Choose Your Plan</h2>
                <div className='plan-amt'>
                    <div className='amt'>
                       <h3>Rapid Plan (Rs 1,000)</h3>
                        <p>Perfect for traders who want to start small and fast. For just Rs 1,000, you can join our Rapid Plan and start trading with leveraged capital. This plan is ideal for newer traders looking to test the waters or experienced traders who want quick access to funds with a low entry barrier.</p>
                    </div>
                    <div className='amt'>
                       <h3>Evolution Plan (Rs 5,000)</h3>
                        <p>Designed for those who are ready to take their trading to the next level, the Evolution Plan gives you a larger amount of capital and more flexibility. With an affordable Rs 5,000 upfront cost, this plan is ideal for traders who are confident in their strategies and are looking to grow their trading portfolios.</p>
                    </div>
                    <div className='amt'>
                        <h3>Prime Plan (Rs 10,000)</h3>
                        <p>For serious traders aiming to trade with large amounts of capital and maximize their profit potential, the Prime Plan offers the highest funding level. At Rs 10,000, this plan is built for experienced traders who want to significantly scale up their operations and have access to substantial funding. If you’re ready to trade like a pro, the Prime Plan is for you.</p>
                    </div>
                </div>

            </section>

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
