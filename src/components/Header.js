import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/" className="nav-link">Booking</Link></li>
                    <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                    <li><Link to="/complete-booking" className="nav-link">Complete Booking</Link></li>
                </ul>
                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? '✖' : '☰'}
                </button>
            </nav>
        </header>
    );
};

export default Header;
