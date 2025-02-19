import { useState, useEffect } from 'react';
import API from '../api';

export default function CreateUser() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', subscriptionId: '' });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await API.get('/admin/subscriptions');
      setSubscriptions(response.data);
    };
    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/users', {
        username: formData.username,
        password: formData.password,
        subscription_id: formData.subscriptionId,
      });
      alert('User created successfully!');
    } catch (err) {
      console.error('Error creating user', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <select
        value={formData.subscriptionId}
        onChange={(e) => setFormData({ ...formData, subscriptionId: e.target.value })}
      >
        <option value="">Select Subscription</option>
        {subscriptions.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>
      <button type="submit">Create User</button>
    </form>
  );
}
