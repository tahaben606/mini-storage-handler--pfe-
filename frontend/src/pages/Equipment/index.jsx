import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faLaptop, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../App.css';

const Equipment = () => {
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/equipment/${id}`);
        setEquipment(equipment.filter(item => item.id_materiel !== id));
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/equipment/details/${id}`); // Navigate to the details page of the selected equipment
  };

  if (loading) return <div className="loading">Loading equipment...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="equipment-container">
      <div className="top-bar">
        <button onClick={() => navigate('/admin')} className="btn-back">⬅ Back</button>
      </div>

      <div className="equipment-header">
        <h1>Equipment Management</h1>
        <button onClick={() => navigate('/equipment/add')} className="btn-add">
          <FontAwesomeIcon icon={faPlus} /> Add Equipment
        </button>
      </div>

      {equipment.length === 0 ? (
        <div className="empty-state">
          <p>No equipment found.</p>
          <button onClick={() => navigate('/equipment/add')} className="btn-add">
            <FontAwesomeIcon icon={faPlus} /> Add Equipment
          </button>
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
              <th className='actions'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(item => (
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
                <td className="actions">
                  <button onClick={() => navigate(`/equipment/edit/${item.id_materiel}`)} className="btn-edit">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(item.id_materiel)} className="btn-delete">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button onClick={() => navigate(`/attribution/assign?equipmentId=${item.id_materiel}`)} className="btn-assign">
                    <FontAwesomeIcon icon={faLaptop} />
                  </button>
                  <button onClick={() => handleViewDetails(item.id_materiel)} className="btn-view">
                    <FontAwesomeIcon icon={faEye} /> {/* Eye icon for View Details */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Equipment;
