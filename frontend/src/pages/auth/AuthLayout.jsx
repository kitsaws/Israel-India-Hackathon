import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const authType = location.pathname.includes('login') ? 'login' : 'signup';
  const handleAuthSwitch = (type) => {
    navigate(`/role-select/${type.toLowerCase()}`);
  }

  return (
    <div className='overflow-y-auto h-9/10 card w-1/3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-primary shadow-lg rounded-xl'>
      <div className="card-header w-full text-center">
        <h2 className='text-3xl text-accent font-bold mb-2'>{authType === 'login' ? 'Log In' : 'Sign Up'}</h2>
        <p className='text-md text-text-muted'>Welcome back to VentiBridge</p>
      </div>
      <div className="card-content">
        {children}
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

export default AuthLayout
