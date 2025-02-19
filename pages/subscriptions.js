import { useEffect, useState } from 'react';
import API from './api';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await API.get('/admin/subscriptions');
        setSubscriptions(response.data);
      } catch (err) {
        setError('Failed to fetch subscriptions');
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">Subscriptions</h1>
        </div>
      </header>
      <main className="px-4 py-6 mx-auto max-w-7xl">
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {subscriptions.map((sub) => (
            <li key={sub.id} className="p-4 my-2 bg-white rounded shadow">
              <p>
                <strong>{sub.name}</strong>: ${sub.monthly_cost} / month
              </p>
              <p>Usage Limit: {sub.usage_limit}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
