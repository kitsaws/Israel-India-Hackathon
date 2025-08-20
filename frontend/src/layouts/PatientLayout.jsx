import React, { useEffect } from 'react'
import NavBar from '../components/patient/NavBar';
import EmergencySidebar from '../components/patient/EmergencySidebar';
import EyeTrackingToast from '../components/ui/EyeTrackingToast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientLayout = ({ children }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!auth.user) {
            navigate('/role-select/login', { replace: true });
        }
    }, [auth.user, navigate]);

    if (!auth.user) {
        return null; // Prevent rendering until redirect is handled
    }

    return (
        <div className='min-h-0 max-h-screen app-container flex flex-col bg-bg'>
            <NavBar />
            <main className='h-[80vh] w-full flex'>
                <div className='min-h-0 h-full w-[80%] overflow-y-auto'>
                    {children}
                </div>
                <EmergencySidebar />
            </main>
            <EyeTrackingToast />
        </div>
    )
}

export default PatientLayout
