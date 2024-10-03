import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

import logo from "../Assets/logo/logo.png";

const Navbar = ({ isAuthenticated, loggedInUser, handleLogout }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const savedPlan = localStorage.getItem('selectedPlan');
        setSelectedPlan(savedPlan);
    }, [location]);

    const watchListLinkText = selectedPlan === 'Rapid' 
        ? 'WatchList1' 
        : selectedPlan === 'Evolution' || selectedPlan === 'Prime' 
        ? 'WatchList2' 
        : 'WatchList';

    const watchListLinkPath = selectedPlan === 'Rapid' 
        ? '/watchlist1' 
        : selectedPlan === 'Evolution' || selectedPlan === 'Prime' 
        ? '/watchlist2' 
        : '/watchlist';

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = () => {
        setMenuOpen(false); // Close menu on link click
    };

    return (
        <nav>
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                <div className='menu-items'>
                    <Link to="/home" onClick={handleLinkClick}>Home</Link>
                    <Link to="/plans" onClick={handleLinkClick}>Plans</Link>
                    <Link to={watchListLinkPath} onClick={handleLinkClick}>{watchListLinkText}</Link>
                    <Link to="/pnl" onClick={handleLinkClick}>P&L</Link>
                    {/* <Link to="/dashboard" onClick={handleLinkClick}>Admin</Link> */}
                </div>
                {isAuthenticated ? (
                    <>
                        <span>{loggedInUser}</span>
                        <button className='log' onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link className='log' to="/login" onClick={handleLinkClick}>Login</Link>
                )}
            </div>

            <div className="hamburger" onClick={handleMenuToggle}>
                {menuOpen ? (
                    <span className="cross">✖</span>
                ) : (
                    <span className="bar"></span>
                )}
                <span className="bar "></span>
                <span className="bar "></span>
            </div>
        </nav>
    );
};

export default Navbar;
