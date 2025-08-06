import React, { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'
import Button from '../../components/auth/Button'
import AuthLayout from './AuthLayout'

const roles = [
  { id: 'patient', label: 'Patient', icon: <span>🏥</span> },
  { id: 'doctor', label: 'Doctor', icon: <span>👨‍⚕️</span> },
  { id: 'nurse', label: 'Nurse', icon: <span>👩‍⚕️</span> },
  { id: 'family', label: 'Family Member', icon: <span>👪</span> },
];

const RoleSelection1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateRole, clearRole } = useRole();

  // useEffect(() => {
  //   const isAtRoleSelect =
  //     location.pathname === '/role-select/login' ||
  //     location.pathname === '/role-select/signup';

  //   if (isAtRoleSelect) {
  //     clearRole();
  //     console.log('Role cleared on visiting role-select route');
  //   }
  // }, [location.pathname]);


  const authType = location.pathname.includes('login') ? 'login' : 'signup';
  const handleRoleSelect = (roleId) => {
    console.log(`Selected Role: ${roleId}, Auth Type: ${authType}`);
    updateRole(roleId);

    navigate(`/${roleId}/${authType}`);
  }

  return (
    <AuthLayout>
      <div className="role-selection">
        <p className="text-lg font-semibold mb-4">Select your role:</p>
        <div className="flex flex-col justify-center items-center gap-4">
          {roles.map((role) => (
            <Button
              key={role.id}
              authType={authType}
              roleLabel={role.label}
              roleIcon={role.icon}
              onClick={() => handleRoleSelect(role.id)}
            />
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}

export default RoleSelection1
