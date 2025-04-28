import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Checking token:', token);
    if (token) {
      console.log('Token found:', token);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      if (router.pathname !== '/') {
        router.push('/login');
      }
    }
  }, [router.pathname]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    router.push('/'); // Redirect after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
