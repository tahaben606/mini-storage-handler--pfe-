import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../Context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UEmployee = () => {
  const navigate = useNavigate();
  const { loading } = useData();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null); // ✅ ensure this line is correct

  // Move the fetchEmployees function above the useEffect
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data); // ✅ this line is setting the employees state
    } catch (error) {
      setError("Failed to fetch employees");
    }
  };

  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees(); // ✅ call fetchEmployees when employees is empty
    }
  }, [employees.length]); // Just depend on employees.length

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1 className="employees-title">Employee View</h1>
      </div>

      <div className="employees-table-wrapper">
        {loading && <p>Loading employees...</p>}
        {error && <p className="error-message">{error}</p>}

        {employees.length === 0 && !loading && (
          <div className="no-employees">
            <p>No employees found.</p>
          </div>
        )}

        {employees.length > 0 && (
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id_employee}>
                  <td>{employee.id_employee}</td>
                  <td>{employee.prenom}</td>
                  <td>{employee.nom}</td>
                  <td>{employee.email}</td>
                  <td>{employee.poste}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UEmployee;
