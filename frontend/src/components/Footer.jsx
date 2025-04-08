import React, { useState } from 'react';
import './footer.css';
import image0 from '../assets/image_0.jpg'; // Ensure the image is in src/assets/

const Footer = () => {
  // State for showing more or less hours
  const [showAll, setShowAll] = useState(false);

  // Function to get today's day and hide/show based on it
  const getTodayAndFollowingDays = () => {
    const today = new Date().getDay();
    const days = [
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ];

    // Get current day and the next days (cycle through the array)
    const upcomingDays = [];
    for (let i = 0; i < 7; i++) {
      upcomingDays.push(days[(today + i) % 7]);
    }

    return upcomingDays;
  };

  const todayAndFollowingDays = getTodayAndFollowingDays();

  // Handle the "Show More" / "Show Less" button click
  const handleToggle = () => {
    setShowAll(prevState => !prevState); // Toggle between true and false
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo */}
        <div className="footer-logo">
          <img src={image0} alt="AAVB Company Logo" />
        </div>

        {/* Company Info */}
        <div className="footer-info">
          <h4>AAVB Company</h4>
          <p>
            Empowering businesses with cutting-edge solutions. Our platform simplifies
            employee and equipment management, ensuring efficiency and productivity.
          </p>
          <ul>
            <li>📍 Address: Address</li>
            <li>📧 Email: contact@aavb.com</li>
            <li>📞 Phone: +212 53 72 16 50 0</li>

            {/* Display current day's hours */}
            <li>🕒 {todayAndFollowingDays[0]}: 08:30 AM - 4:30 PM</li>

            {/* Show all days after "Show More" is clicked */}
            {showAll && (
              <>
                {todayAndFollowingDays.slice(1).map((day, index) => (
                  <li key={index}>🕒 {day}: 08:30 AM - 4:30 PM</li>
                ))}
              </>
            )}

            

          {/* Toggle button for "Show More" / "Show Less" */}
          <button onClick={handleToggle} className="show-more-btn">
            {showAll ? 'Show Less' : 'Show More'}
          </button>
            <li>🌐 <a href="http://www.bouregreg.com/" target="_blank" rel="noopener noreferrer">www.bouregreg.com</a></li>
                    </ul>          
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-rights">
        <p>© 2025 AAVB Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
