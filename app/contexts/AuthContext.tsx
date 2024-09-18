import { createContext } from 'react';

export interface AuthStore {
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthStore>({
  isLoggedIn: false,
});

export default AuthContext;
