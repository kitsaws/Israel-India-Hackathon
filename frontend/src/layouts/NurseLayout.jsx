import React from 'react'
import Navbar from '../components/Navbar'

const NurseLayout = ({ children }) => {
  return (
    <div className='min-h-0 max-h-screen app-container flex flex-col bg-bg'>
      <Navbar />
      <main className='flex-1 w-full flex'>
        {children}
      </main>
    </div>
  )
}

export default NurseLayout
