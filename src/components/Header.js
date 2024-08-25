import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <nav className="nav">
                <ul>
                    <li><Link to="/" className="nav-link">Booking</Link></li>
                    <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                    <li><Link to="/complete-booking" className="nav-link">Complete Booking</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
