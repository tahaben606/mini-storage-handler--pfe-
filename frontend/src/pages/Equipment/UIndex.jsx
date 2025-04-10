import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../Context/DataContext';
import axios from 'axios';

const UEquipment = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/equipment');
        setEquipment(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching equipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  if (loading) return <div className="loading">Loading equipment...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h1>Equipment View</h1>
      </div>

      {equipment.length === 0 ? (
        <div className="empty-state">
          <p>No equipment found.</p>
        </div>
      ) : (
        <table className="equipment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id_materiel}>
                <td>{item.id_materiel}</td>
                <td>{item.type_materiel}</td>
                <td>{item.marque}</td>
                <td>{item.modele}</td>
                <td>
                  <span className={`status status-${item.etat.toLowerCase().replace('é', 'e').replace(' ', '-')}`}>
                    {item.etat}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UEquipment;
