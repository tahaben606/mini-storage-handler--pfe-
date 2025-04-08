import React, { useState, useEffect } from 'react';
import { useData } from '../../Context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditEmployee = () => {
  const { employees, setEmployees } = useData();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    poste: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const employee = employees.find(emp => emp.id_employee.toString() === id);
    
    if (employee) {
      setForm({
        nom: employee.nom,
        prenom: employee.prenom,
        email: employee.email,
        poste: employee.poste
      });
    } else {
      navigate('/employees');
    }
  }, [id, employees, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.prenom.trim()) newErrors.prenom = 'First name is required';
    if (!form.nom.trim()) newErrors.nom = 'Last name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!form.poste.trim()) newErrors.poste = 'Position is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${id}`,
        { ...form, id_employee: parseInt(id) }
      );
      
      // Update context state
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id_employee === parseInt(id) ? response.data : emp
        )
      );
      
      navigate('/employees');
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="edit-employee-page">
      <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.prenom ? 'border-red-500' : ''}`}
            required
          />
          {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
        </div>

        <div>
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.nom ? 'border-red-500' : ''}`}
            required
          />
          {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block mb-1">Position</label>
          <input
            type="text"
            name="poste"
            value={form.poste}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.poste ? 'border-red-500' : ''}`}
            required
          />
          {errors.poste && <p className="text-red-500 text-sm">{errors.poste}</p>}
        </div>

        <div className="flex space-x-4 pt-4">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/employees')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;