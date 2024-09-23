import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';

const useAuth = () => {
  const authStore = useContext(AuthContext);

  return authStore;
};

export default useAuth;
