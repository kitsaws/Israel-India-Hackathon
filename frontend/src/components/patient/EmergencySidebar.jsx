import { TriangleAlert, Heart, Phone, Clock } from 'lucide-react'
import SidebarTiles from '../ui/SidebarTiles'

const EmergencySidebar = () => {
  return (
    <div className='emergency-sidebar bg-secondary w-[20%] py-8 px-2'>
      <div id="logo" className='flex flex-col justify-center items-center text-2xl font-bold text-secondary-text'>
        <TriangleAlert size={60} />
        <span>Emergency Services</span>
      </div>
      <div className='flex flex-col gap-6 mt-6'>
        <SidebarTiles logo={<Phone />} title={'Call Nurse'} />
        <SidebarTiles logo={<TriangleAlert />} title={'Pain'} />
        <SidebarTiles logo={<Heart />} title={'Breathing'} />
        <SidebarTiles logo={<Clock />} title={'Urgent'} />
      </div>
    </div>
  )
}

export default EmergencySidebar
