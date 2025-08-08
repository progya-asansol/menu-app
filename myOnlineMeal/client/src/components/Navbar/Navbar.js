import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

import './Navbar.css';


const Navbar = () => {
    
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span>myOnlineMeal</span>
        </Link>
        
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/services" className="nav-link" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
        
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;