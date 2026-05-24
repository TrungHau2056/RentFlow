import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to consume the AuthContext
 * @returns {{
 *   isAuthenticated: boolean,
 *   loading: boolean,
 *   login: (email, password) => Promise<{success: boolean, message: string}>,
 *   logout: () => void
 * }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
