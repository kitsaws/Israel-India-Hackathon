import { TriangleAlert, Heart, Phone, Clock } from 'lucide-react'
import SidebarTiles from '../ui/SidebarTiles'
import axios from 'axios'

const EmergencySidebar = () => {
  const handleNurseCall = async () => {
    try {
      await axios.post('http://localhost:3000/api/call/connect', {}, { withCredentials: true })
      console.log('Calling Nurse...')
    } catch (err) {
      console.error('Error calling the nurse: ', err);
    }
  };

  return (
    <div className='emergency-sidebar bg-secondary w-[20%] py-8 px-4'>
      <div id="logo" className='flex flex-col justify-center items-center text-2xl font-bold text-secondary-text'>
        <TriangleAlert size={60} />
        <span>Emergency Services</span>
      </div>
      <div className='flex flex-col gap-6 mt-6'>
        <button onClick={handleNurseCall}>
          <SidebarTiles logo={<Phone />} title={'Call Nurse'} />
        </button>
        <SidebarTiles logo={<TriangleAlert />} title={'Pain'} />
        <SidebarTiles logo={<Heart />} title={'Breathing'} />
        <SidebarTiles logo={<Clock />} title={'Urgent'} />
      </div>
    </div>
  )
}

export default EmergencySidebar
