import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Patients', path: '/patients' },
    { name: 'Create Patient', path: '/create-patient' },
    { name: 'Users', path: '/users' },
    { name: 'Create User', path: '/admin/create-user' },
    { name: 'Image Upload', path: '/upload-image' },
    { name: 'Account', path: '/account' },
  ];

  useEffect(() => {
     console.log('isLoggedIn:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <nav className="bg-background px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Eyesha Logo" className="h-10 mr-4" />
        </div>
        <div className="flex space-x-6">
          {isLoggedIn
            ? navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-text"
                >
                  {item.name}
                </a>
              ))
            : null}
          {isLoggedIn ? (
            <a onClick={logout} className="text-text">
              Logout
            </a>
          ) : (
            <a href="/login" className="text-text">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}
