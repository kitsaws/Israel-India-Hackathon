// import React, { useState, useEffect } from 'react'
import HomePageCard from '../../components/ui/HomePageCard'
import { Heart, Clock } from 'lucide-react'
import useClock from '../../hooks/useClock'
import PatientLayout from '../../layouts/PatientLayout'
import { useAuth } from '../../context/AuthContext'

const Home = () => {
  const { date, time } = useClock();
  const { auth } = useAuth();
  const user = auth.user;

  return (
    <PatientLayout>
      <div className='py-8   px-26 flex flex-col gap-5 justify-center items-center'>
        {/* welcome msg */}
        <div id="welcome-message" className='flex flex-col justify-center items-center gap-1'>
          <h2 className='text-4xl font-bold'>Welcome, {user.name}</h2>
          <p className='text-lg font-semibold text-text-muted'>{date}</p>
          <p className='text-md font-semibold text-accent'>{time}</p>
        </div>
        {/* change the name of 'card-container' later */}
        <div id="card-container" className='w-full flex justify-around items-center'>
          <HomePageCard logo={<Clock />} title={'Next Check-in'} description={'Dr. Smith at 2:30 PM'} isBordered={true} />
          <HomePageCard logo={<Heart />} title={'Care Team'} description={'Nurse Sarah is on duty'} isBordered={true} />
        </div>
        {/* today's highlights */}
        <div id='highlights' className='flex flex-col justify-around items-center'>
          <h3 className='text-2xl font-bold'>Today's Highlights</h3>
          <div className='flex justify-around items-center'>
            <HomePageCard logo={'3/4'} title={''} description={'Goals Completed'} isBordered={false} />
            <HomePageCard logo={'2'} title={''} description={'Family Calls'} isBordered={false} />
            <HomePageCard logo={'45 min'} title={''} description={'Relaxation Time'} isBordered={false} />
          </div>
        </div>
        {/* motivational message */}
        <div>
          <h3 className='text-lg text-accent text-center'>
            You're doing great today!
          </h3>
          <p className='text-text-muted text-center'>
            Your recovery is progressing well. Remember that your family and care team are here for you.
          </p>
        </div>
      </div>
    </PatientLayout>
  )
}

export default Home;