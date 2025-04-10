import React, { useState, useEffect } from 'react';
import { useData } from '../../Context/DataContext';  // Ensure correct import
import { useNavigate } from 'react-router-dom';

const AssignEquipment = () => {
  const { employees, equipment, assignEquipment, fetchEquipment, fetchEmployees } = useData();  // Access fetchEmployees here
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_employee: '',
    id_materiel: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchEquipment();
        if (fetchEmployees) {
          await fetchEmployees();  // Call fetchEmployees if it is available
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, [fetchEquipment, fetchEmployees]);

  // Filter available equipment
  const availableEquipment = equipment.filter(item => item.etat === 'Disponible');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_employee || !formData.id_materiel) {
      alert('Please select both an employee and equipment');
      return;
    }

    try {
      await assignEquipment(
        parseInt(formData.id_employee),
        parseInt(formData.id_materiel)
      );
      navigate('/attribution');
    } catch (error) {
      console.error("Assignment error:", error);
      alert(`Failed to assign equipment: ${error.message}`);
    }
  };

  if (loading) return <div>Loading equipment data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="assign-equipment-container">
      <h2>Assign Equipment to Employee</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee:</label>
          <select
            name="id_employee"
            value={formData.id_employee}
            onChange={(e) => setFormData({...formData, id_employee: e.target.value})}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id_employee} value={emp.id_employee}>
                {emp.prenom} {emp.nom} ({emp.poste})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Equipment:</label>
          <select
            name="id_materiel"
            value={formData.id_materiel}
            onChange={(e) => setFormData({...formData, id_materiel: e.target.value})}
            required
          >
            <option value="">Select Equipment</option>
            {availableEquipment.map(item => (
              <option key={item.id_materiel} value={item.id_materiel}>
                {item.type_materiel} - {item.marque} ({item.etat})
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            disabled={availableEquipment.length === 0}
          >
            Confirm Assignment
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/attribution')}
          >
            Cancel
          </button>
        </div>
      </form>

      {formData.id_employee && formData.id_materiel && (
        <div className="assignment-preview">
          <h3>Assignment Preview</h3>
          <p><strong>Employee:</strong> {
            employees.find(e => e.id_employee.toString() === formData.id_employee.toString())?.prenom || 'Unknown'
          } {
            employees.find(e => e.id_employee.toString() === formData.id_employee.toString())?.nom || ''
          }</p>
          <p><strong>Equipment:</strong> {
            equipment.find(e => e.id_materiel.toString() === formData.id_materiel.toString())?.type_materiel || 'Unknown'
          } ({
            equipment.find(e => e.id_materiel.toString() === formData.id_materiel.toString())?.marque || ''
          })</p>
        </div>
      )}
    </div>
  );
};

export default AssignEquipment;
