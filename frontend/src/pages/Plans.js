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
            <th>Plan's</th>
            <th>Trading Balance</th>
            <th>Minimum Trading Days</th>
            <th>Margin</th>
            <th>Plan Cost</th>
            <th>Button</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Plan 1</td>
            <td>10,000</td>
            <td>5 Days</td>
            <td>10 X</td>
            <td>1000</td>
            <td><button className="buy-now-btn">Buy Now</button></td>
          </tr>
          <tr>
            <td>Plan 2</td>
            <td>50,000</td>
            <td>5 Days</td>
            <td>10 X</td>
            <td>5000</td>
            <td><button className="buy-now-btn">Buy Now</button></td>
          </tr>
          <tr>
            <td>Plan 3</td>
            <td>1,00,000</td>
            <td>5 Days</td>
            <td>10 X</td>
            <td>10,000</td>
            <td><button className="buy-now-btn">Buy Now</button></td>
          </tr>
        </tbody>
      </table>
    </div>
            <ToastContainer />
        </div>
    )
}

export default Plans
