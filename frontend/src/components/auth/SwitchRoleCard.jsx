import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'

const SwitchRoleCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authType = location.pathname.includes('login') ? 'login' : 'signup';
    const { role } = useRole();

    const handleSwitchRole = () => {
        console.log('Switching role...');
        navigate(`/role-select/${authType}`);
    }
    
    return (
        <div className='currentRole flex flex-col items-center justify-center w-full border-2 border-accent p-4 rounded-xl'>
            <p className='text-lg font-semibold mb-4'>🏥 {authType === 'login' ? 'Login' : 'Signup'} as {String(role).charAt(0).toUpperCase() + String(role).slice(1)}</p>
            <button className='ml-2 text-accent cursor-pointer font-semibold px-4 py-2 rounded-lg hover:border-1 hover:border-accent' onClick={() => handleSwitchRole()}>Switch Role</button>
        </div>
    )
}

export default SwitchRoleCard
