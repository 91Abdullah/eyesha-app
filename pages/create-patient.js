import { useState } from 'react';
import API from './api';
import Spinner from '../components/Spinner';

export default function CreatePatient() {
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', contact: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/patients', formData);
      alert(`Patient created with ID: ${response.data.id}`);
    } catch (err) {
      console.error('Error creating patient', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
      />
      <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input
        type="text"
        placeholder="Contact"
        value={formData.contact}
        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
      />
      <button type="submit">
        {loading ? <Spinner /> : 'Create Patient'}
      </button>
    </form>
  );
}
