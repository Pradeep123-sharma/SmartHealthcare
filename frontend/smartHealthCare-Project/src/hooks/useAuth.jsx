import { useContext } from 'react';
import { AuthContext } from '../pages/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};