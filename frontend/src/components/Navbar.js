import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'

const Navbar = ({ isAuthenticated, loggedInUser, handleLogout }) => {
    return (
        <nav>
            <div className="logo">YourLogo</div>
            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/plans">Plans</Link>
                <Link to="/watchlist">WatchList</Link>
                <Link to="/pnl">PnL</Link>
                {isAuthenticated ? (
                    <>
                        <span>{loggedInUser}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
