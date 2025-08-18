// AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useRole } from './RoleContext';
import axios from 'axios';

export const AuthProvider = ({ children }) => {
    const { setRole } = useRole();
    const [auth, setAuth] = useState({ loading: true, user: null, role: null });
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/auth/me`,
                    { withCredentials: true }
                );
                setAuth({ loading: false, user: response.data.user, role: response.data.role });
                setRole(response.data.role);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuth({ loading: false, user: null, role: null });
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {!auth.loading && children}
        </AuthContext.Provider>
    );
};
