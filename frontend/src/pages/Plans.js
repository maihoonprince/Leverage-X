import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import "../styles/Plans.css"

function Plans() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    return (
        <div>
            <div className="plans-container">
      <h1 className="plans-title">Membership Plans</h1>
      <table className="plans-table">
        <thead>
          <tr>
            <th>Trading Balance</th>
            <th>Minimum Trading Days</th>
            <th>Maximum Daily Loss</th>
            <th>Maximum Total Loss</th>
            <th>Phase 1 Profit Target</th>
            <th>Phase 2 Profit Target</th>
            <th>Prime Account Prize Money</th>
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
            <td>5 Days</td>
            <td><button className="buy-now-btn">Buy Now</button></td>
          </tr>
          <tr>
            <td>5,00,000</td>
            <td>5 Days</td>
            <td>25,000</td>
            <td>50,000</td>
            <td>50,000</td>
            <td>25,000</td>
            <td>75%</td>
            <td>5 Days</td>
            <td><button className="buy-now-btn">Buy Now</button></td>
          </tr>
          <tr>
            <td>5,00,000</td>
            <td>5 Days</td>
            <td>25,000</td>
            <td>50,000</td>
            <td>50,000</td>
            <td>25,000</td>
            <td>75%</td>
            <td>5 Days</td>
            <td><button className="buy-now-btn">Buy Now</button></td>
          </tr>
        </tbody>
      </table>
      <footer className="footer">
        <p>© 2024 Upper Circuit. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/refund">Refund Policy</a>
        </div>
      </footer>
    </div>
            <ToastContainer />
        </div>
    )
}

export default Plans
