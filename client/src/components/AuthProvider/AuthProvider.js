import React, { createContext, useContext, useEffect, useState } from 'react';
import { verifyAccount } from 'api/Account';

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  isLoggedIn: false,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const isAuth = async () => {
      const isVerified = await verifyAccount();
      setIsLoggedIn(isVerified);
    };

    isAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;