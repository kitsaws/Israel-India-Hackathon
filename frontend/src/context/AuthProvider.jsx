// AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import Loading from '../components/Loading';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ loading: true, user: null, role: null });
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/auth/me`,
                    { withCredentials: true }
                );
                setAuth({ loading: false, user: response.data.user, role: response.data.role });
            } catch {
                console.error('Error checking authentication');
                setAuth({ loading: false, user: null, role: null });
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {auth.loading ? <Loading /> : children}
        </AuthContext.Provider>
    );
};
