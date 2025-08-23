import { NavLink } from "react-router-dom"
import { User, Activity, Target, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePatient } from '../context/nurse/PatientContext'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import Logo from '../assets/ventibridge.png'

const NavbarButton = ({ logo, text, activeClass }) => {
    return (
        <div className={`px-4 py-2 rounded-full transition-all duration-300 ${activeClass === '' ? 'hover:bg-orange-400' : 'hover:opacity-90'} hover:text-white flex justify-center items-center gap-2 ${activeClass}`}>
            <span>{logo}</span>
            <span>{text}</span>
        </div>
    );
}

const Navbar = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const { patient, setPatient } = usePatient();

    const handleLogout = async () => {
        try {
            await axios.post(
                `http://localhost:3000/api/auth/logout`,
                {},
                { withCredentials: true }
            );

            console.log('Nurse Logout Successful');

            setAuth({ loading: false, user: null, role: null });
            setPatient({loading: false, data: null});

            navigate('/role-select/login');
        } catch (err) {
            console.error('Failed to logout', err);
        }
    };

    return (
        <nav className='w-full shadow-md flex justify-between items-center px-10 py-4'>
            <div>
                <ul className="flex justify-center items-center gap-7">
                    <NavLink to={`/${auth.role}/`}>
                        <img src={Logo} width={90} alt="" />
                    </NavLink>
                    <NavLink to={`/${auth.role}/profile`}>
                        {({ isActive }) => (
                            <NavbarButton logo={<User size={20} />} text={'Profile'} activeClass={(isActive) ? 'bg-accent text-white' : ''} />
                        )}
                    </NavLink>
                    {patient &&
                        <NavLink to={`/${auth.role}/patient-dashboard`}>
                            {({ isActive }) => (
                                <NavbarButton logo={<Activity />} text={'Patient Dashboard'} activeClass={(isActive) ? 'bg-accent text-white' : ''} />
                            )}
                        </NavLink>
                    }
                    {patient && auth.role === 'nurse' &&
                        <NavLink to={`/nurse/patient-goals`}>
                            {({ isActive }) => (
                                <NavbarButton logo={<Target />} text={'Patient Goals'} activeClass={(isActive) ? 'bg-accent text-white' : ''} />
                            )}
                        </NavLink>
                    }
                </ul>
            </div>
            <div className="logout">
                <button
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-2 flex justify-center items-center gap-2 border-1 text-secondary-text transition-all duration-300 hover:text-white hover:bg-secondary-text rounded-full"
                >
                    <LogOut />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar
