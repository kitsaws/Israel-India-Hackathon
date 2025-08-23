import { Routes, Route, Navigate } from 'react-router-dom'
import RoleSelection1 from '../pages/auth/RoleSelection1'

import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import PrivateRoutes from './PrivateRoutes'

import Home from '../pages/patient/Home'
import ComfortControl from '../pages/patient/ComfortControl'
import Media from '../pages/patient/Media'
import Family from '../pages/patient/Family'
import Goals from '../pages/patient/Goals'

import { PatientProvider } from '../context/nurse/PatientProvider'
import { AuthProvider } from '../context/AuthProvider'
import ProfileNurse from '../pages/nurse/Profile'
import PatientDashboardNurse from '../pages/nurse/PatientDashboard'
import PatientGoalsNurse from '../pages/nurse/PatientGoals'

import ProfileDoctor from '../pages/doctor/Profile'
import PatientDashboardDoctor from '../pages/doctor/PatientDashboard'

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
      <Route path='/patient' element={
        <AuthProvider>
          <PrivateRoutes />
        </AuthProvider>
      }>
        <Route index element={<Navigate to='home' />} />
        <Route path='home' element={<Home />} />
        <Route path='comfort-contorl' element={<ComfortControl />} />
        <Route path='media' element={<Media />} />
        <Route path='family' element={<Family />} />
        <Route path='goals' element={<Goals />} />
      </Route>
      {/* Nurse Routes */}
      <Route path='/nurse' element={
        <PatientProvider>
          <PrivateRoutes />
        </PatientProvider>
      }>
        <Route index element={<Navigate to={'profile'} />} />
        <Route path='profile' element={<ProfileNurse />} />
        <Route path='patient-dashboard' element={<PatientDashboardNurse />} />
        <Route path='patient-goals' element={<PatientGoalsNurse />} />
      </Route>
      {/* Doctor Routes */}
      <Route path='/doctor' element={
        <PatientProvider>
          <PrivateRoutes />
        </PatientProvider>
      }>
        <Route index element={<Navigate to={'profile'} />} />
        <Route path='profile' element={<ProfileDoctor />} />
        <Route path='patient-dashboard' element={<PatientDashboardDoctor />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes;
