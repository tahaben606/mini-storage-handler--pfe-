import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        if (name && role) {
            setIsLoggedIn(true);
            setUserName(name);
            setUserRole(role);
        } else {
            setIsLoggedIn(false);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
        navigate('/login');
    };

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="nav-container">
                <div className="logo">
                    <Link to="/">AAVB</Link>
                </div>
                <ul className="nav-links">
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/Employees/index">Employees</Link></li>
                    <li><Link to="/Equipment/index">Equipment</Link></li>
                    <li><Link to="/Attribution/index">Attribution</Link></li>
                    {userRole === 'admin' && (
                        <li><Link to="/admin">Admin</Link></li>
                    )}
                </ul>

                <div className="nav-icons">
                    {isLoggedIn ? (
                        <>
                            <span className="user-info">
                                👤 {userName} ({userRole})
                            </span>
                            <button className="contact-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="contact-btn">LOGIN</button>
                            </Link>
                            <Link to="/signup">
                                <button className="contact-btn">SIGNUP</button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
