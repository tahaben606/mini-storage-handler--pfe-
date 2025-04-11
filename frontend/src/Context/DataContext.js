import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [attributions, setAttributions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger a refresh when required

  // Fetch data function
  const fetchData = useCallback(async (endpoint, setData) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/${endpoint}`);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Memoized fetch functions
  const fetchEmployees = useCallback(() => fetchData('employees', setEmployees), [fetchData]);
  const fetchEquipment = useCallback(() => fetchData('equipment', setEquipment), [fetchData]);
  const fetchAttributions = useCallback(() => fetchData('attributions', setAttributions), [fetchData]);

  // Initial data load
  useEffect(() => {
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [empRes, eqRes, attrRes] = await Promise.all([
          axios.get('http://localhost:5000/api/employees', { signal: controller.signal }),
          axios.get('http://localhost:5000/api/equipment', { signal: controller.signal }),
          axios.get('http://localhost:5000/api/attributions', { signal: controller.signal })
        ]);
        setEmployees(empRes.data);
        setEquipment(eqRes.data);
        setAttributions(attrRes.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.message);
          console.error("Initial data load error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();

    return () => controller.abort();
  }, [refreshTrigger]); // Re-fetch data when refreshTrigger changes

  // Assign equipment with quantity
  const assignEquipment = useCallback(async (employeeId, equipmentId, quantity) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/attributions', {
        id_employee: employeeId,
        id_materiel: equipmentId,
        quantity: parseInt(quantity)
      });

      setEmployees(prev =>
        prev.map(emp => {
          if (emp.id_employee === employeeId) {
            const existingEquipment = emp.equipment || [];
            const existingItem = existingEquipment.find(item => item.id === equipmentId);
            
            return {
              ...emp,
              equipment: existingItem
                ? existingEquipment.map(item => 
                    item.id === equipmentId 
                      ? { ...item, quantity: item.quantity + parseInt(quantity) }
                      : item
                  )
                : [...existingEquipment, { id: equipmentId, quantity: parseInt(quantity) }]
            };
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

      setRefreshTrigger(prev => prev + 1); // Trigger re-fetch after assignment
      return res.data;
    } catch (err) {
      setError(err.message);
      console.error("Error assigning equipment:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Return equipment
  const returnEquipment = useCallback(async (attributionId) => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/attributions/${attributionId}/return`,
        {}
      );

      const attribution = attributions.find(a => a.id_attribution === attributionId);

      if (attribution) {
        setEmployees(prev =>
          prev.map(emp => {
            if (emp.id_employee === attribution.id_employee) {
              const updatedEquipment = (emp.equipment || [])
                .map(item => {
                  if (item.id === attribution.id_materiel) {
                    return {
                      ...item,
                      quantity: item.quantity - (attribution.quantity || 1)
                    };
                  }
                  return item;
                })
                .filter(item => item.quantity > 0);

              return { ...emp, equipment: updatedEquipment };
            }
            return emp;
          })
        );

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

        setAttributions(prev =>
          prev.map(attr =>
            attr.id_attribution === attributionId
              ? { ...attr, date_retour: res.data.date_retour, isReturned: true }
              : attr
          )
        );
      }

      setRefreshTrigger(prev => prev + 1); // Trigger re-fetch after return
      return res.data;
    } catch (err) {
      setError(err.message);
      console.error("Error returning equipment:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [attributions]);

  // Delete attribution
  const deleteAttribution = useCallback(async (id_attribution) => {
    setIsLoading(true);
    try {
      const attribution = attributions.find(a => a.id_attribution === id_attribution);
      await axios.delete(`http://localhost:5000/api/attributions/${id_attribution}`);

      if (attribution && !attribution.date_retour) {
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
      setRefreshTrigger(prev => prev + 1); // Trigger re-fetch after deletion
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting attribution:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [attributions]);

  return (
    <DataContext.Provider value={{
      employees,
      equipment,
      attributions,
      isLoading,
      error,
      fetchEmployees,
      fetchEquipment,
      fetchAttributions,
      assignEquipment,
      returnEquipment,
      deleteAttribution,
      setError
    }}>
      {children}
    </DataContext.Provider>
  );
};
