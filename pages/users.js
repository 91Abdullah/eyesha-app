// /pages/users.js
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Form from '../components/Form';
import API from './api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/admin/users')
      .then((response) => {
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError('');
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.email) {
      setError('All fields are required.');
      return;
    }

    API.post('/admin/users', formData)
      .then((response) => {
        setUsers([...users, response.data.users]);
        setFormVisible(false);
        setFormData({ name: '', email: '' });
      })
      .catch(() => setError('Failed to add user.'));
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text mb-8">User Management</h1>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setFormVisible(true)} variant="primary">
          Add User
        </Button>
        <input
          type="text"
          placeholder="Search users"
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
              type: 'email',
              placeholder: 'Email',
              value: formData.email,
              onChange: handleInputChange('email'),
              error: error && !formData.email ? 'Email is required' : '',
            },
          ]}
          onSubmit={handleFormSubmit}
          submitText="Create User"
          errorMessage={error}
        />
      )}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card">
              <h3 className="text-xl font-bold text-text">{user.username}</h3>
              <p className="text-gray-600">{user.subscription}</p>
              <p className="text-gray-600">{user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}