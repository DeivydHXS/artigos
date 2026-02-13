import React, { createContext, useEffect, useState, type ReactNode } from "react";
import type { TokenInterface, UserInterface } from "../interfaces/UserInterface";
import { LOCAL_STORAGE_KEYS } from "../constants/localstorage";

interface AuthContextData {
  user: UserInterface | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
  logout: () => Promise<void>;
  doLogin: (userData: UserInterface, token: TokenInterface) => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    const storagedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
    }

    setLoading(false);
  }, []);

  function doLogin(userData: UserInterface, token: TokenInterface) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, JSON.stringify(token));
    setUser(userData);
  }

  async function logout() {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, doLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
