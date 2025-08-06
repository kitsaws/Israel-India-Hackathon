// AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useRole } from './RoleContext';
import axios from 'axios';

export const AuthProvider = ({ children }) => {
    const { role } = useRole();
    const [auth, setAuth] = useState({ loading: true, user: null, role: null });
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/auth/${role}/check`);
                setAuth({ loading: false, user: response.data, role });
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuth({ loading: false, user: null, role: null });
            }
        };

        checkAuth();
    }, [role]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {!auth.loading && children}
        </AuthContext.Provider>
    );
};
