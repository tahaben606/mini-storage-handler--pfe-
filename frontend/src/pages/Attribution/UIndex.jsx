import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UAttribution = () => {
  const navigate = useNavigate();
  const [attributions, setAttributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttributions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attributions');
        const attributionData = response.data;

        const employeesResponse = await axios.get('http://localhost:5000/api/employees');
        const equipmentResponse = await axios.get('http://localhost:5000/api/equipment');

        const attributionsWithDetails = attributionData.map(attribution => {
          const employee = employeesResponse.data.find(e => e.id_employee === attribution.id_employee);
          const equipment = equipmentResponse.data.find(eq => eq.id_materiel === attribution.id_materiel);
          
          return {
            ...attribution,
            employee,
            equipment
          };
        });

        setAttributions(attributionsWithDetails);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching attributions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributions();
  }, []);

  if (loading) return <div className="loading">Loading attributions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="attribution-container">
      <div className="attribution-header">
        <h1>Attribution View</h1>
      </div>

      {attributions.length === 0 ? (
        <div className="empty-state">
          <p>No attributions found.</p>
        </div>
      ) : (
        <table className="attribution-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Equipment</th>
              <th>Assigned On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attributions.map((attribution) => (
              <tr key={attribution.id_attribution}>
                <td>{attribution.employee?.prenom} {attribution.employee?.nom}</td>
                <td>{attribution.equipment?.type_materiel}</td>
                <td>{new Date(attribution.date_attribution).toLocaleDateString()}</td>
                <td>{attribution.date_retour ? 'Returned' : 'Assigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UAttribution;
