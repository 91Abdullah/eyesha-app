import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from './api'

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/admin-login', { username, password });
      login(response.data.access_token);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/admin-login', { username, password });
      login(response.data.access_token);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-lightGray to-background">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Eyesha Logo" className="h-12 mb-2" />
          <p className="text-gray-600 font-medium text-sm">AI Smart Healthcare for All</p>
        </div>
        <h1 className="text-2xl font-bold text-text text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              name="username"
              type="text"
              placeholder="Username"
              className="block w-full p-3 border border-lightGray rounded focus:ring-2 focus:ring-highlight focus:outline-none"
              required
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="block w-full p-3 border border-lightGray rounded focus:ring-2 focus:ring-highlight focus:outline-none"
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-highlight text-white py-3 rounded hover:bg-secondary transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Forgot your password? <a href="#" className="text-highlight hover:underline">Reset here</a>
        </p>
      </div>
    </div>
  );
}
