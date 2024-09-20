import React from 'react';
import '../styles/Home.css';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="home-container">

            {/* Header Section */}
            <header className="header">
                <div className="header-content">
                    <h1>Educational Stock Market Trading Platform</h1>
                    <p>
                        - Up to 30,00,000 Trading Balance per user<br />
                        - Real-Money payouts on Trading Profit<br />
                        - No Payment for Losses<br />
                        - No Derivatives, Only Spot Trading
                    </p>
                    <div className="header-buttons">
                        <button className="btn know-more">Know More</button>
                        <button className="btn buy-now">Buy Now</button>
                    </div>
                </div>
                <div className="header-image">
                    <img src="phone-mockup.png" alt="Trading App" />
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <div className="feature-item">
                    <h3>24/7</h3>
                    <p>On-site Chat Support</p>
                </div>
                <div className="feature-item">
                    <h3>75%</h3>
                    <p>Payout Profit Share</p>
                </div>
                <div className="feature-item">
                    <h3>30 Days</h3>
                    <p>Each Trading Cycle</p>
                </div>
                <div className="feature-item">
                    <h3>No Limit</h3>
                    <p>Real-Money Payouts</p>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>How It Works?</h2>
                <div className="steps">
                    <div className="step">
                        <h3>Setting Up</h3>
                        <p>Select the best Membership Plan for your trading style, add to cart and complete the transaction.</p>
                    </div>
                    <div className="step">
                        <h3>Trade</h3>
                        <p>Receive account login details via email within 24-48 hours of payment. Start trading!</p>
                    </div>
                    <div className="step">
                        <h3>Real-Money Payout</h3>
                        <p>Request Real-Money payouts on WebTrader/Mobile App after hitting profit targets.</p>
                    </div>
                </div>
            </section>

            {/* Membership Plans Section */}
            <section className="membership-plans" id="plans">
                <h2>Membership Plans</h2>
                <div className="plan-tabs">
                    <button className="tab active">Evaluation</button>
                    <button className="tab">Rapid</button>
                </div>
                <table className="plans-table">
                    <thead>
                        <tr>
                            <th>Trading Balance</th>
                            <th>Minimum Trading Days</th>
                            <th>Maximum Daily Loss</th>
                            <th>Maximum Total Loss</th>
                            <th>Phase 1 Profit Target</th>
                            <th>Phase 2 Profit Target</th>
                            <th>Profit Payout</th>
                            <th>Trading Period</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>5,00,000</td>
                            <td>5 Days</td>
                            <td>25,000</td>
                            <td>50,000</td>
                            <td>50,000</td>
                            <td>25,000</td>
                            <td>75%</td>
                            <td>30 Days</td>
                            <td>Rs. 5,000</td>
                        </tr>
                        <tr>
                            <td>10,00,000</td>
                            <td>5 Days</td>
                            <td>50,000</td>
                            <td>1,00,000</td>
                            <td>1,00,000</td>
                            <td>50,000</td>
                            <td>75%</td>
                            <td>30 Days</td>
                            <td>Rs. 10,000</td>
                        </tr>
                        <tr>
                            <td>15,00,000</td>
                            <td>5 Days</td>
                            <td>75,000</td>
                            <td>1,50,000</td>
                            <td>1,50,000</td>
                            <td>75,000</td>
                            <td>75%</td>
                            <td>30 Days</td>
                            <td>Rs. 15,000</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Features */}
            <section className="features-section">
                <h2>Features:</h2>
                <ul>
                    <li>Real-Money Payout on Profits</li>
                    <li>No Payment for Losses</li>
                    <li>Unlimited Accounts per User</li>
                    <li>No Upper Limit on Real-Money Payouts</li>
                    <li>Mystery Rewards for Consistent Traders</li>
                </ul>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p>At Upper Circuit, we believe that all skilled traders should be rewarded.</p>
                    <ul className="footer-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#plans">Plans</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#faqs">FAQs</a></li>
                    </ul>
                    <ul className="footer-policies">
                        <li><a href="#terms">Terms & Conditions</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#refund">Refund Policy</a></li>
                    </ul>
                </div>
                <div className="footer-note">
                    <p>&copy; 2024 Upper Circuit. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
