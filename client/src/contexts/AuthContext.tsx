import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { JwtPayload, jwtDecode } from "jwt-decode";

import { User } from 'constants/types';

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    userLoading: boolean;
};


const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => null,
    logout: () => null,
    userLoading: false
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a SnackbarProvider');
    }
    return context;
};

interface Props {
    children?: ReactNode
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const userData = decodeToken(token);
            setUser(userData);
        }
        setUserLoading(false);
    }, []);

    const decodeToken = (token: string): User | null => {
        try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            const { id, username, email, firstName, lastName, profileImageURL } = decodedToken as User;
            const user: User = {
                id,
                username,
                email,
                firstName,
                lastName,
                profileImageURL
            };

            return user;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const login = (token: string): void => {
        localStorage.setItem('jwtToken', token);
        const userData = decodeToken(token);
        setUser(userData);
    };

    const logout = (): void => {
        localStorage.removeItem("jwtToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, userLoading }}>
            {children}
        </AuthContext.Provider>
    );
};