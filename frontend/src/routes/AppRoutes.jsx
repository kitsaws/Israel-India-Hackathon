import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RoleSelection1 from '../pages/auth/RoleSelection1'

import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'

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
        <Route path='/patient' element={ <PrivateRoutes /> }>
            <Route path='home' element={<Home />} />
            <Route path='comfort-contorl' element={<ComfortControl />} />
            <Route path='media' element={<Media />} />
            <Route path='family' element={<Family />} />
            <Route path='goals' element={<Goals />} />
        </Route>
    </Routes>
  )
}

export default AppRoutes;
