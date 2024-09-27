import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isAuthenticated, loggedInUser, handleLogout }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const location = useLocation();

    // Retrieve the selected plan from localStorage when the component mounts or route changes
    useEffect(() => {
        const savedPlan = localStorage.getItem('selectedPlan');
        setSelectedPlan(savedPlan);
    }, [location]);  // Re-run this effect when the route changes

    // Determine which WatchList page to show in the navbar based on the selected plan
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

    return (
        <nav>
            <div className="logo">YourLogo</div>
            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/plans">Plans</Link>
                <Link to={watchListLinkPath}>{watchListLinkText}</Link> {/* Update WatchList link dynamically */}
                <Link to="/pnl">PnL</Link>
                <Link to="/dashboard">Admin</Link>
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
};

export default Navbar;
