import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="main">
        <p>© 2024 Upper Circuit. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/refund">Refund Policy</a>
        </div>
      </footer>
  )
}

export default Footer