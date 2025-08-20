import React, { useState, useEffect } from 'react';
import { RoleContext } from './RoleContext';

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const savedRole = localStorage.getItem('selectedRole');
        if (savedRole) setRole(savedRole);
    }, []);

    const updateRole = (newRole) => {
        setRole(newRole);
        localStorage.setItem('selectedRole', newRole);
    };
    const clearRole = () => {
        setRole(null);
        localStorage.removeItem('selectedRole');
    };

    return (
        <RoleContext.Provider value={{ role, updateRole, clearRole }}>
            {children}
        </RoleContext.Provider>
    );
}