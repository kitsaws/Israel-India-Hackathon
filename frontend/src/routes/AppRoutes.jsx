import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
// import RoleSelection from '../pages/auth/RoleSelection'
import RoleSelection1 from '../pages/auth/RoleSelection1'
import { useRole } from '../context/RoleContext'

import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'

import PatientLogin from '../pages/auth/login/PatientLogin'
import PatientSignup from '../pages/auth/signup/PatientSignup'
import Home from '../pages/patient/Home'
import ComfortControl from '../pages/patient/ComfortControl'
import Media from '../pages/patient/Media'
import Family from '../pages/patient/Family'
import Goals from '../pages/patient/Goals'

import PrivateRoutes from './PrivateRoutes'

const AppRoutes = () => {    
  return (
    <Routes>
        <Route path='/' element={<Navigate to="/role-select/login" replace />} />
        <Route path='/role-select/login' element={<RoleSelection1 />} />
        <Route path='/role-select/signup' element={<RoleSelection1 />} />
        <Route path='/:role/login' element={<LoginPage />} />
        <Route path='/:role/signup' element={<SignupPage />} />

        {/* Protected Role-based Routes */}
        {/* Patient Routes */}
        <Route
            path='/patient/home'
            element={
                <PrivateRoutes role='patient'>
                    <Home />
                </PrivateRoutes>
            }
         />
        <Route
            path='/patient/comfort-control'
            element={
                <PrivateRoutes role='patient'>
                    <ComfortControl />
                </PrivateRoutes>
            }
         />
        <Route
            path='/patient/media'
            element={
                <PrivateRoutes role='patient'>
                    <Media />
                </PrivateRoutes>
            }
         />
        <Route
            path='/patient/family'
            element={
                <PrivateRoutes role='patient'>
                    <Family />
                </PrivateRoutes>
            }
         />
        <Route
            path='/patient/goals'
            element={
                <PrivateRoutes role='patient'>
                    <Goals />
                </PrivateRoutes>
            }
         />
    </Routes>
  )
}

export default AppRoutes;
