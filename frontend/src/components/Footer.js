import React from 'react';
import '../styles/footer.css';
import { Link, useLocation } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="main">
        <p>© 2024 LeverageX All Rights Reserved.</p>
        <div className="footer-links">
          {/* <Link to="/term"> Term  </Link> */}
          <a href="/term" >Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/refund">Refund Policy</a>
        </div>
      </footer>
  )
}

export default Footer;