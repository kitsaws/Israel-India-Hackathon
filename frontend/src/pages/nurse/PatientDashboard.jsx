import NurseLayout from '../layouts/NurseLayout'
import { Activity, LogOut } from 'lucide-react'

const PatientDashboard = () => {
    const handlePatientLogout = async () => {
        
    }

    return (
        <NurseLayout>
            <div className='w-full header flex justify-between items-center py-2 px-6'>
                <h2 className='flex gap-2 justify-center items-center'>
                    <span className='text-blue-400'><Activity size={30} /></span>
                    <span className='text-2xl font-semibold'>Patient Dashboard</span>
                </h2>
                <button
                    onClick={handlePatientLogout}
                    className="cursor-pointer px-4 py-2 flex justify-center items-center gap-2 border-1 text-secondary-text transition-all duration-300 hover:text-white hover:bg-secondary-text rounded-full"
                >
                    <LogOut />
                    <span>Logout Patient</span>
                </button>
            </div>

            <div className=''></div>
        </NurseLayout>
    )
}

export default PatientDashboard
