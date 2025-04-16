import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UAttribution = () => {
  const navigate = useNavigate();
  const [attributions, setAttributions] = useState([]);
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

        const merged = attrRes.data.map(attr => ({
          ...attr,
          employee: employeesMap.get(attr.id_employee),
          equipment: equipmentMap.get(attr.id_materiel)
        }));

        setAttributions(merged);
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

  return (
    <div className="attribution-container p-4">
      <h1 className="text-xl font-bold mb-4">Liste des Attributions</h1>

      {attributions.length === 0 ? (
        <p>Aucune attribution trouvée.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Employé</th>
              <th className="p-2">Matériel</th>
              <th className="p-2">Date d’attribution</th>
              <th className="p-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {attributions.map(attr => (
              <tr key={attr.id_attribution} className="border-t">
                <td className="p-2">{attr.employee?.prenom} {attr.employee?.nom}</td>
                <td className="p-2">{attr.equipment?.type_materiel}</td>
                <td className="p-2">
                  {new Date(attr.date_attribution).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {attr.date_retour ? 'Retourné' : 'Attribué'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UAttribution;
