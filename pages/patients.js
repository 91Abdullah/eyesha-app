// /pages/patients.js
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Form from '../components/Form';
import API from './api';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/patients')
      .then((response) => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError('');
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.age) {
      setError('All fields are required.');
      return;
    }

    API.post('/admin/patients', formData)
      .then((response) => {
        setPatients([...patients, response.data]);
        setFormVisible(false);
        setFormData({ name: '', age: '' });
      })
      .catch(() => setError('Failed to add patient.'));
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text mb-8">Patient Management</h1>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setFormVisible(true)} variant="primary">
          Add Patient
        </Button>
        <input
          type="text"
          placeholder="Search patients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
      </div>
      {formVisible && (
        <Form
          fields={[{
              type: 'text',
              placeholder: 'Name',
              value: formData.name,
              onChange: handleInputChange('name'),
              error: error && !formData.name ? 'Name is required' : '',
            },
            {
              type: 'number',
              placeholder: 'Age',
              value: formData.age,
              onChange: handleInputChange('age'),
              error: error && !formData.age ? 'Age is required' : '',
            },
          ]}
          onSubmit={handleFormSubmit}
          submitText="Add Patient"
          errorMessage={error}
        />
      )}
      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="card">
              <h3 className="text-xl font-bold text-text">{patient.name}</h3>
              <p className="text-gray-600">Age: {patient.age}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
