import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <span>myOnlineMeal</span>
          <p>Delivering happiness since 2023</p>
        </div>
        
        <div className="footer-links">
          <div className="link-group">
            <h4>Navigation</h4>
            <a href="/">Home</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
          </div>
          
          <div className="link-group">
            <h4>Legal</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/refund">Refund Policy</a>
          </div>
          
          <div className="link-group">
            <h4>Contact</h4>
            <a href="mailto:contact@myonlinemeal.com">contact@myonlinemeal.com</a>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
            <address>123 Food Street, Foodville</address>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} myOnlineMeal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;