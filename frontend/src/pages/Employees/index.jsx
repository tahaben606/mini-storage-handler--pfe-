import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faLaptop } from '@fortawesome/free-solid-svg-icons';
import { useData } from '../../Context/DataContext';
import axios from 'axios';

const Employees = () => {
  const navigate = useNavigate();
  const { employees, loading, error, fetchEmployees } = useData();

  // Refresh data when component mounts
  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [fetchEmployees, employees.length]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchEmployees(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1 className="employees-title">Employee Management</h1>
        <div className="header-actions">
          <button 
            onClick={() => navigate('/employees/add')} 
            className="btn btn-add-employee"
          >
            <FontAwesomeIcon icon={faPlus} /> Add New Employee
          </button>
        </div>
      </div>

      <div className="employees-table-wrapper">
        {loading && <p>Loading employees...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {employees.length === 0 && !loading && (
          <div className="no-employees">
            <p>No employees found. Add your first employee to get started.</p>
            <button 
              onClick={() => navigate('/employees/add')} 
              className="btn btn-add-employee"
            >
              <FontAwesomeIcon icon={faPlus} /> Add Employee
            </button>
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
                <th>Actions</th>
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
                  <td className="employee-actions">
                    <button 
                      onClick={() => navigate(`/employees/edit/${employee.id_employee}`)}
                      className="btn btn-edit"
                      title="Edit employee"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      onClick={() => handleDelete(employee.id_employee)}
                      className="btn btn-delete"
                      title="Delete employee"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button 
                      onClick={() => navigate(`/attribution/assign?employeeId=${employee.id_employee}`)}
                      className="btn btn-assign"
                      title="Assign equipment"
                    >
                      <FontAwesomeIcon icon={faLaptop} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Employees;