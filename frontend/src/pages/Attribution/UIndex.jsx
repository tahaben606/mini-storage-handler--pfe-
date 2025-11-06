import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UAttribution = () => {
  const navigate = useNavigate();
  const [groupedAttributions, setGroupedAttributions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [attrRes, empRes, eqRes] = await Promise.all([
          axios.get('http://localhost:5000/api/attributions'),
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/equipment')
        ]);

        const employeesMap = new Map(empRes.data.map(e => [e.id_employee, e]));
        const equipmentMap = new Map(eqRes.data.map(eq => [eq.id_materiel, eq]));

        // Group by employee
        const group = {};

        attrRes.data.forEach(attr => {
          const employeeId = attr.id_employee;

          if (!group[employeeId]) {
            group[employeeId] = {
              employee: employeesMap.get(employeeId),
              assignments: []
            };
          }

          group[employeeId].assignments.push({
            ...attr,
            equipment: equipmentMap.get(attr.id_materiel)
          });
        });

        setGroupedAttributions(group);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Une erreur s’est produite lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="loading">Chargement des attributions...</div>;
  if (error) return <div className="error">Erreur : {error}</div>;

  const employeeIds = Object.keys(groupedAttributions);

  return (
    <div className="attribution-container p-4">
      <h1 className="text-xl font-bold mb-4">Liste des Attributions</h1>

      {employeeIds.length === 0 ? (
        <p>Aucune attribution trouvée.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Employé</th>
              <th className="p-2">Matériel(s)</th>
              <th className="p-2">Date(s) d’attribution</th>
              <th className="p-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {employeeIds.map(employeeId => {
              const group = groupedAttributions[employeeId];
              return (
                <tr key={employeeId} className="border-t align-top">
                  <td className="p-2">
                    <strong>{group.employee?.prenom} {group.employee?.nom}</strong>
                  </td>
                  <td className="p-2">
                    <ul className="list-disc pl-4">
                      {group.assignments.map(assign => (
                        <li key={assign.id_attribution}>
                          {assign.equipment?.type_materiel}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    <ul className="list-disc pl-4">
                      {group.assignments.map(assign => (
                        <li key={assign.id_attribution}>
                          {new Date(assign.date_attribution).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    <ul className="list-disc pl-4">
                      {group.assignments.map(assign => (
                        <li key={assign.id_attribution}>
                          {assign.date_retour ? 'Retourné' : 'Attribué'}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UAttribution;
