import React, { useEffect } from 'react'
import NavBar from '../components/patient/NavBar';
import EmergencySidebar from '../components/patient/EmergencySidebar';
import EyeTrackingToast from '../components/ui/EyeTrackingToast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientLayout = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Prevent rendering until redirect is handled
    }

    return (
        <div className='app-container flex flex-col bg-bg'>
            <NavBar />
            <main className='w-full flex-1 flex overflow-hidden'>
                <div className='flex-[4] overflow-y-auto py-10 px-6'>
                    {children}
                </div>
                <EmergencySidebar className='flex-[1] py-10' />
            </main>
            <EyeTrackingToast />
        </div>
    )
}

export default PatientLayout
