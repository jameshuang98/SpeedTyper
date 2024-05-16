import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { JwtPayload, jwtDecode } from "jwt-decode";
import { User } from 'constants/types';

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
};


const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => null,
    logout: () => null
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

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        console.log("token:", token)
        if (token) {
            const userData = decodeToken(token);
            console.log("userData", userData)
            setUser(userData);
        }
    }, []);

    const decodeToken = (token: string): User | null => {
        try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            const { id, username, email, firstName, lastName, profileImageURL } = decodedToken as User;
            console.log("decodedToken: ", decodedToken)
            const user: User = {
                id,
                username,
                email,
                firstName,
                lastName,
                profileImageURL
            };
            console.log("UserUser: ", user)

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
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};