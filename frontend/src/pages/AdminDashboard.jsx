import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faLaptop, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { useData } from '../Context/DataContext';
import './Admin.css'; // Ensure you have this CSS file for styling

const Admin = () => {
  const { user } = useData();
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Welcome Admin {user?.prenom} {user?.nom}</h1>
        <p>You have full access to manage employees, equipment, and assignments.</p>
      </div>

      <div className="admin-actions">
        <button className="admin-btn" onClick={() => navigate('/employees')}>
          <FontAwesomeIcon icon={faUsers} /> Manage Employees
        </button>
        <button className="admin-btn" onClick={() => navigate('/equipment')}>
          <FontAwesomeIcon icon={faLaptop} /> Manage Equipment
        </button>
        <button className="admin-btn" onClick={() => navigate('/attribution')}>
          <FontAwesomeIcon icon={faListCheck} /> Manage Attributions
        </button>
      </div>
    </div>
  );
};

export default Admin;
