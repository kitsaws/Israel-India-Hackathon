import React from 'react'
import PatientLayout from '../../layouts/PatientLayout'
import { useAuth } from '../../context/AuthContext'

const Goals = () => {
  const { auth } = useAuth();
  const goals = [
    'Watch 10 minutes of calming videos',
    'Communicate with family twice',
    'Practice deep breathing exercises',
    'Listen to favorite music'
  ]

  return (
    <PatientLayout>
      <div className='p-5 w-full flex justify-center items-center mt-5'>
        <h2 className='text-4xl text-accent font-semibold' >Today's Goals</h2>
      </div>
      <div className='p-5 mt-5 w-full flex flex-col justify-center items-center gap-4 text-2xl'>
        {goals.map(goal => {
          return (
            <div className='w-[60%] rounded-xl bg-primary shadow-md py-8 px-6 flex justify-center items-center'>
              <p>{goal}</p>
            </div>
          )
        })}
      </div>
    </PatientLayout>
  )
}

export default Goals
