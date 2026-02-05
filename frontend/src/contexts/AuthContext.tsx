import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import type { TokenInterface, UserInterface } from '../interfaces/UserInterface';
import { LOCAL_STORAGE_KEYS } from '../constants/localstorage';

interface AuthContextData {
    user: UserInterface | undefined;
    setUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>;
    logout: () => Promise<void>;
    doLogin:(userData: UserInterface, token: TokenInterface) => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<UserInterface | undefined>(undefined);

    useEffect(() => {
        const storagedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
        const storagedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        if (storagedToken && storagedUser) {
            setUser(JSON.parse(storagedUser));
        }
    }, []);

    function doLogin(userData: UserInterface, token: TokenInterface) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, JSON.stringify(token))
        setUser(userData);
    }

    async function logout() {
        setUser(undefined);
        localStorage.removeItem('@App:user');
        localStorage.removeItem('@App:token');
        window.location.href = '/login';
    }

    return (
        <AuthContext.Provider value={{ setUser, user, logout, doLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
