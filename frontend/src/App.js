import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Plans from './pages/Plans';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import RefrshHandler from './RefrshHandler';
import Navbar from './components/Navbar'; // Import your Navbar
import WatchList from './pages/WatchList';
import PnL from './pages/PnL';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser'));

  // Check localStorage for token to maintain session on page reload
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // This runs only once when the component mounts

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
    setLoggedInUser('');
    // Optionally, show a success message here
  };

  // Modified PrivateRoute component to check both state and localStorage
  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token'); // Recheck token on each render
    return token ? element : <Navigate to="/login" />
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Navbar 
        isAuthenticated={isAuthenticated} 
        loggedInUser={loggedInUser} 
        handleLogout={handleLogout} 
      />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/plans' element={<PrivateRoute element={<Plans />} />} />
        <Route path='/watchlist' element={<PrivateRoute element={<WatchList />} />} />
        <Route path='/pnl' element={<PrivateRoute element={<PnL />} />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
