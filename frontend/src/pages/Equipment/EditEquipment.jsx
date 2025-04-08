import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const EditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type_materiel: '',
    marque: '',
    modele: '',
    etat: 'Disponible'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/equipment/${id}`);
        setForm(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        navigate('/equipment');
      }
    };
    fetchEquipment();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.type_materiel.trim()) newErrors.type_materiel = 'Type is required';
    if (!form.marque.trim()) newErrors.marque = 'Brand is required';
    if (!form.modele.trim()) newErrors.modele = 'Model is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:5000/api/equipment/${id}`, form);
      navigate('/equipment');
    } catch (error) {
      console.error("Error updating equipment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading equipment...</div>;

  return (
    <div className="equipment-form">
      <h1>Edit Equipment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            name="type_materiel"
            value={form.type_materiel}
            onChange={handleChange}
            className={errors.type_materiel ? 'error' : ''}
          />
          {errors.type_materiel && <span className="error-message">{errors.type_materiel}</span>}
        </div>

        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            name="marque"
            value={form.marque}
            onChange={handleChange}
            className={errors.marque ? 'error' : ''}
          />
          {errors.marque && <span className="error-message">{errors.marque}</span>}
        </div>

        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            name="modele"
            value={form.modele}
            onChange={handleChange}
            className={errors.modele ? 'error' : ''}
          />
          {errors.modele && <span className="error-message">{errors.modele}</span>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="etat"
            value={form.etat}
            onChange={handleChange}
          >
            <option value="Disponible">Available</option>
            <option value="Attribué">Assigned</option>
            <option value="En réparation">In Repair</option>
            <option value="Hors service">Out of Service</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/equipment')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEquipment;