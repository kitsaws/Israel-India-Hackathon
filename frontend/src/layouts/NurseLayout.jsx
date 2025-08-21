import React from 'react'
import Navbar from '../components/nurse/Navbar'

const NurseLayout = ({ children }) => {
  return (
    <div className='min-h-0 max-h-screen app-container flex flex-col'>
      <Navbar />
      <main className='flex-1 w-full flex p-5'>
        {children}
      </main>
    </div>
  )
}

export default NurseLayout
