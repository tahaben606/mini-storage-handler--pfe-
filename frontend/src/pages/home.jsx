import React from 'react';
import './home.css';
import image0 from '../assets/image_0.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
const name = localStorage.getItem('name');
const role = localStorage.getItem('role');


  return (
    <div className="home-container">
      {/* Logo */}
      <div className="home-logo">
        <img src={image0} alt="AAVB Logo" />
      </div>

      {/* Main Content */}
      
      <div className="home-content">
        <h1>Welcome {name ? `, ${name}` : 'to AAVB Company'}!</h1>
        <p className="intro-text">Manage employees and equipment efficiently with our innovative solutions.</p>

        {role && (
          <p className="role-text">
            You are logged in as <strong>{role}</strong>.
          </p>
        )}
        {/* Optional Admin Section */}
        {role === 'admin' && (
          <section className="admin-tools">
            <h2>🔒 Admin Tools</h2>
            <p>Access employee/equipment management and attribution controls.</p>
            <Link to='/admin' className="admin-button">Admin page</Link>
          </section>
        )}
        <section className="features">
          <h2>🔹 Features</h2>
          <p>Effortlessly manage employees, assign equipment, and generate detailed reports.</p>
        </section>

        <section className="services">
          <h2>🔹 Our Services</h2>
          <p>We provide efficient solutions for employee management, equipment tracking, and workflow optimization.</p>
        </section>

        <section className="testimonials">
          <h2>🔹 What Our Clients Say</h2>
          <p>Discover how our system has transformed businesses with reliable and user-friendly services.</p>
        </section>


      </div>
    </div>
  );
};

export default Home;
