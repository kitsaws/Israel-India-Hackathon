import React from 'react'
import PatientLayout from '../../layouts/PatientLayout'
import { useAuth } from '../../context/AuthContext'

const Goals = () => {
  const { auth } = useAuth();
  
  return (
    <PatientLayout>
      
    </PatientLayout>
  )
}

export default Goals
