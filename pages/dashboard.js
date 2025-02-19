// /pages/dashboard.js (Dashboard)
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, patients: 0, predictions: 0 });

  useEffect(() => {
    // Mock API call to fetch stats
    setTimeout(() => {
      setStats({ users: 120, patients: 300, predictions: 1500 });
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-bold text-text mb-2">Total Users</h3>
          <p className="text-2xl font-semibold text-highlight">{stats.users}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-bold text-text mb-2">Total Patients</h3>
          <p className="text-2xl font-semibold text-highlight">{stats.patients}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-bold text-text mb-2">Total Predictions</h3>
          <p className="text-2xl font-semibold text-highlight">{stats.predictions}</p>
        </div>
      </div>
      <div className="mt-16 bg-white shadow rounded p-6">
        <h3 className="text-xl font-bold text-text mb-4">Recent Activity</h3>
        <ul className="text-gray-600 space-y-2">
          <li>User <strong>John Doe</strong> uploaded a retinal image for prediction.</li>
          <li>New patient <strong>Jane Smith</strong> added to the system.</li>
          <li>Prediction generated for patient <strong>Mark Johnson</strong>.</li>
        </ul>
      </div>
    </div>
  );
}