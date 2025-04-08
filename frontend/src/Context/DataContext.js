import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
const DataContext = createContext();

// Custom Hook
export const useData = () => useContext(DataContext);

// Provider Component
export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [attributions, setAttributions] = useState([]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch equipment
  const fetchEquipment = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/equipment');
      setEquipment(res.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  // Fetch attributions
  const fetchAttributions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attributions');
      setAttributions(res.data);
    } catch (error) {
      console.error("Error fetching attributions:", error);
    }
  };

  // Assign equipment
  const assignEquipment = async (employeeId, equipmentId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/attributions', {
        id_employee: employeeId,
        id_materiel: equipmentId
      });

      // Update local state
      setEmployees(prev =>
        prev.map(emp =>
          emp.id_employee === employeeId
            ? { ...emp, equipment: [...(emp.equipment || []), equipmentId] }
            : emp
        )
      );

      setEquipment(prev =>
        prev.map(eq =>
          eq.id_materiel === equipmentId
            ? { ...eq, etat: 'Attribué' }
            : eq
        )
      );

      setAttributions(prev => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error("Error assigning equipment:", error);
      throw error;
    }
  };

  // Return equipment
  const returnEquipment = async (attributionId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/attributions/${attributionId}/return`);

      const attribution = attributions.find(a => a.id_attribution === attributionId);

      if (attribution) {
        setEmployees(prev =>
          prev.map(emp =>
            emp.id_employee === attribution.id_employee
              ? { ...emp, equipment: emp.equipment.filter(eqId => eqId !== attribution.id_materiel) }
              : emp
          )
        );

        setEquipment(prev =>
          prev.map(eq =>
            eq.id_materiel === attribution.id_materiel
              ? { ...eq, etat: 'Disponible' }
              : eq
          )
        );
      }

      setAttributions(prev =>
        prev.map(attr =>
          attr.id_attribution === attributionId
            ? { ...attr, date_retour: res.data.date_retour }
            : attr
        )
      );

      return res.data;
    } catch (error) {
      console.error("Error returning equipment:", error);
      throw error;
    }
  };

  // Delete attribution
  const deleteAttribution = async (id_attribution) => {
    try {
      const res = await fetch(`http://localhost:5000/api/attributions/${id_attribution}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to delete attribution');

      setAttributions(prev => prev.filter(attr => attr.id_attribution !== id_attribution));
      return true;
    } catch (error) {
      console.error('Error deleting attribution:', error);
      throw error;
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchEmployees();
    fetchEquipment();
    fetchAttributions();
  }, []);

  const value = {
    employees,
    setEmployees,
    equipment,
    setEquipment,
    attributions,
    setAttributions,
    fetchEmployees,
    fetchEquipment,
    fetchAttributions,
    assignEquipment,
    returnEquipment,
    deleteAttribution // ✅ Included in context
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
