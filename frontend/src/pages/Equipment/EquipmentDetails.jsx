import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const EquipmentDetails = () => {
  const { id } = useParams();  // Get the equipment id from the URL
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/equipment/${id}`);
        setEquipment(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching equipment details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading equipment details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="equipment-details-container">
      <div className="top-bar">
        <button onClick={() => window.history.back()} className="btn-back">⬅ Back</button>
      </div>

      {equipment ? (
        <div className="equipment-details">
          <h1>Equipment Details</h1>
          <div className="details">
            <p><strong>ID:</strong> {equipment.id_materiel}</p>
            <p><strong>Type:</strong> {equipment.type_materiel}</p>
            <p><strong>Brand:</strong> {equipment.marque}</p>
            <p><strong>Model:</strong> {equipment.modele}</p>
            <p><strong>Status:</strong> {equipment.etat}</p>
            <p><strong>Price:</strong> {equipment.prix} DH</p>  {/* Price of the equipment */}
            <p><strong>Quantity:</strong> {equipment.quantite}</p>  {/* Quantity */}
            <p><strong>Purchase Date:</strong> {new Date(equipment.date_achat).toLocaleDateString()}</p>  {/* Format purchase date */}
          </div>
        </div>
      ) : (
        <div className="error">No equipment found with this ID.</div>
      )}
    </div>
  );
};

export default EquipmentDetails;
