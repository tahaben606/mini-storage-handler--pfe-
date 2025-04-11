import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEquipment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type_materiel: '',
    marque: '',
    modele: '',
    etat: 'Disponible',
    price: '',  // Price field
    date_achat: '',  // Purchase date field
    quantity: ''  // Quantity field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.type_materiel.trim()) newErrors.type_materiel = 'Type is required';
    if (!form.marque.trim()) newErrors.marque = 'Brand is required';
    if (!form.modele.trim()) newErrors.modele = 'Model is required';
    if (!form.price.trim() || form.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!form.date_achat.trim()) newErrors.date_achat = 'Purchase date is required';
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = 'Quantity is required and must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
if (!validateForm()) return;

  
  setIsSubmitting(true);
  
  try {
    // Check the form data before submitting
    console.log('Submitting form data:', form);
    
    const response = await axios.post('http://localhost:5000/api/equipment', form);
    
    console.log('Response from API:', response.data);
    navigate('/equipment');  // Navigate to equipment list page or appropriate route
  } catch (error) {
    console.error("Error adding equipment:", error.response || error.message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="add-equipment-page">
      <h1 className="text-2xl font-bold mb-6">Add New Equipment</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Type</label>
          <input
            type="text"
            name="type_materiel"
            value={form.type_materiel}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.type_materiel ? 'border-red-500' : ''}`}
            required
          />
          {errors.type_materiel && <p className="text-red-500 text-sm">{errors.type_materiel}</p>}
        </div>

        <div>
          <label className="block mb-1">Brand</label>
          <input
            type="text"
            name="marque"
            value={form.marque}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.marque ? 'border-red-500' : ''}`}
            required
          />
          {errors.marque && <p className="text-red-500 text-sm">{errors.marque}</p>}
        </div>

        <div>
          <label className="block mb-1">Model</label>
          <input
            type="text"
            name="modele"
            value={form.modele}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.modele ? 'border-red-500' : ''}`}
            required
          />
          {errors.modele && <p className="text-red-500 text-sm">{errors.modele}</p>}
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            name="etat"
            value={form.etat}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.etat ? 'border-red-500' : ''}`}
            required
          >
            <option value="Disponible">Available</option>
            <option value="Attribué">Assigned</option>
            <option value="En réparation">In Repair</option>
            <option value="Hors service">Out of Service</option>
          </select>
          {errors.etat && <p className="text-red-500 text-sm">{errors.etat}</p>}
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
            required
            min="1"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div>
          <label className="block mb-1">Purchase Date</label>
          <input
            type="date"
            name="date_achat"
            value={form.date_achat}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.date_achat ? 'border-red-500' : ''}`}
            required
          />
          {errors.date_achat && <p className="text-red-500 text-sm">{errors.date_achat}</p>}
        </div>

        <div>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.quantity ? 'border-red-500' : ''}`}
            required
            min="1"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        <div className="flex space-x-4 pt-4">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Equipment'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/equipment')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEquipment;
