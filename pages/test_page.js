import Form from '../components/Form';
import { useState } from 'react';

export default function TestPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = () => {
    if (!formData.username || !formData.password) {
      setError('All fields are required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setSuccess('Form submitted successfully!');
    setError('');
  };

  const fields = [
    {
      type: 'text',
      placeholder: 'Username',
      value: formData.username,
      onChange: handleInputChange('username'),
      error: error && !formData.username ? 'Username is required' : '',
    },
    {
      type: 'password',
      placeholder: 'Password',
      value: formData.password,
      onChange: handleInputChange('password'),
      error: error && !formData.password ? 'Password is required' : '',
    },
  ];

  return (
    <div className="flex items-center justify-center bg-background">
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Login"
        errorMessage={error}
        successMessage={success}
      />
    </div>
  );
}
