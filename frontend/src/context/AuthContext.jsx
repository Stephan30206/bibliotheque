import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const id = localStorage.getItem('userId');
        const createdAt = localStorage.getItem('createdAt');
        return token ? { token, role, username, email, id, createdAt } : null;
    });

    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('createdAt', data.createdAt);
        setUser({
            token: data.token,
            role: data.role,
            username: data.username,
            email: data.email,
            id: data.id,
            createdAt: data.createdAt
        });
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
