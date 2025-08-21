import React from 'react'
import Navbar from '../components/nurse/Navbar'

const NurseLayout = ({ children }) => {
  return (
    <div className='min-h-0 max-h-screen app-container flex flex-col overflow-y-auto'>
      <Navbar />
      <main className='flex-1 w-full flex flex-col gap-4 py-5 px-16'>
        {children}
      </main>
    </div>
  )
}

export default NurseLayout
