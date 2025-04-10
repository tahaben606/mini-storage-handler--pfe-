
import React from 'react';

import {
    Link
}

from 'react-router-dom';
import './Landing.css';

const LandingPage=()=> {
    return (<div className="landing-page" > {
            /* Hero Section */
        }

        <section className="hero-section" > <div className="hero-content" > <h1>Efficient Employee and Equipment Management</h1> <p> Streamline your employee and equipment management system with ease. Keep track of assignments, returns, and more, all in one place. </p> <div className="cta-buttons" > <Link to="/login" className="cta-btn cta-login" >Login</Link> <Link to="/signup" className="cta-btn cta-signup" >Sign Up</Link> </div> </div> </section> {
            /* Features Section */
        }

        <section className="features-section" > <div className="container" > <h2 className="section-title" >Features</h2> <div className="features-grid" > <div className="feature-card" > <h3>Easy Equipment Management</h3> <p>Assign, track, and return equipment effortlessly with an intuitive interface.</p> </div> <div className="feature-card" > <h3>Employee Directory</h3> <p>Manage your employees’ details, positions, and assignments in one centralized location.</p> </div> <div className="feature-card" > <h3>Role-Based Access</h3> <p>Admins have full control, while employees can access only their relevant information.</p> </div> </div> </div> </section> {
            /* How It Works Section */
        }

        <section className="how-it-works" > <div className="container" > <h2 className="section-title" >How It Works</h2> <div className="steps-grid" > <div className="step" > <h3>1. Sign Up</h3> <p>Create an account to get started.</p> </div> <div className="step" > <h3>2. Assign Equipment</h3> <p>Admins can assign equipment to employees directly from the dashboard.</p> </div> <div className="step" > <h3>3. Track & Return</h3> <p>Employees can view, track, and return equipment with a few simple clicks.</p> </div> </div> </div> </section> {
            /* Testimonials Section */
        }

        <section className="testimonials-section" > <div className="container" > <h2 className="section-title" >What Our Clients Say</h2> <div className="testimonial" > <p>"This platform has revolutionized the way we manage employee equipment. It’s efficient and user-friendly!" </p> <h4>- John Doe, HR Manager</h4> </div> <div className="testimonial" > <p>"As an employee, I can easily track the equipment I’ve been assigned and return it when necessary. Great tool!" </p> <h4>- Jane Smith, Software Developer</h4> </div> </div> </section> {
            /* Footer Section */
        }

        </div>);
}


export default LandingPage;