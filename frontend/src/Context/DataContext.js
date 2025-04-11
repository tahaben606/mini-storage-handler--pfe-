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

  // Assign equipment with quantity
  const assignEquipment = async (employeeId, equipmentId, quantity) => {
    try {
      const res = await axios.post('http://localhost:5000/api/attributions', {
        id_employee: employeeId,
        id_materiel: equipmentId,
        quantity: parseInt(quantity)
      });

      // Update local state
      setEmployees(prev =>
        prev.map(emp => {
          if (emp.id_employee === employeeId) {
            const existingEquipment = emp.equipment || [];
            const existingItem = existingEquipment.find(item => item.id === equipmentId);
            
            if (existingItem) {
              return {
                ...emp,
                equipment: existingEquipment.map(item => 
                  item.id === equipmentId 
                    ? { ...item, quantity: item.quantity + parseInt(quantity) }
                    : item
                )
              };
            } else {
              return {
                ...emp,
                equipment: [...existingEquipment, { id: equipmentId, quantity: parseInt(quantity) }]
              };
            }
          }
          return emp;
        })
      );

      setEquipment(prev =>
        prev.map(eq => {
          if (eq.id_materiel === equipmentId) {
            const newQuantity = eq.quantity - parseInt(quantity);
            return {
              ...eq,
              quantity: newQuantity,
              etat: newQuantity <= 0 ? 'Indisponible' : 'Disponible'
            };
          }
          return eq;
        })
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
        // Update employee's equipment list
        setEmployees(prev =>
          prev.map(emp => {
            if (emp.id_employee === attribution.id_employee) {
              const updatedEquipment = (emp.equipment || []).map(item => {
                if (item.id === attribution.id_materiel) {
                  return {
                    ...item,
                    quantity: item.quantity - (attribution.quantity || 1)
                  };
                }
                return item;
              }).filter(item => item.quantity > 0);
              
              return {
                ...emp,
                equipment: updatedEquipment
              };
            }
            return emp;
          })
        );

        // Update equipment quantity and status
        setEquipment(prev =>
          prev.map(eq => {
            if (eq.id_materiel === attribution.id_materiel) {
              const newQuantity = eq.quantity + (attribution.quantity || 1);
              return {
                ...eq,
                quantity: newQuantity,
                etat: newQuantity > 0 ? 'Disponible' : 'Indisponible'
              };
            }
            return eq;
          })
        );
      }

      // Update attribution with return date
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
      const attribution = attributions.find(a => a.id_attribution === id_attribution);
      const res = await axios.delete(`http://localhost:5000/api/attributions/${id_attribution}`);

      if (attribution && !attribution.date_retour) {
        // If equipment wasn't returned, update quantity
        setEquipment(prev =>
          prev.map(eq => {
            if (eq.id_materiel === attribution.id_materiel) {
              const newQuantity = eq.quantity + (attribution.quantity || 1);
              return {
                ...eq,
                quantity: newQuantity,
                etat: newQuantity > 0 ? 'Disponible' : 'Indisponible'
              };
            }
            return eq;
          })
        );
      }

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
    deleteAttribution
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};