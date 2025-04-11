import React from 'react';
import { useData } from '../../Context/DataContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';

const Attribution = () => {
  const { attributions, employees, equipment, returnEquipment, deleteAttribution } = useData();
  const navigate = useNavigate();

  const groupedAttributions = attributions.reduce((acc, attribution) => {
    const employeeId = attribution.id_employee;
    const equipmentId = attribution.id_materiel;

    if (!acc[employeeId]) {
      acc[employeeId] = {
        employee: employees.find(e => e.id_employee === employeeId),
        assignments: []
      };
    }

    const eq = equipment.find(e => e.id_materiel === equipmentId);
    if (eq) {
      const isCurrentlyAssigned = attributions.some(a =>
        a.id_materiel === equipmentId &&
        a.id_employee === employeeId &&
        !a.date_retour
      );

      acc[employeeId].assignments.push({
        equipment: eq,
        attribution,
        isReturned: !!attribution.date_retour,
        isDuplicate: !attribution.date_retour && isCurrentlyAssigned
      });
    }

    return acc;
  }, {});

  const handleReturn = async (attributionId) => {
    if (window.confirm("Return this equipment?")) {
      try {
        await returnEquipment(attributionId); // Calls returnEquipment from context
      } catch (error) {
        console.error("Return error:", error);
        alert("Failed to return equipment");
      }
    }
  };

  const handleDelete = async (attributionId) => {
    if (window.confirm("Permanently delete this assignment record?")) {
      try {
        const success = await deleteAttribution(attributionId);
        if (success) {
          console.log("Record deleted successfully");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert(`Delete failed: ${error.message}`);
      }
    }
  };

  const handleAssignMore = (employeeId) => {
    navigate(`/attribution/assign?employeeId=${employeeId}`);
  };

  return (
    <div className="attribution-page">
      <div className="top-bar">
        <button onClick={() => navigate('/admin')} className="btn-back">⬅ Back</button>
      </div>

      <div className="attribution-header">
        <h1>Equipment Assignments</h1>
        <div className="header-actions">
          <button
            onClick={() => navigate('/attribution/assign')}
            className="btn btn-primary"
          >
            <FontAwesomeIcon icon={faPlus} /> New Assignment
          </button>
        </div>
      </div>

      <div className="attribution-table-wrapper">
        <table className="attribution-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Equipment</th>
              <th>Assigned On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedAttributions).map((group, index) => (
              <React.Fragment key={index}>
                {group.assignments.map((assignment, idx) => (
                  <tr
                    key={`${index}-${idx}`}
                    className={`${assignment.isReturned ? 'returned' : 'active'} ${
                      assignment.isDuplicate ? 'duplicate' : ''
                    }`}
                  >
                    {idx === 0 && (
                      <td rowSpan={group.assignments.length} className="employee-cell">
                        <div className="employee-name">
                          <strong>{group.employee?.prenom} {group.employee?.nom}</strong>
                        </div>
                        <div className="employee-details">
                          {group.employee?.poste && (
                            <div className="employee-poste">{group.employee.poste}</div>
                          )}
                          {group.employee?.email && (
                            <div className="employee-email">{group.employee.email}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleAssignMore(group.employee.id_employee)}
                          className="btn-assign-more"
                          disabled={!group.employee}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Assign More
                        </button>
                      </td>
                    )}
                    <td>
                      {assignment.equipment?.type_materiel} ({assignment.equipment?.marque})
                      {assignment.isDuplicate && (
                        <span className="duplicate-warning"> (Already assigned!)</span>
                      )}
                    </td>
                    <td>
                      {new Date(assignment.attribution.date_attribution).toLocaleDateString()}
                    </td>
                    <td>
                      {assignment.isReturned ? (
                        <span className="status-badge returned">
                          <FontAwesomeIcon icon={faCheck} /> Returned
                        </span>
                      ) : (
                        <span className="status-badge active">
                          <FontAwesomeIcon icon={faTimes} /> Assigned
                        </span>
                      )}
                    </td>
                    <td className="actions-cell">
                      {!assignment.isReturned ? (
                        <button
                          onClick={() => handleReturn(assignment.attribution.id_attribution)}
                          className="btn-return"
                        >
                          Return
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(assignment.attribution.id_attribution)}
                          className="btn-delete"
                          title="Delete record"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attribution;
