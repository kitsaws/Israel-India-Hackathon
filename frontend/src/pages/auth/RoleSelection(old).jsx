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

const RoleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateRole, clearRole } = useRole();

  useEffect(() => {
    clearRole();
  }, [clearRole])
  

  const authType = location.pathname.includes('login') ? 'login' : 'signup';
  const handleRoleSelect = (roleId) => {
    console.log(`Selected Role: ${roleId}, Auth Type: ${authType}`);
    updateRole(roleId);
    navigate(`/${roleId}/${authType}`);
  }
  const handleAuthSwitch = (type) => {
    navigate(`/role-select/${type.toLowerCase()}`);
  }

  return (
    <div className='card w-1/3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-primary shadow-lg rounded-xl'>
      <div className="card-header w-full mb-6 text-center">
        <h2 className='text-3xl text-accent font-bold mb-2'>{authType === 'login' ? 'Log In' : 'Sign Up'}</h2>
        <p className='text-md text-text-muted'>Welcome back to VentiBridge</p>
      </div>
      <div className="card-content">
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
        <div className='switch-auth-type flex justify-center items-center mt-6'>
          {authType === 'login' ? (
            <p className='text-sm text-text-muted mt-4'>Don't have an account?
              <span className='text-accent cursor-pointer font-semibold ml-2' onClick={() => handleAuthSwitch('signup')}>
                Sign Up
              </span>
            </p>
          ) : (
            <p className='text-sm text-text-muted mt-4'>Already have an account?
              <span className='text-accent cursor-pointer font-semibold ml-2' onClick={() => handleAuthSwitch('login')}>
                Log In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
