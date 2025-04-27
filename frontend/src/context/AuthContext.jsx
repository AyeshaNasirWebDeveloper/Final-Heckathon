import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getUserProfile, updateUserProfile } from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getUserProfile();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // If userData is null, clear the token
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const data = await registerUser(userData);
      localStorage.setItem('token', data.token);
      setUser(data);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const data = await loginUser(credentials);
      localStorage.setItem('token', data.token);
      setUser(data);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const data = await updateUserProfile(userData);
      setUser(prevUser => ({ ...prevUser, ...data }));
      return data;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
