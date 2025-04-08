import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="nav-container">
                <div className="logo">
                    <Link to="/">AAVB</Link> 
                </div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Employees">Employees</Link></li>
                    <li><Link to="/Equipment">Equipment</Link></li>
                    <li><Link to="/Attribution">Attribution</Link></li>
                </ul>
                <div className="nav-icons">
                    <Link to="/login">
                        <button className="contact-btn">LOGIN</button>
                    </Link>
                    <Link to="/signup">
                        <button className="contact-btn">SIGNUP</button>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
