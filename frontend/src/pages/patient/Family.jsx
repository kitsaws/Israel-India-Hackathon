import React from 'react'
import PatientLayout from '../../layouts/PatientLayout'
import { Heart } from 'lucide-react'

const Family = () => {
  const family = [
    {"name": "John Smith", "relation": "Father", "contact": "555-123-4567"},
    {"name": "Mary Smith", "relation": "Mother", "contact": "555-987-6543"},
    {"name": "Emily Smith", "relation": "Daughter", "contact": "555-222-3344"},
    {"name": "Daniel Smith", "relation": "Son", "contact": "555-333-4455"}
]

  return (
    <PatientLayout>
      <div className='p-5 w-full flex justify-center gap-5 items-center mt-5'>
        <h2 className='text-4xl text-accent font-semibold' >Stay in Touch</h2>
        <Heart size={30} className='text-accent' />
      </div>
      <div className='p-5 mt-5 w-full flex flex-wrap justify-center items-center gap-8 text-2xl'>
        {family.map(member => {
          return (
            <div className='rounded-xl bg-primary shadow-md h-36 py-8 px-6 flex flex-col justify-center items-center '>
              <h3 className='text-2xl font-semibold'>{member.name}</h3>
              <h4 className='text-lg text-text-muted'>{member.relation}</h4>
              <p className='text-xl mt-5'>{member.contact}</p>
            </div>
          )
        })}
      </div>
    </PatientLayout>
  )
}

export default Family
